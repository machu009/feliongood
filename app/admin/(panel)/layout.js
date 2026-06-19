import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

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
            <Link href="/admin" className="hover:text-brass">
              Dashboard
            </Link>
            <Link href="/admin/programs/new" className="hover:text-brass">
              New Program
            </Link>
            <Link href="/admin/settings" className="hover:text-brass">
              Settings
            </Link>
            <Link href="/" className="hover:text-brass">
              View Site
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
