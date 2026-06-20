-- Run in Supabase SQL Editor. Adds a simple forum ("Locker Room") to the
-- private team section: threads with an opening post, plus replies.

create table if not exists forum_threads (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists forum_replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references forum_threads(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists forum_replies_thread_idx on forum_replies (thread_id);

alter table forum_threads enable row level security;
alter table forum_replies enable row level security;

-- Whole team (any authenticated account) can read everything.
drop policy if exists "team can view threads" on forum_threads;
create policy "team can view threads"
  on forum_threads for select
  to authenticated
  using (true);

drop policy if exists "team can view replies" on forum_replies;
create policy "team can view replies"
  on forum_replies for select
  to authenticated
  using (true);

-- Anyone on the team can post, but only as themselves.
drop policy if exists "team can post threads" on forum_threads;
create policy "team can post threads"
  on forum_threads for insert
  to authenticated
  with check (auth.uid() = author_id);

drop policy if exists "team can post replies" on forum_replies;
create policy "team can post replies"
  on forum_replies for insert
  to authenticated
  with check (auth.uid() = author_id);

-- Delete your own posts, or — if you're the admin — anyone's (moderation).
drop policy if exists "own or admin can delete threads" on forum_threads;
create policy "own or admin can delete threads"
  on forum_threads for delete
  to authenticated
  using (auth.uid() = author_id or public.is_admin());

drop policy if exists "own or admin can delete replies" on forum_replies;
create policy "own or admin can delete replies"
  on forum_replies for delete
  to authenticated
  using (auth.uid() = author_id or public.is_admin());
