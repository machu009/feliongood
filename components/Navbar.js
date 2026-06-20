"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const LINKS = [
  { href: "/programs", label: "Programs" },
  { href: "/donate", label: "Donate" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b-4 border-ink bg-chalk">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3">
          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-ink sm:h-10 sm:w-10">
            <Image
              src="/logo-mark.jpg"
              alt="Felion Good Baseball emblem"
              fill
              className="object-cover"
              sizes="40px"
            />
          </span>
          <span className="font-display text-xl tracking-wide text-ink sm:text-3xl">
            FELION GOOD <span className="text-clay">BASEBALL</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 font-mono text-sm uppercase tracking-wide text-ink sm:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-clay">
              {l.label}
            </Link>
          ))}
          <Link
            href="/team/login"
            className="border-2 border-ink px-4 py-2 hover:border-clay hover:text-clay"
          >
            Team Login
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center border-2 border-ink text-ink sm:hidden"
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

      {/* Mobile dropdown */}
      {open ? (
        <nav className="border-t-2 border-ink/15 bg-chalk px-4 py-4 font-mono text-sm uppercase tracking-wide text-ink sm:hidden">
          <div className="flex flex-col gap-4">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="hover:text-clay"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/team/login"
              onClick={() => setOpen(false)}
              className="border-2 border-ink px-4 py-2 text-center hover:border-clay hover:text-clay"
            >
              Team Login
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
