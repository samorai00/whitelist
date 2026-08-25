-- NYVELLA / Supabase setup
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.whitelist_applications (
  id uuid primary key default gen_random_uuid(),
  handle text not null,
  wallet_address text not null,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

create unique index if not exists whitelist_wallet_unique
  on public.whitelist_applications (lower(wallet_address));

create index if not exists whitelist_created_at_idx
  on public.whitelist_applications (created_at desc);

alter table public.whitelist_applications enable row level security;

-- Public visitors must NOT be allowed to read the whitelist.
-- Inserts are performed by the Vercel serverless function using the
-- Supabase service-role key, so no public INSERT policy is required.

revoke all on public.whitelist_applications from anon, authenticated;

-- Optional admin view helper:
create or replace view public.whitelist_count as
select count(*)::bigint as total_applications
from public.whitelist_applications;
