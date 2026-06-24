// app/admin/schedule/practices/[id]/attendance/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PracticeAttendance from "@/components/PracticeAttendance";
import Link from "next/link";

export default function PracticeAttendancePage({ params }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    router.push("/admin/schedule");
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl tracking-wide">
          Mark Attendance
        </h1>
        <Link
          href="/admin/schedule"
          className="font-mono text-sm uppercase tracking-wide text-ink/70 hover:text-ink"
        >
          ← Back to Schedule
        </Link>
      </div>

      <div className="max-w-2xl">
        <PracticeAttendance
          practiceId={params.id}
          onClose={() => {
            router.push("/admin/schedule");
          }}
        />
      </div>
    </div>
  );
}
