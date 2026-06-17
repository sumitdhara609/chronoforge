create extension if not exists "pgcrypto";

create table if not exists public.timelines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_title text not null,
  total_estimated_hours integer not null,
  available_hours_per_week integer not null,
  days_until_deadline integer not null,
  created_at timestamptz not null default now()
);

create index if not exists timelines_user_id_idx
on public.timelines (user_id);

create index if not exists timelines_created_at_idx
on public.timelines (created_at desc);