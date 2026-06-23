-- Portfolio logging: visitor tracking + admin action audit trail
-- Run in Supabase Dashboard → SQL Editor (after setup.sql and admin.sql)

-- ─── Visitor logs ────────────────────────────────────────────────────────────

create table if not exists public.visitor_logs (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  visited_at timestamptz not null default now(),
  page_path text,
  referrer text,
  user_agent text,
  language text,
  timezone text,
  screen_width int,
  screen_height int,
  is_return_visitor boolean not null default false,
  session_data jsonb not null default '{}'::jsonb
);

create index if not exists visitor_logs_visited_at_idx
  on public.visitor_logs (visited_at desc);

create index if not exists visitor_logs_session_id_idx
  on public.visitor_logs (session_id);

alter table public.visitor_logs enable row level security;
-- No public SELECT — inserts via RPC only

-- ─── Admin action logs ───────────────────────────────────────────────────────

create table if not exists public.admin_action_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references public.users(id) on delete set null,
  admin_email text,
  admin_name text,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_action_logs_created_at_idx
  on public.admin_action_logs (created_at desc);

create index if not exists admin_action_logs_action_idx
  on public.admin_action_logs (action);

alter table public.admin_action_logs enable row level security;

-- ─── Helper: record admin action ───────────────────────────────────────────

create or replace function public.log_admin_action(
  p_admin_id uuid,
  p_email text,
  p_name text,
  p_action text,
  p_details jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.admin_action_logs (admin_user_id, admin_email, admin_name, action, details)
  values (p_admin_id, p_email, p_name, p_action, coalesce(p_details, '{}'::jsonb));
end;
$$;

-- ─── Visitor tracking (public) ───────────────────────────────────────────────

create or replace function public.log_visitor_visit(
  p_session_id text,
  p_page_path text default '/',
  p_referrer text default null,
  p_user_agent text default null,
  p_language text default null,
  p_timezone text default null,
  p_screen_width int default null,
  p_screen_height int default null,
  p_is_return_visitor boolean default false,
  p_session_data jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_session_id is null or trim(p_session_id) = '' then
    raise exception 'session_id is required';
  end if;

  insert into public.visitor_logs (
    session_id,
    page_path,
    referrer,
    user_agent,
    language,
    timezone,
    screen_width,
    screen_height,
    is_return_visitor,
    session_data
  )
  values (
    trim(p_session_id),
    nullif(trim(p_page_path), ''),
    nullif(trim(p_referrer), ''),
    nullif(trim(p_user_agent), ''),
    nullif(trim(p_language), ''),
    nullif(trim(p_timezone), ''),
    p_screen_width,
    p_screen_height,
    coalesce(p_is_return_visitor, false),
    coalesce(p_session_data, '{}'::jsonb)
  )
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.log_visitor_visit(text, text, text, text, text, text, int, int, boolean, jsonb)
  to anon, authenticated;

-- ─── Admin: view logs (super-admin only) ─────────────────────────────────────

create or replace function public.get_visitor_logs(p_token text, p_limit int default 100)
returns setof public.visitor_logs
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user public.users%rowtype;
begin
  v_user := public.get_session_user(p_token);

  if v_user.role != 'super-admin' then
    raise exception 'Only super-admin can view visitor logs';
  end if;

  return query
  select *
  from public.visitor_logs
  order by visited_at desc
  limit greatest(1, least(coalesce(p_limit, 100), 500));
end;
$$;

create or replace function public.get_admin_action_logs(p_token text, p_limit int default 100)
returns setof public.admin_action_logs
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user public.users%rowtype;
begin
  v_user := public.get_session_user(p_token);

  if v_user.role != 'super-admin' then
    raise exception 'Only super-admin can view admin action logs';
  end if;

  return query
  select *
  from public.admin_action_logs
  order by created_at desc
  limit greatest(1, least(coalesce(p_limit, 100), 500));
end;
$$;

grant execute on function public.get_visitor_logs(text, int) to anon, authenticated;
grant execute on function public.get_admin_action_logs(text, int) to anon, authenticated;

-- ─── Patch admin RPCs to write action logs ───────────────────────────────────

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

  perform public.log_admin_action(
    v_user.id, v_user.email, v_user.name, 'login',
    jsonb_build_object('role', v_user.role)
  );

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
set search_path = public, extensions
as $$
declare
  v_user public.users%rowtype;
begin
  begin
    v_user := public.get_session_user(p_token);
    perform public.log_admin_action(
      v_user.id, v_user.email, v_user.name, 'logout', '{}'::jsonb
    );
  exception when others then
    null;
  end;

  delete from public.admin_sessions where token = p_token;
  return true;
end;
$$;

create or replace function public.delete_contact_message(p_token text, p_message_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_user public.users%rowtype;
  v_msg public.contact_messages%rowtype;
begin
  v_user := public.get_session_user(p_token);

  if v_user.role != 'super-admin' then
    raise exception 'Only super-admin can delete messages';
  end if;

  select * into v_msg from public.contact_messages where id = p_message_id;

  delete from public.contact_messages where id = p_message_id;

  perform public.log_admin_action(
    v_user.id, v_user.email, v_user.name, 'delete_message',
    jsonb_build_object(
      'message_id', p_message_id,
      'sender_name', v_msg.name,
      'sender_email', v_msg.email
    )
  );

  return true;
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

  perform public.log_admin_action(
    v_user.id, v_user.email, v_user.name, 'create_user',
    jsonb_build_object(
      'target_user_id', v_new.id,
      'target_email', v_new.email,
      'target_role', v_new.role
    )
  );

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

  perform public.log_admin_action(
    v_user.id, v_user.email, v_user.name, 'update_user',
    jsonb_build_object(
      'target_user_id', v_updated.id,
      'target_email', v_updated.email,
      'target_role', v_updated.role,
      'password_changed', (p_password is not null and trim(p_password) != '')
    )
  );

  return public.user_to_json(v_updated);
end;
$$;

create or replace function public.delete_admin_user(p_token text, p_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_user public.users%rowtype;
  v_deleted public.users%rowtype;
begin
  v_user := public.get_session_user(p_token);

  if v_user.role != 'super-admin' then
    raise exception 'Only super-admin can delete users';
  end if;

  if v_user.id = p_user_id then
    raise exception 'Cannot delete your own account';
  end if;

  select * into v_deleted from public.users where id = p_user_id;

  delete from public.users where id = p_user_id;

  perform public.log_admin_action(
    v_user.id, v_user.email, v_user.name, 'delete_user',
    jsonb_build_object(
      'target_user_id', p_user_id,
      'target_email', v_deleted.email,
      'target_role', v_deleted.role
    )
  );

  return true;
end;
$$;

-- Log dashboard views (admin read actions)
create or replace function public.get_contact_messages(p_token text)
returns setof public.contact_messages
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_user public.users%rowtype;
begin
  v_user := public.get_session_user(p_token);

  perform public.log_admin_action(
    v_user.id, v_user.email, v_user.name, 'view_messages',
    jsonb_build_object('count_requested', true)
  );

  return query
  select *
  from public.contact_messages
  order by created_at desc;
end;
$$;

create or replace function public.get_admin_users(p_token text)
returns setof json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_user public.users%rowtype;
begin
  v_user := public.get_session_user(p_token);

  if v_user.role != 'super-admin' then
    raise exception 'Only super-admin can view users';
  end if;

  perform public.log_admin_action(
    v_user.id, v_user.email, v_user.name, 'view_users', '{}'::jsonb
  );

  return query
  select public.user_to_json(u)
  from public.users u
  order by u.created_at desc;
end;
$$;
