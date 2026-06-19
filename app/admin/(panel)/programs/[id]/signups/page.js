import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ExportCsvButton from "@/components/ExportCsvButton";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function ProgramSignupsPage({ params }) {
  const supabase = createClient();

  const [{ data: program }, { data: signups }] = await Promise.all([
    supabase.from("programs").select("*").eq("id", params.id).single(),
    supabase
      .from("signups")
      .select("*")
      .eq("program_id", params.id)
      .order("created_at", { ascending: false }),
  ]);

  if (!program) notFound();

  return (
    <div>
      <Link
        href="/admin"
        className="font-mono text-xs uppercase tracking-wide text-ink/50 hover:text-ink"
      >
        ← Back to Dashboard
      </Link>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-wide">
            {program.name}
          </h1>
          <p className="mt-1 font-mono text-sm text-ink/60">
            {signups?.length || 0} sign-up{signups?.length === 1 ? "" : "s"}
          </p>
        </div>
        <ExportCsvButton
          signups={signups || []}
          filename={`${program.slug}-signups.csv`}
        />
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-2 border-ink/15 bg-white font-mono text-sm">
          <thead>
            <tr className="border-b-2 border-ink/15 bg-ink/5 text-left uppercase text-xs tracking-wide">
              <th className="p-3">Parent</th>
              <th className="p-3">Player</th>
              <th className="p-3">Age</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Notes</th>
              <th className="p-3">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {(signups || []).map((s) => (
              <tr key={s.id} className="border-b border-ink/10">
                <td className="p-3">{s.parent_name}</td>
                <td className="p-3">{s.player_name}</td>
                <td className="p-3">{s.player_age || "—"}</td>
                <td className="p-3">{s.email}</td>
                <td className="p-3">{s.phone || "—"}</td>
                <td className="p-3 max-w-xs truncate" title={s.notes}>
                  {s.notes || "—"}
                </td>
                <td className="p-3 whitespace-nowrap">
                  {new Date(s.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {(!signups || signups.length === 0) && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-ink/50">
                  No sign-ups yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
