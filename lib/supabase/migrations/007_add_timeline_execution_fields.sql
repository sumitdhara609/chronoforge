alter table public.timelines
add column if not exists execution_status text not null default 'PLANNING',
add column if not exists progress_percentage integer not null default 0,
add column if not exists last_progress_updated_at timestamptz;

alter table public.timelines
drop constraint if exists timelines_execution_status_check;

alter table public.timelines
add constraint timelines_execution_status_check
check (
  execution_status in (
    'PLANNING',
    'ACTIVE',
    'PAUSED',
    'COMPLETED'
  )
);

alter table public.timelines
drop constraint if exists timelines_progress_percentage_check;

alter table public.timelines
add constraint timelines_progress_percentage_check
check (progress_percentage >= 0 and progress_percentage <= 100);