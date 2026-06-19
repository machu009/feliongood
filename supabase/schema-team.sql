-- ============================================================
-- TEAM SECTION MIGRATION
-- Run this in Supabase SQL Editor AFTER schema.sql.
-- Safe to run once. Adds: profiles/roles, roster, schedule,
-- season stats, contact messages, team settings, and a private
-- storage bucket for the rule book PDF.
-- ============================================================

-- ============================================================
-- PROFILES  (role lives here: 'admin' or 'member')
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'member', -- 'admin' | 'member'
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- Auto-create a profile row whenever a new auth user is created.
-- New accounts default to 'member' — admin accounts are promoted
-- manually (see the one-time step in TEAM-SECTION-SETUP.md).
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'member')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- SECURITY DEFINER helper so RLS policies can check "is this user an
-- admin?" without recursively querying profiles under its own RLS.
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

drop policy if exists "users can view own profile" on profiles;
create policy "users can view own profile"
  on profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "admin can view all profiles" on profiles;
create policy "admin can view all profiles"
  on profiles for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admin can update profiles" on profiles;
create policy "admin can update profiles"
  on profiles for update
  to authenticated
  using (public.is_admin());

drop policy if exists "users can update own name" on profiles;
create policy "users can update own name"
  on profiles for update
  to authenticated
  using (auth.uid() = id);

-- ============================================================
-- PLAYERS  (roster)
-- ============================================================
create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  jersey_number text,
  position text,
  grad_year int,
  bats_throws text,
  height text,
  notes text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table players enable row level security;

drop policy if exists "team can view players" on players;
create policy "team can view players"
  on players for select
  to authenticated
  using (true);

drop policy if exists "admin can manage players" on players;
create policy "admin can manage players"
  on players for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- GAMES  (schedule)
-- ============================================================
create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  opponent text not null,
  game_date date not null,
  game_time text,
  location text,
  is_home boolean not null default true,
  result text, -- 'W' | 'L' | 'T' | null (not yet played)
  team_score int,
  opponent_score int,
  notes text,
  created_at timestamptz not null default now()
);

alter table games enable row level security;

drop policy if exists "team can view games" on games;
create policy "team can view games"
  on games for select
  to authenticated
  using (true);

drop policy if exists "admin can manage games" on games;
create policy "admin can manage games"
  on games for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- BATTING STATS  (season totals per player)
-- ============================================================
create table if not exists batting_stats (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  season text not null default '2026',
  games_played int not null default 0,
  at_bats int not null default 0,
  runs int not null default 0,
  hits int not null default 0,
  doubles int not null default 0,
  triples int not null default 0,
  home_runs int not null default 0,
  rbi int not null default 0,
  walks int not null default 0,
  strikeouts int not null default 0,
  stolen_bases int not null default 0,
  hit_by_pitch int not null default 0,
  updated_at timestamptz not null default now(),
  unique (player_id, season)
);

alter table batting_stats enable row level security;

drop policy if exists "team can view batting stats" on batting_stats;
create policy "team can view batting stats"
  on batting_stats for select
  to authenticated
  using (true);

drop policy if exists "admin can manage batting stats" on batting_stats;
create policy "admin can manage batting stats"
  on batting_stats for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- PITCHING STATS  (season totals per player)
-- innings_pitched uses baseball notation: .1 = one out, .2 = two
-- outs (NOT tenths) — e.g. 12.1 means 12 and 1/3 innings.
-- ============================================================
create table if not exists pitching_stats (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  season text not null default '2026',
  appearances int not null default 0,
  wins int not null default 0,
  losses int not null default 0,
  saves int not null default 0,
  innings_pitched numeric(5,1) not null default 0,
  hits_allowed int not null default 0,
  runs_allowed int not null default 0,
  earned_runs int not null default 0,
  walks_allowed int not null default 0,
  strikeouts int not null default 0,
  hit_batters int not null default 0,
  updated_at timestamptz not null default now(),
  unique (player_id, season)
);

alter table pitching_stats enable row level security;

drop policy if exists "team can view pitching stats" on pitching_stats;
create policy "team can view pitching stats"
  on pitching_stats for select
  to authenticated
  using (true);

drop policy if exists "admin can manage pitching stats" on pitching_stats;
create policy "admin can manage pitching stats"
  on pitching_stats for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- CONTACT MESSAGES  (Contact Coach / Join Baseball, from team members)
-- ============================================================
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null,
  sender_email text not null,
  category text not null default 'contact', -- 'contact' | 'join'
  message text not null,
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

drop policy if exists "team can send messages" on contact_messages;
create policy "team can send messages"
  on contact_messages for insert
  to authenticated
  with check (true);

drop policy if exists "admin can view messages" on contact_messages;
create policy "admin can view messages"
  on contact_messages for select
  to authenticated
  using (public.is_admin());

-- ============================================================
-- TEAM SETTINGS  (single row: calendar embed url, rule book file)
-- ============================================================
create table if not exists team_settings (
  id int primary key default 1,
  google_calendar_embed_url text default '',
  rulebook_path text default '',
  rulebook_filename text default '',
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into team_settings (id) values (1)
  on conflict (id) do nothing;

alter table team_settings enable row level security;

drop policy if exists "team can view team settings" on team_settings;
create policy "team can view team settings"
  on team_settings for select
  to authenticated
  using (true);

drop policy if exists "admin can update team settings" on team_settings;
create policy "admin can update team settings"
  on team_settings for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- STORAGE  (private bucket for the rule book PDF)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('team-docs', 'team-docs', false)
on conflict (id) do nothing;

drop policy if exists "team can read team docs" on storage.objects;
create policy "team can read team docs"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'team-docs');

drop policy if exists "admin can upload team docs" on storage.objects;
create policy "admin can upload team docs"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'team-docs' and public.is_admin());

drop policy if exists "admin can update team docs" on storage.objects;
create policy "admin can update team docs"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'team-docs' and public.is_admin());

drop policy if exists "admin can delete team docs" on storage.objects;
create policy "admin can delete team docs"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'team-docs' and public.is_admin());
