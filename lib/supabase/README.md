# Supabase Schema

ChronoForge uses Supabase Auth and Supabase Postgres for private timeline storage, row-level security, and database-side planning analytics.

## Tables

### `public.timelines`

Stores saved goal architectures for authenticated users.

Each timeline belongs to one Supabase Auth user through `user_id`.

## Core Fields

- `id`
- `user_id`
- `goal_title`
- `total_estimated_hours`
- `available_hours_per_week`
- `days_until_deadline`
- `created_at`

## Constraints

The database protects timeline quality with constraints:

- Goal titles cannot be empty.
- Estimated hours must be positive.
- Weekly availability must be positive.
- Deadline days must be positive.

## Row Level Security

Row Level Security is enabled on the `timelines` table.

Policies ensure authenticated users can only:

- View their own timelines
- Insert timelines linked to their own user ID
- Update their own timelines
- Delete their own timelines

## Analytics View

### `public.timeline_analytics`

A database view that calculates:

- Projected completion days
- Required weekly hours
- Deadline risk
- Burnout risk
- Recovery buffer days

This mirrors ChronoForge's application-side planning intelligence at the database layer.

## Vault Summary Function

### `public.get_user_vault_summary()`

A Supabase-aware SQL function that returns vault-level analytics for the currently authenticated user:

- Total saved plans
- Total planned hours
- Average required weekly hours
- High deadline-risk plan count
- High burnout-risk plan count
- Average recovery buffer days

## Local Seed File

`seed.sql` contains commented sample timeline rows for local development.