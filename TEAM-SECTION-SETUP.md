# Team Section — Setup Guide

This adds a private "Team" area at `feliongood.com/team` separate from your
existing admin panel, plus new admin screens to manage it.

**New for the team:** Calendar (embedded Google Calendar), Schedule, Roster,
Leaderboards (batting + pitching, calculated automatically from totals you
enter), Rule Book (private PDF), and Contact Coach / Join Baseball.

**New for you (admin):** Team Members (create accounts + generate a temp
password to email), Roster, Schedule, Stats entry, Team Settings (calendar
link + rule book upload), Messages.

⚠️ **Follow the order below exactly.** Step 3 has to happen before you
redeploy, or you'll lock yourself out of `/admin` (see why in that step).

---

## 1. Apply the database migration

Supabase → **SQL Editor → New query** → paste in the entire contents of
`supabase/schema-team.sql` → **Run**.

This adds all the new tables, a `profiles` table that tracks each user's
role (`admin` or `member`), and a private storage bucket for the rule book.

## 2. Get your Secret/Service Role key

Creating team member accounts requires elevated permissions that the
regular anon key doesn't have.

Supabase → **Project Settings → API Keys** (or **Connect** dialog) → copy
the **secret key** (`sb_secret_...`) or, if you're on the older key system,
the **service_role** key.

This key is NOT safe to expose publicly — never put it in anything
prefixed `NEXT_PUBLIC_`.

## 3. Promote your own account to admin (do this before redeploying)

The new system tracks roles in a `profiles` table. Going forward, new
accounts default to role `member` automatically. But your existing coach
account was created *before* this system existed, so it has no profile row
yet — and the new code checks this table to decide who's allowed into
`/admin`.

Run this in the Supabase SQL Editor, with your real email:

```sql
insert into profiles (id, email, role)
select id, email, 'admin'
from auth.users
where email = 'matt@mad-garage.com'
on conflict (id) do update set role = 'admin';
```

Skipping this step means the next deploy redirects you straight from
`/admin` to `/team` — you're not broken, just not marked admin yet. If
that happens, just run this query and refresh.

## 4. Add the new environment variable in Vercel

**Settings → Environment Variables** → add:

- `SUPABASE_SECRET_KEY` → the key from step 2

(Your existing `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
stay as they are — this is in addition to those.)

## 5. Add the new files to your project and deploy

Copy everything from this update into your local `feliongood` project
folder, overwriting any files with the same name. Then:

```bash
git add -A
git commit -m "Add team section"
git push
```

Vercel redeploys automatically. Once it's live:

- You should still be able to reach `/admin` (because of step 3).
- `feliongood.com/team/login` is the new team member login.

---

## How to use it

**Add a team member:** Admin → Team Members → Add Team Member. Enter their
name and email, hit Create — you'll get a temp password and an "Open in
Mail App" button that pre-fills an email with their login info. Send it.
They can change their password from the Account page once they're in.

**Roster, Schedule:** straightforward add/edit/remove, same pattern as
Programs.

**Stats:** Admin → Stats → pick a player → enter season totals for batting
and pitching. The leaderboards page calculates AVG/OBP/SLG/OPS and
ERA/WHIP automatically — you just enter the raw counting stats.

One quirk to know: **innings pitched uses baseball notation**, not
decimals. `12.1` means 12⅓ innings (the .1/.2 represents outs, not
tenths) — same as a real box score.

**Calendar:** Admin → Team Settings → paste your Google Calendar embed
URL (Google Calendar → calendar settings → "Integrate calendar" → copy
the embed src, or just the public calendar address).

**Rule Book:** Admin → Team Settings → upload the PDF. It's stored
privately — only logged-in team members can view it, via a link that
regenerates each time someone visits the page (so it never goes stale,
but also never just sits on the public internet).

**Messages:** Admin → Messages shows anything submitted through Contact
Coach / Join Baseball on the team site.

## A few intentional decisions worth knowing

- **Team member ≠ roster player.** A "team member" is a login account
  (could be a parent, could be a player). A "player" is a roster entry.
  They're not automatically linked — you manage them separately. This
  keeps things simple: parents/guardians can have accounts without
  needing a roster slot, and you're not forced to create logins for
  every player.
- **Current season** is hardcoded in `lib/season.js` (`CURRENT_SEASON`).
  Bump that string each year — old seasons stay in the database under
  their own season value, they just won't show on the current
  leaderboard until you query for them (a future "season history" view
  could read old data anytime).
