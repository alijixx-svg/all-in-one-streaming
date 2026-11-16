create table if not exists public.all_in_one_user_data (
  clerk_user_id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.all_in_one_user_data enable row level security;

revoke all on table public.all_in_one_user_data from anon, authenticated;
grant select, insert, update on table public.all_in_one_user_data to service_role;
