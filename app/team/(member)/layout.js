import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import { createClient } from "@/lib/supabase/server";

const LINKS = [
  { href: "/team", label: "Home" },
  { href: "/team/calendar", label: "Calendar" },
  { href: "/team/schedule", label: "Schedule" },
  { href: "/team/roster", label: "Roster" },
  { href: "/team/leaderboards", label: "Leaderboards" },
  { href: "/team/rules", label: "Rule Book" },
  { href: "/team/contact", label: "Contact Coach" },
];

export default async function TeamMemberLayout({ children }) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  let profile = null;
  if (data?.user) {
    const { data: p } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();
    profile = p;
  }

  return (
    <div className="min-h-screen bg-chalk">
      <header className="border-b-4 border-ink bg-turf text-chalk">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/team" className="flex items-center gap-3">
            <span className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-chalk/40 bg-chalk">
              <Image
                src="/granger-lancers.jpg"
                alt="Granger Lancers"
                fill
                className="object-cover"
                sizes="40px"
              />
            </span>
            <span className="font-display text-2xl tracking-wide">
              FELION GOOD <span className="text-brass">TEAM</span>
            </span>
          </Link>
          <nav className="flex items-center gap-5 font-mono text-sm uppercase tracking-wide">
            {profile?.role === "admin" ? (
              <Link href="/admin" className="hover:text-brass">
                Admin Panel
              </Link>
            ) : null}
            <Link href="/team/account" className="hover:text-brass">
              Account
            </Link>
            <LogoutButton redirectTo="/team/login" />
          </nav>
        </div>
        <div className="mx-auto max-w-5xl px-6 pb-4">
          <nav className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-wide text-chalk/75">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-brass">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
