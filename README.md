# Felion Good Baseball — Setup Guide

A simple site for sign-ups, program info, and donations. Built with
Next.js + Supabase + Vercel — all on free tiers.

What it does:
- Public site: homepage, a programs list (camps/lessons/teams), a sign-up
  form per program, and a donate page linking out to Venmo/PayPal.
- Admin panel at `/admin`: add/edit/delete programs, view and CSV-export
  sign-ups, edit the homepage bio + donation links + contact info.
- Sign-ups just collect info (no payment processing) — exactly what you
  asked for.

---

## 1. Create a Supabase project (free)

1. Go to https://supabase.com → New Project.
2. Name it whatever (e.g. `feliongood`), pick a strong database password
   (save it somewhere), pick a region close to you.
3. Once it's created, go to **SQL Editor → New query**, paste in the
   entire contents of `supabase/schema.sql` from this project, and click
   **Run**. This creates all the tables and security rules in one shot.
4. Create the admin login: go to **Authentication → Users → Add user**.
   Use your cousin's real email and set a password. This is the only
   account that can log into `/admin` — there's no public sign-up, by
   design.
5. Go to **Project Settings → API**. You'll need two values from here in
   the next step: **Project URL** and the **anon/public key**.

## 2. Configure the project locally

```bash
cd feliongood
npm install
cp .env.local.example .env.local
```

Open `.env.local` and fill in the two values from Supabase step 1.5:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Then run it locally to check everything works:

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site, and
`http://localhost:3000/admin` to log in with the account you created in
step 1.4. Add a test program and confirm the sign-up form and CSV export
work, then delete the test program.

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
```

Create a new repo on GitHub and push it there (GitHub will give you the
exact commands when you create an empty repo).

## 4. Deploy to Vercel (free)

1. Go to https://vercel.com → New Project → import the GitHub repo.
2. In the project's **Environment Variables**, add the same two values
   from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Click **Deploy**.

## 5. Connect feliongood.com

1. In the Vercel project, go to **Settings → Domains**, add
   `feliongood.com` (and `www.feliongood.com` if you want both).
2. Vercel will show you DNS records to add. Go to wherever the domain
   was registered (GoDaddy, Namecheap, etc.), open DNS settings, and add
   the records Vercel gave you. This is usually either:
   - An `A` record pointing `@` to Vercel's IP, or
   - Vercel handling it automatically if you delegate nameservers to them.
3. DNS changes can take anywhere from a few minutes to a few hours to
   propagate. Vercel's dashboard will show a green check once it's live.

---

## Day-to-day use (for your cousin)

- Log into `feliongood.com/admin` with the email/password you set up.
- **New Program** → fill out name, dates, description, sign-up deadline,
  save. It immediately shows up on the public site.
- Click the sign-up count next to any program to see who's signed up,
  and **Export CSV** to pull the list into Excel/Sheets/email.
- **Settings** → edit the homepage bio, Venmo/PayPal links, and contact
  info shown across the site.
- Toggle "Visible on the public site" off on a program to hide it
  without deleting it (e.g. after a season ends).

## If something breaks

- "Could not create the program" / similar errors almost always mean the
  `.env.local` (or Vercel env vars) don't match the Supabase project, or
  `schema.sql` wasn't run yet.
- If `/admin` won't let you log in, double check the user was created
  under **Authentication → Users** in Supabase (not just any email — it
  has to be added there manually).
- Everything here runs on free tiers (Supabase free tier, Vercel hobby
  tier) — there's no bill to worry about unless this grows a lot.
# feliongood
