"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function DeletePracticeButton({ practiceId, practiceDate }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete practice on ${practiceDate}?`)) return;

    setLoading(true);
    try {
      // Delete attendance records first
      await supabase
        .from("practice_attendance")
        .delete()
        .eq("practice_id", practiceId);

      // Delete practice
      const { error } = await supabase
        .from("practices")
        .delete()
        .eq("id", practiceId);

      if (error) throw error;

      router.refresh();
    } catch (err) {
      alert(`Error deleting practice: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="font-mono text-xs uppercase tracking-wide text-clay hover:text-clay/70 disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
