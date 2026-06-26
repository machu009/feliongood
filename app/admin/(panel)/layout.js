"use client";

import { useState } from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

const TOP_LINKS = [
  { href: "/team", label: "Team Site" },
  { href: "/", label: "View Site" },
];

const SECTIONS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/programs", label: "Programs" },
  { href: "/admin/roster", label: "Roster" },
  { href: "/admin/schedule", label: "Schedule" },
  { href: "/admin/team", label: "Team Members" },
  { href: "/admin/team-settings", label: "Team Settings" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/settings", label: "Site Settings" },
];

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-chalk">
      <header className="border-b-4 border-ink bg-ink text-chalk">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/admin"
            className="font-display text-xl tracking-wide text-brass sm:text-2xl"
          >
            COACH ADMIN
          </Link>

          {/* Desktop top links */}
          <nav className="hidden items-center gap-6 font-mono text-sm uppercase tracking-wide sm:flex">
            {TOP_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-brass">
                {l.label}
              </Link>
            ))}
            <LogoutButton redirectTo="/admin/login" />
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center border-2 border-chalk/40 text-chalk sm:hidden"
          >
            {open ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

        {/* Section nav - desktop only, always visible */}
        <div className="mx-auto hidden max-w-5xl px-6 pb-4 sm:block">
          <nav className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-wide text-chalk/70">
            {SECTIONS.map((s) => (
              <Link key={s.href} href={s.href} className="hover:text-brass">
                {s.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile dropdown - top links + all sections */}
        {open ? (
          <div className="border-t-2 border-chalk/15 px-4 py-4 sm:hidden">
            <nav className="flex flex-col gap-3 font-mono text-sm uppercase tracking-wide">
              {TOP_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="hover:text-brass"
                >
                  {l.label}
                </Link>
              ))}
              <div onClick={() => setOpen(false)}>
                <LogoutButton redirectTo="/admin/login" />
              </div>
            </nav>
            <div className="mt-4 border-t border-chalk/15 pt-4">
              <nav className="flex flex-col gap-3 font-mono text-xs uppercase tracking-wide text-chalk/70">
                {SECTIONS.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    onClick={() => setOpen(false)}
                    className="hover:text-brass"
                  >
                    {s.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        ) : null}
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
