"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PracticeAttendance({ practiceId, onClose }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [practice, setPractice] = useState(null);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    loadPracticeAndAttendance();
  }, [practiceId]);

  const loadPracticeAndAttendance = async () => {
    try {
      // Get practice details
      const { data: practiceData } = await supabase
        .from("practices")
        .select("*")
        .eq("id", practiceId)
        .single();

      setPractice(practiceData);

      // Get attendance records with player info
      let { data: attendanceData } = await supabase
        .from("practice_attendance")
        .select("*, players(id, full_name, jersey_number, position)")
        .eq("practice_id", practiceId)
        .order("players.jersey_number", { ascending: true });

      // If no attendance records exist, create them from active players
      if (!attendanceData || attendanceData.length === 0) {
        const { data: activePlayers } = await supabase
          .from("players")
          .select("id, full_name, jersey_number, position")
          .eq("is_active", true)
          .order("jersey_number", { ascending: true });

        if (activePlayers && activePlayers.length > 0) {
          // Create attendance records
          const attendanceRecords = activePlayers.map((player) => ({
            practice_id: practiceId,
            player_id: player.id,
            attended: false,
          }));

          await supabase
            .from("practice_attendance")
            .insert(attendanceRecords);

          // Fetch the newly created records
          const { data: newAttendanceData } = await supabase
            .from("practice_attendance")
            .select("*, players(id, full_name, jersey_number, position)")
            .eq("practice_id", practiceId)
            .order("players.jersey_number", { ascending: true });

          setAttendance(newAttendanceData || []);
        }
      } else {
        setAttendance(attendanceData || []);
      }
    } catch (err) {
      console.error("Error loading attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = (attendanceId, currentValue) => {
    setAttendance((prev) =>
      prev.map((record) =>
        record.id === attendanceId
          ? { ...record, attended: !currentValue }
          : record
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update all attendance records
      for (const record of attendance) {
        await supabase
          .from("practice_attendance")
          .update({ attended: record.attended })
          .eq("id", record.id);
      }
      onClose?.();
    } catch (err) {
      console.error("Error saving attendance:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  const attendanceCount = attendance.filter((a) => a.attended).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl tracking-wide">
          {practice?.practice_date}
        </h2>
        <p className="font-mono text-sm text-ink/60">
          {practice?.start_time} · {practice?.location}
        </p>
        {practice?.special_gear && (
          <div className="mt-3 bg-clay/10 border-l-4 border-clay p-3">
            <p className="font-mono text-xs uppercase tracking-wide text-clay">
              Gear Needed
            </p>
            <p className="font-mono text-sm mt-1">{practice.special_gear}</p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-sm uppercase tracking-wide">Roster</h3>
          <span className="font-mono text-xs text-ink/60">
            {attendanceCount} / {attendance.length} present
          </span>
        </div>

        <div className="border-2 border-ink/15 divide-y-2 divide-ink/15">
          {attendance.map((record) => (
            <label
              key={record.id}
              className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-ink/5 ${
                record.attended ? "bg-turf/5" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={record.attended}
                onChange={() => toggleAttendance(record.id, record.attended)}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="font-display text-sm tracking-wide">
                  {record.players.full_name}
                </p>
                <p className="font-mono text-xs text-ink/50">
                  {record.players.jersey_number ? `#${record.players.jersey_number}` : ""}{" "}
                  {record.players.position}
                </p>
              </div>
              <span
                className={`font-mono text-xs px-2 py-1 rounded ${
                  record.attended
                    ? "bg-turf text-white"
                    : "bg-ink/10 text-ink/60"
                }`}
              >
                {record.attended ? "Present" : "Absent"}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-turf text-white px-6 py-3 font-mono text-sm uppercase tracking-wide hover:bg-turf/90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Attendance"}
        </button>
        <button
          onClick={onClose}
          className="border-2 border-ink/15 px-6 py-3 font-mono text-sm uppercase tracking-wide hover:bg-ink/5"
        >
          Close
        </button>
      </div>
    </div>
  );
}
