create or replace function public.get_user_vault_summary()
returns table (
  total_plans bigint,
  total_planned_hours bigint,
  average_required_weekly_hours numeric,
  high_deadline_risk_plans bigint,
  high_burnout_risk_plans bigint,
  average_recovery_buffer_days numeric
)
language sql
security invoker
set search_path = public
as $$
  select
    count(*) as total_plans,
    coalesce(sum(total_estimated_hours), 0)::bigint as total_planned_hours,
    coalesce(round(avg(required_weekly_hours), 1), 0) as average_required_weekly_hours,
    count(*) filter (where deadline_risk = 'HIGH') as high_deadline_risk_plans,
    count(*) filter (where burnout_risk = 'HIGH') as high_burnout_risk_plans,
    coalesce(round(avg(recovery_buffer_days), 1), 0) as average_recovery_buffer_days
  from public.timeline_analytics
  where user_id = auth.uid();
$$;