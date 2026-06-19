"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton({ redirectTo = "/admin/login" }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="font-mono text-sm uppercase tracking-wide text-chalk/70 hover:text-chalk"
    >
      Sign Out
    </button>
  );
}
