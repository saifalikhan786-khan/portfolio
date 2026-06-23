-- Fix: Supabase installs pgcrypto in the "extensions" schema
-- Run this in Supabase Dashboard → SQL Editor if login fails with:
--   "function crypt(text, text) does not exist"

create extension if not exists pgcrypto with schema extensions;

-- Re-hash super-admin password (in case initial insert used wrong crypt)
update public.users
set password_hash = extensions.crypt('Hm20342878919', extensions.gen_salt('bf'))
where email = 'superadmin@gmail.com';

-- ─── login_admin ─────────────────────────────────────────────────────────────

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

-- ─── create_admin_user ───────────────────────────────────────────────────────

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

-- ─── update_admin_user ───────────────────────────────────────────────────────

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
