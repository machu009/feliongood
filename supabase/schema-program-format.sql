-- Run in Supabase SQL Editor. Adds the ability to mark a program as a
-- season-long event (date range + signup deadline) or a one-day clinic
-- (single date + specific start/end time).

alter table programs add column if not exists format text not null default 'season'; -- 'season' | 'clinic'
alter table programs add column if not exists start_time text default '';
alter table programs add column if not exists end_time text default '';
