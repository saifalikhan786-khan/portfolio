-- Admin auth & user management for Portfolio
-- Run in Supabase Dashboard → SQL Editor (after setup.sql)

create extension if not exists pgcrypto with schema extensions;

-- ─── Users table ───────────────────────────────────────────────────────────

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) >= 2),
  email text not null unique check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  mobile text,
  password_hash text not null,
  role text not null default 'admin' check (role in ('admin', 'super-admin')),
  created_at timestamptz not null default now()
);

create index if not exists users_email_idx on public.users (lower(email));
create index if not exists users_role_idx on public.users (role);

alter table public.users enable row level security;
-- No public policies — access only via security definer functions

-- Default super-admin account
insert into public.users (name, email, mobile, password_hash, role)
values (
  'super-admin',
  'superadmin@gmail.com',
  null,
  extensions.crypt('Hm20342878919', extensions.gen_salt('bf')),
  'super-admin'
)
on conflict (email) do nothing;

-- ─── Admin sessions ────────────────────────────────────────────────────────

create table if not exists public.admin_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  token text not null unique default encode(extensions.gen_random_bytes(32), 'hex'),
  expires_at timestamptz not null default (now() + interval '24 hours'),
  created_at timestamptz not null default now()
);

create index if not exists admin_sessions_token_idx on public.admin_sessions (token);
create index if not exists admin_sessions_expires_idx on public.admin_sessions (expires_at);

alter table public.admin_sessions enable row level security;

-- ─── Helpers ───────────────────────────────────────────────────────────────

create or replace function public.get_session_user(p_token text)
returns public.users
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user public.users%rowtype;
begin
  if p_token is null or trim(p_token) = '' then
    raise exception 'Not authenticated';
  end if;

  select u.* into v_user
  from public.admin_sessions s
  join public.users u on u.id = s.user_id
  where s.token = p_token
    and s.expires_at > now();

  if not found then
    raise exception 'Session expired or invalid';
  end if;

  return v_user;
end;
$$;

create or replace function public.user_to_json(u public.users)
returns json
language sql
immutable
as $$
  select json_build_object(
    'id', u.id,
    'name', u.name,
    'email', u.email,
    'mobile', u.mobile,
    'role', u.role,
    'created_at', u.created_at
  );
$$;

-- ─── Auth RPCs ───────────────────────────────────────────────────────────────

create or replace function public.login_admin(p_email text, p_password text)
returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_user public.users%rowtype;
  v_token text;
begin
  select * into v_user
  from public.users
  where lower(email) = lower(trim(p_email));

  if not found then
    raise exception 'Invalid email or password';
  end if;

  if v_user.password_hash != extensions.crypt(p_password, v_user.password_hash) then
    raise exception 'Invalid email or password';
  end if;

  delete from public.admin_sessions
  where user_id = v_user.id and expires_at < now();

  insert into public.admin_sessions (user_id, expires_at)
  values (v_user.id, now() + interval '24 hours')
  returning token into v_token;

  return json_build_object(
    'token', v_token,
    'user', public.user_to_json(v_user)
  );
end;
$$;

