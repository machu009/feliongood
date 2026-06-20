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

        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
          <div className="grid items-center gap-8 md:grid-cols-[1.3fr_1fr] md:gap-12">
            <div
              className="order-first flex justify-center md:order-none md:justify-start"
            >
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-chalk shadow-2xl sm:h-56 sm:w-56 sm:border-[6px] md:hidden">
                <Image
                  src="/logo-mark.jpg"
                  alt="Felion Good Baseball emblem"
                  fill
                  priority
                  className="object-cover"
                  sizes="128px"
                />
              </div>
            </div>

            <div className="text-center md:text-left">
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-chalk/70 sm:text-sm sm:tracking-[0.2em]">
                Coach Felion &middot; Youth &amp; Travel Baseball
              </p>
              <h1 className="mt-3 font-display text-4xl leading-[0.95] tracking-wide sm:mt-4 sm:text-5xl md:text-6xl">
                Building ballplayers, one rep at a time.
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-sm text-chalk/85 sm:mt-6 sm:text-base md:mx-0">
                {settings?.bio ||
                  "Camps, lessons, and team sign-ups — all in one place. Find a program below and reserve your spot."}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
                <Link
                  href="/programs"
                  className="bg-chalk px-6 py-3 text-center font-mono text-sm font-medium uppercase tracking-wide text-ink hover:bg-chalk/90"
                >
                  See Programs
                </Link>
                <Link
                  href="/donate"
                  className="border-2 border-chalk px-6 py-3 text-center font-mono text-sm font-medium uppercase tracking-wide text-chalk hover:bg-chalk hover:text-ink"
                >
                  Support the Program
                </Link>
              </div>
            </div>

            <div className="hidden justify-center md:flex md:justify-end">
              <div className="relative h-56 w-56 overflow-hidden rounded-full border-[6px] border-chalk shadow-2xl md:h-64 md:w-64">
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

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr] sm:gap-10">
          <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-md border-4 border-ink shadow-lg sm:mx-0 sm:h-48 sm:w-48">
            <Image
              src="/coach-felion.jpg"
              alt={settings?.coach_name || "Coach Felion"}
              fill
              className="object-cover"
              sizes="192px"
            />
          </div>
          <div className="text-center sm:text-left">
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-clay">
              Meet the Coach
            </p>
            <h2 className="mt-2 font-display text-2xl tracking-wide sm:text-3xl">
              {settings?.coach_name || "Coach Felion"}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-ink/80 sm:text-base sm:mx-0">
              {settings?.coach_bio ||
                "Dedicated to helping young players build fundamentals, work ethic, and a love for the game — on and off the field."}
            </p>
            <div className="mt-5 inline-flex items-center gap-3 border-2 border-ink/15 bg-white px-4 py-2">
              <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                <Image
                  src="/granger-lancers.jpg"
                  alt="Granger Lancers"
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              </span>
              <span className="font-mono text-xs uppercase tracking-wide text-ink/70">
                Proudly coaching at Granger
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="stitch-divider" />
      </div>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-2xl tracking-wide sm:text-3xl">
            On the Roster Now
          </h2>
          <Link
            href="/programs"
            className="font-mono text-sm text-clay hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="mt-6 space-y-4 sm:mt-8">
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
