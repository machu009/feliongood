// app/(panel)/schedule/practices/new/page.js
import PracticeForm from "@/components/PracticeForm";
import Link from "next/link";

export default function NewPracticePage({ searchParams }) {
  const programId = searchParams?.program;

  if (!programId) {
    return (
      <div>
        <h1 className="font-display text-4xl tracking-wide mb-4">Create Practice</h1>
        <p className="font-mono text-sm text-ink/60 mb-6">
          Please select a team from the schedule page first.
        </p>
        <Link
          href="/admin/schedule"
          className="text-clay underline font-mono text-sm"
        >
          ← Back to Schedule
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide mb-8">Create Practice</h1>
      <PracticeForm programId={programId} />
    </div>
  );
}
