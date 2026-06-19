import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

const SECTIONS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/programs/new", label: "New Program" },
  { href: "/admin/roster", label: "Roster" },
  { href: "/admin/schedule", label: "Schedule" },
  { href: "/admin/stats", label: "Stats" },
  { href: "/admin/team", label: "Team Members" },
  { href: "/admin/team-settings", label: "Team Settings" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/settings", label: "Site Settings" },
];

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-chalk">
      <header className="border-b-4 border-ink bg-ink text-chalk">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/admin"
            className="font-display text-2xl tracking-wide text-brass"
          >
            COACH ADMIN
          </Link>
          <nav className="flex items-center gap-6 font-mono text-sm uppercase tracking-wide">
            <Link href="/team" className="hover:text-brass">
              Team Site
            </Link>
            <Link href="/" className="hover:text-brass">
              View Site
            </Link>
            <LogoutButton redirectTo="/admin/login" />
          </nav>
        </div>
        <div className="mx-auto max-w-5xl px-6 pb-4">
          <nav className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-wide text-chalk/70">
            {SECTIONS.map((s) => (
              <Link key={s.href} href={s.href} className="hover:text-brass">
                {s.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
