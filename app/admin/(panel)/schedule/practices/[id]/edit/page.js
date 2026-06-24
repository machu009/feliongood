// app/admin/schedule/practices/[id]/edit/page.js
import PracticeForm from "@/components/PracticeForm";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function EditPracticePage({ params }) {
  const supabase = createClient();

  const { data: practice } = await supabase
    .from("practices")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!practice) {
    return (
      <div>
        <p>Practice not found</p>
        <Link href="/admin/schedule">← Back to Schedule</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl tracking-wide">Edit Practice</h1>
        <Link
          href="/admin/schedule"
          className="font-mono text-sm uppercase tracking-wide text-ink/70 hover:text-ink"
        >
          ← Back to Schedule
        </Link>
      </div>

      <PracticeForm initialData={practice} />
    </div>
  );
}
