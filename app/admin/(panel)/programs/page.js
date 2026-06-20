import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeleteProgramButton from "@/components/DeleteProgramButton";

export const revalidate = 0;

export default async function ProgramsListPage() {
  const supabase = createClient();

  const [{ data: programs }, { data: signups }] = await Promise.all([
    supabase.from("programs").select("*").order("sort_order", { ascending: true }),
    supabase.from("signups").select("program_id"),
  ]);

  const counts = {};
  (signups || []).forEach((s) => {
    counts[s.program_id] = (counts[s.program_id] || 0) + 1;
  });

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-wide">Programs</h1>
          <p className="mt-1 font-mono text-sm text-ink/60">
            {programs?.length || 0} total
          </p>
        </div>
        <Link
          href="/admin/programs/new"
          className="bg-ink px-5 py-2.5 font-mono text-sm uppercase tracking-wide text-chalk hover:bg-ink/90"
        >
          + Add Program
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {(programs || []).map((program) => (
          <div
            key={program.id}
            className="flex items-center justify-between border-2 border-ink/15 bg-white p-4"
          >
            <div>
              <div className="flex items-center gap-3">
                <p className="font-display text-xl tracking-wide">
                  {program.name}
                </p>
                {!program.is_active ? (
                  <span className="stamp font-mono text-xs uppercase text-ink/40">
                    Hidden
                  </span>
                ) : null}
              </div>
              <p className="font-mono text-xs uppercase tracking-wide text-ink/50">
                {program.type} &middot; /{program.slug}
              </p>
            </div>

            <div className="flex items-center gap-5">
              <Link
                href={`/admin/programs/${program.id}/signups`}
                className="font-mono text-sm text-clay hover:underline"
              >
                {counts[program.id] || 0} sign-ups
              </Link>
              <Link
                href={`/admin/programs/${program.id}/edit`}
                className="font-mono text-xs uppercase tracking-wide text-ink/70 hover:text-ink"
              >
                Edit
              </Link>
              <DeleteProgramButton
                programId={program.id}
                programName={program.name}
              />
            </div>
          </div>
        ))}

        {(!programs || programs.length === 0) && (
          <p className="font-mono text-sm text-ink/60">
            No programs yet.{" "}
            <Link href="/admin/programs/new" className="text-clay underline">
              Create your first one
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