create or replace function public.logout_admin(p_token text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.admin_sessions where token = p_token;
  return true;
end;
$$;

create or replace function public.verify_admin_session(p_token text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user public.users%rowtype;
begin
  v_user := public.get_session_user(p_token);
  return public.user_to_json(v_user);
end;
$$;

-- ─── Contact messages (admin) ────────────────────────────────────────────────

create or replace function public.get_contact_messages(p_token text)
returns setof public.contact_messages
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.get_session_user(p_token);
  return query
  select *
  from public.contact_messages
  order by created_at desc;
end;
$$;

create or replace function public.delete_contact_message(p_token text, p_message_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user public.users%rowtype;
begin
  v_user := public.get_session_user(p_token);

  if v_user.role != 'super-admin' then
    raise exception 'Only super-admin can delete messages';
  end if;

  delete from public.contact_messages where id = p_message_id;
  return true;
end;
$$;

-- ─── User management (super-admin only) ──────────────────────────────────────

create or replace function public.get_admin_users(p_token text)
returns setof json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user public.users%rowtype;
begin
  v_user := public.get_session_user(p_token);

  if v_user.role != 'super-admin' then
    raise exception 'Only super-admin can view users';
  end if;

  return query
  select public.user_to_json(u)
  from public.users u
  order by u.created_at desc;
end;
$$;

create or replace function public.create_admin_user(
  p_token text,
  p_name text,
  p_email text,
  p_mobile text,
  p_password text,
  p_role text default 'admin'
)
returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_user public.users%rowtype;
  v_new public.users%rowtype;
begin
  v_user := public.get_session_user(p_token);

  if v_user.role != 'super-admin' then
    raise exception 'Only super-admin can create users';
  end if;

  if p_role not in ('admin', 'super-admin') then
    raise exception 'Invalid role';
  end if;

  if char_length(trim(p_password)) < 8 then
    raise exception 'Password must be at least 8 characters';
  end if;

  insert into public.users (name, email, mobile, password_hash, role)
  values (
    trim(p_name),
    lower(trim(p_email)),
    nullif(trim(p_mobile), ''),
    extensions.crypt(p_password, extensions.gen_salt('bf')),
    p_role
  )
  returning * into v_new;

  return public.user_to_json(v_new);
end;
$$;

create or replace function public.update_admin_user(
  p_token text,
  p_user_id uuid,
  p_name text,
  p_email text,
  p_mobile text,
  p_password text default null,
  p_role text default null
)
returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_user public.users%rowtype;
  v_updated public.users%rowtype;
begin
  v_user := public.get_session_user(p_token);

  if v_user.role != 'super-admin' then
    raise exception 'Only super-admin can update users';
  end if;

  if p_role is not null and p_role not in ('admin', 'super-admin') then
    raise exception 'Invalid role';
  end if;

  if p_password is not null and char_length(trim(p_password)) < 8 then
    raise exception 'Password must be at least 8 characters';
  end if;

  update public.users
  set
    name = coalesce(nullif(trim(p_name), ''), name),
    email = coalesce(lower(nullif(trim(p_email), '')), email),
    mobile = case when p_mobile is not null then nullif(trim(p_mobile), '') else mobile end,
    password_hash = case
      when p_password is not null and trim(p_password) != ''
      then extensions.crypt(p_password, extensions.gen_salt('bf'))
      else password_hash
    end,
    role = coalesce(p_role, role)
  where id = p_user_id
  returning * into v_updated;

  if not found then
    raise exception 'User not found';
  end if;

  return public.user_to_json(v_updated);
end;
$$;

create or replace function public.delete_admin_user(p_token text, p_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user public.users%rowtype;
begin
  v_user := public.get_session_user(p_token);

  if v_user.role != 'super-admin' then
    raise exception 'Only super-admin can delete users';
  end if;

  if v_user.id = p_user_id then
    raise exception 'Cannot delete your own account';
  end if;

  delete from public.users where id = p_user_id;
  return true;
end;
$$;

-- ─── Grants ──────────────────────────────────────────────────────────────────

grant execute on function public.login_admin(text, text) to anon, authenticated;
grant execute on function public.logout_admin(text) to anon, authenticated;
grant execute on function public.verify_admin_session(text) to anon, authenticated;
grant execute on function public.get_contact_messages(text) to anon, authenticated;
grant execute on function public.delete_contact_message(text, uuid) to anon, authenticated;
grant execute on function public.get_admin_users(text) to anon, authenticated;
grant execute on function public.create_admin_user(text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.update_admin_user(text, uuid, text, text, text, text, text) to anon, authenticated;
grant execute on function public.delete_admin_user(text, uuid) to anon, authenticated;
