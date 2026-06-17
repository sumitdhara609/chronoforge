create or replace view public.timeline_analytics as
select
  id,
  user_id,
  goal_title,
  total_estimated_hours,
  available_hours_per_week,
  days_until_deadline,
  created_at,

  ceil(
    (total_estimated_hours::numeric / available_hours_per_week::numeric) * 7
  )::integer as projected_completion_days,

  round(
    total_estimated_hours::numeric / (days_until_deadline::numeric / 7),
    1
  ) as required_weekly_hours,

  case
    when available_hours_per_week::numeric >=
      total_estimated_hours::numeric / (days_until_deadline::numeric / 7)
      then 'LOW'
    when available_hours_per_week::numeric >=
      (
        total_estimated_hours::numeric / (days_until_deadline::numeric / 7)
      ) * 0.75
      then 'MEDIUM'
    else 'HIGH'
  end as deadline_risk,

  case
    when total_estimated_hours::numeric / (days_until_deadline::numeric / 7) > 25
      then 'HIGH'
    when total_estimated_hours::numeric / (days_until_deadline::numeric / 7) >= 15
      then 'MEDIUM'
    else 'LOW'
  end as burnout_risk,

  greatest(
    0,
    floor(
      days_until_deadline::numeric -
      ((total_estimated_hours::numeric / available_hours_per_week::numeric) * 7)
    )
  )::integer as recovery_buffer_days

from public.timelines;