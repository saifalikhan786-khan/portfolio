-- Run this in Supabase Dashboard → SQL Editor
-- Creates the table for portfolio Quick Message submissions

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) >= 2),
  email text check (email is null or email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  message text not null check (char_length(trim(message)) >= 10),
  created_at timestamptz not null default now()
);

-- Index for sorting by newest first in dashboard
create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

-- Allow anonymous visitors to submit messages (insert only)
create policy "Anyone can submit contact messages"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

-- Only you (authenticated) can read messages in Supabase dashboard / admin tools
-- No public SELECT policy = visitors cannot read other people's messages

comment on table public.contact_messages is 'Portfolio Quick Message form submissions';
