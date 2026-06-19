import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgramCard from "@/components/ProgramCard";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function ProgramsPage() {
  const supabase = createClient();

  const [{ data: programs }, { data: settings }] = await Promise.all([
    supabase
      .from("programs")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase.from("site_settings").select("*").single(),
  ]);

  return (
    <>
      <Navbar />
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-clay">
          Camps &middot; Lessons &middot; Teams
        </p>
        <h1 className="mt-2 font-display text-5xl tracking-wide">
          Programs &amp; Sign-Ups
        </h1>

        <div className="mt-10 space-y-4">
          {programs && programs.length > 0 ? (
            programs.map((program, i) => (
              <ProgramCard key={program.id} program={program} number={i + 1} />
            ))
          ) : (
            <p className="font-mono text-sm text-ink/60">
              No programs posted yet — check back soon.
            </p>
          )}
        </div>
      </section>
      <Footer
        contactEmail={settings?.contact_email}
        contactPhone={settings?.contact_phone}
      />
    </>
  );
}
