-- Keep-alive table for the Supabase free-tier pause workaround.
--
-- Run this ONCE in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).
--
-- The GitHub Action `.github/workflows/supabase-keepalive.yml` upserts row id=1
-- daily using the service_role key. That WRITE is what registers as activity and
-- keeps the project from pausing (read-only SELECTs do NOT reset the timer).

create table if not exists public.keepalive (
  id         int primary key,
  pinged_at  timestamptz not null default now()
);

insert into public.keepalive (id, pinged_at) values (1, now())
  on conflict (id) do nothing;

-- Enable RLS with NO policies: only the service_role key (used by the Action,
-- which bypasses RLS) can write. The public anon key cannot touch this table,
-- so it is safe to leave it policy-less.
alter table public.keepalive enable row level security;
