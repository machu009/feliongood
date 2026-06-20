import TeamNav from "@/components/TeamNav";
import { createClient } from "@/lib/supabase/server";

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
      <TeamNav isAdmin={profile?.role === "admin"} />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
