alter table public.timelines
add column if not exists updated_at timestamptz not null default now();

alter table public.timelines
add column if not exists last_exported_at timestamptz;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_timelines_updated_at on public.timelines;

create trigger set_timelines_updated_at
before update on public.timelines
for each row
execute function public.set_updated_at();