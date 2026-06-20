import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SignupForm from "./SignupForm";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export const revalidate = 0;

function formatDate(d) {
  if (!d) return null;
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ProgramDetailPage({ params }) {
  const supabase = createClient();

  const [{ data: program }, { data: settings }] = await Promise.all([
    supabase
      .from("programs")
      .select("*")
      .eq("slug", params.slug)
      .eq("is_active", true)
      .single(),
    supabase.from("site_settings").select("*").single(),
  ]);

  if (!program) notFound();

  const deadlinePassed =
    program.signup_deadline &&
    new Date(program.signup_deadline + "T23:59:59") < new Date();

  return (
    <>
      <Navbar />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-clay">
          {program.type}
        </p>
        <h1 className="mt-2 font-display text-5xl tracking-wide">
          {program.name}
        </h1>

        <dl className="mt-6 grid gap-3 border-y-2 border-ink/10 py-5 font-mono text-sm sm:grid-cols-2">
          {program.start_date ? (
            <div>
              <dt className="text-ink/50 uppercase text-xs">Dates</dt>
              <dd>
                {formatDate(program.start_date)}
                {program.end_date && program.end_date !== program.start_date
                  ? ` – ${formatDate(program.end_date)}`
                  : ""}
              </dd>
            </div>
          ) : null}
          {program.start_time || program.end_time ? (
            <div>
              <dt className="text-ink/50 uppercase text-xs">Time</dt>
              <dd>
                {[program.start_time, program.end_time]
                  .filter(Boolean)
                  .join(" – ")}
              </dd>
            </div>
          ) : null}
          {program.location ? (
            <div>
              <dt className="text-ink/50 uppercase text-xs">Location</dt>
              <dd>{program.location}</dd>
            </div>
          ) : null}
          {program.signup_deadline ? (
            <div>
              <dt className="text-ink/50 uppercase text-xs">
                Sign-up deadline
              </dt>
              <dd>{formatDate(program.signup_deadline)}</dd>
            </div>
          ) : null}
          {program.capacity ? (
            <div>
              <dt className="text-ink/50 uppercase text-xs">Capacity</dt>
              <dd>{program.capacity} players</dd>
            </div>
          ) : null}
        </dl>

        {program.description ? (
          <p className="mt-6 text-ink/80">{program.description}</p>
        ) : null}

        <div className="mt-10">
          <h2 className="font-display text-2xl tracking-wide">Sign Up</h2>
          <p className="mt-1 text-sm text-ink/60">
            Payment is handled separately with Coach Felion — this just
            reserves your spot.
          </p>
          <div className="mt-5">
            {deadlinePassed ? (
              <p className="stamp inline-block font-mono text-sm uppercase text-ink/40">
                Sign-ups Closed
              </p>
            ) : (
              <SignupForm programId={program.id} programName={program.name} />
            )}
          </div>
        </div>
      </section>
      <Footer
        contactEmail={settings?.contact_email}
        contactPhone={settings?.contact_phone}
      />
    </>
  );
}
