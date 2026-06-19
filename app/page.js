import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgramCard from "@/components/ProgramCard";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function HomePage() {
  const supabase = createClient();

  const [{ data: programs }, { data: settings }] = await Promise.all([
    supabase
      .from("programs")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .limit(3),
    supabase.from("site_settings").select("*").single(),
  ]);

  return (
    <>
      <Navbar />

      <section className="relative overflow-hidden border-b-4 border-ink text-chalk">
        <div className="absolute inset-0">
          <Image
            src="/logo-full.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-25"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-turf/90" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 py-20">
          <div className="grid items-center gap-12 md:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-chalk/70">
                Coach Felion &middot; Youth &amp; Travel Baseball
              </p>
              <h1 className="mt-4 font-display text-6xl leading-[0.95] tracking-wide">
                Building ballplayers, one rep at a time.
              </h1>
              <p className="mt-6 max-w-xl text-chalk/85">
                {settings?.bio ||
                  "Camps, lessons, and team sign-ups — all in one place. Find a program below and reserve your spot."}
              </p>
              <div className="mt-8 flex gap-4">
                <Link
                  href="/programs"
                  className="bg-chalk px-6 py-3 font-mono text-sm font-medium uppercase tracking-wide text-ink hover:bg-chalk/90"
                >
                  See Programs
                </Link>
                <Link
                  href="/donate"
                  className="border-2 border-chalk px-6 py-3 font-mono text-sm font-medium uppercase tracking-wide text-chalk hover:bg-chalk hover:text-ink"
                >
                  Support the Program
                </Link>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="relative h-56 w-56 overflow-hidden rounded-full border-[6px] border-chalk shadow-2xl sm:h-64 sm:w-64">
                <Image
                  src="/logo-mark.jpg"
                  alt="Felion Good Baseball emblem"
                  fill
                  priority
                  className="object-cover"
                  sizes="256px"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="relative stitch-divider" />
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-3xl tracking-wide">
            On the Roster Now
          </h2>
          <Link
            href="/programs"
            className="font-mono text-sm text-clay hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="mt-8 space-y-4">
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
