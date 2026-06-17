# Supabase Schema

ChronoForge uses Supabase Auth and Supabase Postgres for private timeline storage.

## Tables

### `public.timelines`

Stores saved goal architectures for authenticated users.

Each timeline belongs to one Supabase Auth user through `user_id`.

## Security

Row Level Security is enabled on the `timelines` table.

Policies ensure that authenticated users can only:

- View their own timelines
- Insert timelines linked to their own user ID
- Update their own timelines
- Delete their own timelines

This protects each user's private planning vault.