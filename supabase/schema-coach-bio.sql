-- Run in Supabase SQL Editor. Adds editable "Meet the Coach" content
-- to the existing site_settings row.

alter table site_settings add column if not exists coach_name text default 'Coach Felion';
alter table site_settings add column if not exists coach_bio text default '';
