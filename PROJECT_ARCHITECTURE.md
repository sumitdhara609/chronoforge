# ChronoForge — Project Architecture

ChronoForge is a full-stack future-simulation platform that helps users transform goals into structured timelines, risk forecasts, execution diagnoses, and saved planning reports.

## Core Product Idea

Most plans fail before execution because people underestimate scope, overestimate consistency, ignore recovery time, and discover deadline pressure too late.

ChronoForge solves this by turning goal inputs into:

- Projected completion time
- Deadline risk
- Burnout risk
- Required weekly effort
- Recovery buffer
- Scope reduction estimate
- Timeline phase architecture
- Scenario comparison
- Execution diagnosis
- ChronoScore planning quality score

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- Row Level Security
- Vercel Deployment

## Main Application Routes

### `/`

Public landing page explaining ChronoForge as a planning intelligence platform.

### `/create`

Goal Architect page where users enter goal details and generate:

- ChronoEngine projection
- ChronoScore
- Execution diagnosis
- Timeline phases
- Scenario simulations
- Copyable timeline summary
- Save-to-vault action

### `/login`

Authentication page using Supabase Auth.

### `/dashboard`

Protected private workspace showing saved timelines for the authenticated user.

### `/dashboard/[id]`

Protected saved timeline report page showing a full professional report for one saved goal architecture.

## Core Engine Files

### `lib/chrono-engine.ts`

Calculates the main projection:

- Projected completion days
- Required weekly hours
- Deadline risk
- Burnout risk
- Recovery buffer
- Scope reduction need
- Recommendation

### `lib/diagnosis-engine.ts`

Converts projection data into a human-readable execution diagnosis.

Outputs:

- Severity
- Diagnosis title
- Primary problem
- Recommended action
- Summary

### `lib/chrono-score.ts`

Calculates a planning quality score from 0 to 100.

Factors:

- Deadline risk
- Burnout risk
- Recovery buffer
- Scope pressure

### `lib/timeline-generator.ts`

Generates timeline phases and identifies the highest-pressure phase.

## Authentication & Data

ChronoForge uses Supabase Auth for user sessions and Supabase Postgres for timeline persistence.

Saved timelines are protected using Row Level Security so users can only access their own data.

## Database Table

`timelines`

Fields:

- `id`
- `user_id`
- `goal_title`
- `total_estimated_hours`
- `available_hours_per_week`
- `days_until_deadline`
- `created_at`

## Security Notes

- Environment variables are not committed.
- Supabase keys are configured through local `.env.local` and Vercel Environment Variables.
- Row Level Security protects user timeline data.
- Dashboard and report routes redirect unauthenticated users to login.

## Product Direction

ChronoForge is designed as a portfolio-grade product demonstrating:

- Full-stack application development
- Authenticated user workflows
- Database persistence
- Product design thinking
- Custom logic engines
- Risk modeling
- Protected dashboards
- Professional deployment