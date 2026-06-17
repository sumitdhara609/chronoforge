alter table public.timelines
add constraint timelines_goal_title_not_empty
check (length(trim(goal_title)) > 0);

alter table public.timelines
add constraint timelines_total_estimated_hours_positive
check (total_estimated_hours > 0);

alter table public.timelines
add constraint timelines_available_hours_per_week_positive
check (available_hours_per_week > 0);

alter table public.timelines
add constraint timelines_days_until_deadline_positive
check (days_until_deadline > 0);