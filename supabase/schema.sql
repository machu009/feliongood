-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New Query)
-- This sets up everything the site needs: tables, indexes, and security rules.

-- ============================================================
-- PROGRAMS  (camps, lessons, teams, clinics, etc.)
-- ============================================================
create table if not exists programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  type text not null default 'camp', -- camp | lesson | team | clinic | other
  description text default '',
  location text default '',
  start_date date,
  end_date date,
  signup_deadline date,
  capacity int,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists programs_active_idx on programs (is_active, sort_order);

-- ============================================================
-- SIGNUPS  (form submissions tied to a program)
-- ============================================================
create table if not exists signups (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs(id) on delete cascade,
  parent_name text not null,
  player_name text not null,
  player_age int,
  email text not null,
  phone text default '',
  notes text default '',
  created_at timestamptz not null default now()
);

create index if not exists signups_program_idx on signups (program_id);

-- ============================================================
-- SITE SETTINGS  (single row: bio, donation links, contact info)
-- ============================================================
create table if not exists site_settings (
  id int primary key default 1,
  bio text default '',
  donation_venmo text default '',
  donation_paypal text default '',
  contact_email text default '',
  contact_phone text default '',
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into site_settings (id) values (1)
  on conflict (id) do nothing;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table programs enable row level security;
alter table signups enable row level security;
alter table site_settings enable row level security;

-- Anyone (including site visitors) can view active programs
drop policy if exists "public can view active programs" on programs;
create policy "public can view active programs"
  on programs for select
  to anon
  using (is_active = true);

-- Logged-in admin can do anything with programs
drop policy if exists "admin full access programs" on programs;
create policy "admin full access programs"
  on programs for all
  to authenticated
  using (true)
  with check (true);

-- Anyone can submit a signup form, but cannot read signups back
drop policy if exists "public can insert signups" on signups;
create policy "public can insert signups"
  on signups for insert
  to anon
  with check (true);

-- Only the logged-in admin can view/manage signups
drop policy if exists "admin full access signups" on signups;
create policy "admin full access signups"
  on signups for all
  to authenticated
  using (true)
  with check (true);

-- Anyone can read site settings (needed for public donate/contact info)
drop policy if exists "public can view settings" on site_settings;
create policy "public can view settings"
  on site_settings for select
  to anon
  using (true);

-- Only the logged-in admin can update settings
drop policy if exists "admin can update settings" on site_settings;
create policy "admin can update settings"
  on site_settings for update
  to authenticated
  using (true)
  with check (true);
