"use server";

import { createClient } from "@/lib/supabase/server";

export async function saveAttendance(practiceId, attendanceData) {
  const supabase = createClient();

  try {
    // attendanceData should be an array like:
    // [{ player_id: "uuid", attended: true }, ...]

    for (const record of attendanceData) {
      const { error } = await supabase
        .from("practice_attendance")
        .update({ attended: record.attended })
        .eq("practice_id", practiceId)
        .eq("player_id", record.player_id);

      if (error) {
        console.error("Error updating attendance:", error);
        return { error: "Failed to save attendance" };
      }
    }

    return { success: true };
  } catch (err) {
    console.error("Error in saveAttendance:", err);
    return { error: err.message };
  }
}
