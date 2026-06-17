alter table public.timelines enable row level security;

drop policy if exists "Users can view their own timelines" on public.timelines;
drop policy if exists "Users can insert their own timelines" on public.timelines;
drop policy if exists "Users can update their own timelines" on public.timelines;
drop policy if exists "Users can delete their own timelines" on public.timelines;

create policy "Users can view their own timelines"
on public.timelines
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own timelines"
on public.timelines
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own timelines"
on public.timelines
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own timelines"
on public.timelines
for delete
to authenticated
using (auth.uid() = user_id);