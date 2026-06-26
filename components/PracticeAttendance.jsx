"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { saveAttendance } from "@/lib/attendance/actions";

export default function PracticeAttendance({ practiceId, onClose }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [practice, setPractice] = useState(null);
  const [roster, setRoster] = useState([]);

  useEffect(() => {
    loadData();
  }, [practiceId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Get practice details
      const { data: practiceData } = await supabase
        .from("practices")
        .select("*")
        .eq("id", practiceId)
        .single();

      setPractice(practiceData);

      // Get all active players
      const { data: players } = await supabase
        .from("players")
        .select("id, full_name, jersey_number, position")
        .eq("is_active", true)
        .order("jersey_number", { ascending: true });

      if (!players) {
        console.error("No players found");
        setRoster([]);
        return;
      }

      // Get attendance records for this practice
      const { data: attendance } = await supabase
        .from("practice_attendance")
        .select("player_id, attended")
        .eq("practice_id", practiceId);

      // Create a map of player_id -> attended
      const attendanceMap = {};
      attendance?.forEach((record) => {
        attendanceMap[record.player_id] = record.attended;
      });

      // If no attendance records exist, create them
      if (!attendance || attendance.length === 0) {
        const newRecords = players.map((p) => ({
          practice_id: practiceId,
          player_id: p.id,
          attended: false,
        }));

        const { error } = await supabase
          .from("practice_attendance")
          .insert(newRecords);

        if (error) console.error("Error creating attendance records:", error);

        // Set all to false since we just created them
        players.forEach((p) => {
          attendanceMap[p.id] = false;
        });
      }

      // Merge players with attendance data
      const rosterWithAttendance = players.map((player) => ({
        ...player,
        attended: attendanceMap[player.id] || false,
      }));

      setRoster(rosterWithAttendance);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = (playerId) => {
    setRoster((prev) =>
      prev.map((player) =>
        player.id === playerId
          ? { ...player, attended: !player.attended }
          : player
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Prepare attendance data for server action
      const attendanceData = roster.map((player) => ({
        player_id: player.id,
        attended: player.attended,
      }));

      // Call server action
      const result = await saveAttendance(practiceId, attendanceData);

      if (result?.error) {
        console.error("Error saving attendance:", result.error);
        alert("Failed to save attendance: " + result.error);
      } else {
        onClose?.();
      }
    } catch (err) {
      console.error("Error saving attendance:", err);
      alert("Error saving attendance: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 font-mono text-sm">Loading roster...</div>;
  }

  const attendanceCount = roster.filter((p) => p.attended).length;

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
            {attendanceCount} / {roster.length} present
          </span>
        </div>

        {roster.length === 0 ? (
          <p className="font-mono text-sm text-ink/60">No active players</p>
        ) : (
          <div className="border-2 border-ink/15 divide-y-2 divide-ink/15">
            {roster.map((player) => (
              <label
                key={player.id}
                className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-ink/5 ${
                  player.attended ? "bg-turf/5" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={player.attended}
                  onChange={() => toggleAttendance(player.id)}
                  className="w-5 h-5"
                />
                <div className="flex-1">
                  <p className="font-display text-sm tracking-wide">
                    {player.full_name}
                  </p>
                  <p className="font-mono text-xs text-ink/50">
                    {player.jersey_number ? `#${player.jersey_number}` : ""}{" "}
                    {player.position}
                  </p>
                </div>
                <span
                  className={`font-mono text-xs px-2 py-1 rounded ${
                    player.attended
                      ? "bg-turf text-white"
                      : "bg-ink/10 text-ink/60"
                  }`}
                >
                  {player.attended ? "Present" : "Absent"}
                </span>
              </label>
            ))}
          </div>
        )}
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
