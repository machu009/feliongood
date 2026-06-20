"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";

const LINKS = [
  { href: "/team", label: "Home" },
  { href: "/team/locker-room", label: "Locker Room" },
  { href: "/team/calendar", label: "Calendar" },
  { href: "/team/schedule", label: "Schedule" },
  { href: "/team/roster", label: "Roster" },
  { href: "/team/leaderboards", label: "Leaderboards" },
  { href: "/team/rules", label: "Rule Book" },
  { href: "/team/contact", label: "Contact Coach" },
];

export default function TeamNav({ isAdmin }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b-4 border-ink bg-turf text-chalk">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/team" className="flex items-center gap-2.5 sm:gap-3">
          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-chalk/40 bg-chalk sm:h-10 sm:w-10">
            <Image
              src="/granger-lancers.jpg"
              alt="Granger Lancers"
              fill
              className="object-cover"
              sizes="40px"
            />
          </span>
          <span className="font-display text-lg tracking-wide sm:text-2xl">
            FELION GOOD <span className="text-brass">TEAM</span>
          </span>
        </Link>

        {/* Desktop top links */}
        <nav className="hidden items-center gap-5 font-mono text-sm uppercase tracking-wide sm:flex">
          {isAdmin ? (
            <Link href="/admin" className="hover:text-brass">
              Admin Panel
            </Link>
          ) : null}
          <Link href="/team/account" className="hover:text-brass">
            Account
          </Link>
          <LogoutButton redirectTo="/team/login" />
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
        <nav className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-wide text-chalk/75">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-brass">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile dropdown - top links + section links */}
      {open ? (
        <div className="border-t-2 border-chalk/20 px-4 py-4 sm:hidden">
          <nav className="flex flex-col gap-3 font-mono text-sm uppercase tracking-wide">
            {isAdmin ? (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="hover:text-brass"
              >
                Admin Panel
              </Link>
            ) : null}
            <Link
              href="/team/account"
              onClick={() => setOpen(false)}
              className="hover:text-brass"
            >
              Account
            </Link>
            <div onClick={() => setOpen(false)}>
              <LogoutButton redirectTo="/team/login" />
            </div>
          </nav>
          <div className="mt-4 border-t border-chalk/20 pt-4">
            <nav className="flex flex-col gap-3 font-mono text-xs uppercase tracking-wide text-chalk/75">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="hover:text-brass"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
