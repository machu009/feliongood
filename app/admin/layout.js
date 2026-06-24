// app/admin/layout.js
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
  const supabase = createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const navItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Programs", href: "/admin/programs" },
    { label: "Roster", href: "/admin/roster" },
    { label: "Schedule", href: "/admin/schedule" },
    { label: "Stats", href: "/admin/stats" },
    { label: "Team Members", href: "/admin/team-members" },
    { label: "Team Settings", href: "/admin/team-settings" },
    { label: "Messages", href: "/admin/messages" },
    { label: "Site Settings", href: "/admin/site-settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-ink border-b-2 border-ink/20">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl tracking-widest text-chalk uppercase">
              Coach Admin
            </h1>
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="font-mono text-xs uppercase tracking-wide text-chalk/70 hover:text-chalk"
              >
                Team Site
              </Link>
              <Link
                href="/"
                className="font-mono text-xs uppercase tracking-wide text-chalk/70 hover:text-chalk"
              >
                View Site
              </Link>
              <form
                action={async () => {
                  "use server";
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  redirect("/login");
                }}
              >
                <button
                  type="submit"
                  className="font-mono text-xs uppercase tracking-wide text-chalk/70 hover:text-chalk"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-ink/95 border-t border-ink/20">
          <div className="px-8 flex items-center overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-mono text-xs uppercase tracking-wide text-chalk/60 hover:text-chalk py-4 px-4 border-b-2 border-transparent hover:border-chalk/30 transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="px-8 py-12 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
