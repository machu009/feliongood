"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const CADENCES = ["weekly", "bi-weekly", "monthly"];

export default function PracticeForm({ initialData = null, isTemplate = true, programId }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(programId || "");

  // Determine if we're editing
  const isEditing = !!initialData?.id;

  // Form state
  const [practiceType, setPracticeType] = useState(
    initialData?.template_id ? "template" : "one-off"
  );
  const [cadence, setCadence] = useState(initialData?.cadence || "weekly");
  const [selectedDays, setSelectedDays] = useState(initialData?.days_of_week || ["Monday", "Wednesday"]);
  const [startTime, setStartTime] = useState(initialData?.start_time || "18:00");
  const [durationMinutes, setDurationMinutes] = useState(initialData?.duration_minutes || 90);
  const [location, setLocation] = useState(initialData?.location || "");
  const [specialGear, setSpecialGear] = useState(initialData?.special_gear || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [practiceDate, setPracticeDate] = useState(initialData?.practice_date || "");
  const [generateThroughDate, setGenerateThroughDate] = useState("");
  const [isSeries, setIsSeries] = useState(false);
  const [seriesDates, setSeriesDates] = useState([""]);

  useEffect(() => {
    const loadPrograms = async () => {
      const { data } = await supabase
        .from("programs")
        .select("id, name")
        .order("sort_order", { ascending: true });
      setPrograms(data || []);
      if (!selectedProgram && data?.length > 0) {
        setSelectedProgram(data[0].id);
      }
    };
    loadPrograms();
  }, []);

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const addSeriesDate = () => {
    setSeriesDates([...seriesDates, ""]);
  };

  const updateSeriesDate = (index, value) => {
    const updated = [...seriesDates];
    updated[index] = value;
    setSeriesDates(updated);
  };

  const removeSeriesDate = (index) => {
    setSeriesDates(seriesDates.filter((_, i) => i !== index));
  };

  const generatePracticesFromTemplate = async (templateId, throughDate, programId) => {
    // Generate practice records from template until throughDate
    const template = await supabase
      .from("practice_templates")
      .select("*")
      .eq("id", templateId)
      .single();

    if (!template.data) return;

    const practices = [];
    const startDate = new Date();
    const endDate = new Date(throughDate);

    // Logic to generate dates based on cadence and days_of_week
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayName = DAYS[currentDate.getDay()];
      if (template.data.days_of_week.includes(dayName)) {
        practices.push({
          practice_date: currentDate.toISOString().split("T")[0],
          start_time: template.data.start_time,
          duration_minutes: template.data.duration_minutes,
          location: template.data.location,
          special_gear: template.data.special_gear,
          template_id: templateId,
          program_id: programId,
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Insert all practices
    if (practices.length > 0) {
      const { error: insertError } = await supabase
        .from("practices")
        .insert(practices);
      if (insertError) throw insertError;
    }
  };

  const createAttendanceRecords = async (practiceId) => {
    // Get all active players
    const { data: players } = await supabase
      .from("players")
      .select("id")
      .eq("is_active", true);

    if (!players) return;

    // Create attendance records for each player
    const attendanceRecords = players.map((player) => ({
      practice_id: practiceId,
      player_id: player.id,
      attended: false,
    }));

    const { error: attendanceError } = await supabase
      .from("practice_attendance")
      .insert(attendanceRecords);

    if (attendanceError) throw attendanceError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const isEditing = initialData?.id;

      if (isEditing && !initialData?.template_id) {
        // Update existing practice
        const { error: updateError } = await supabase
          .from("practices")
          .update({
            start_time: startTime,
            duration_minutes: durationMinutes,
            location,
            special_gear: specialGear,
            notes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialData.id);

        if (updateError) throw updateError;
        router.push("/admin/schedule");
      } else if (practiceType === "template") {
        // Create or update template
        if (isEditing && initialData?.template_id) {
          const { error: updateError } = await supabase
            .from("practice_templates")
            .update({
              cadence,
              days_of_week: selectedDays,
              start_time: startTime,
              duration_minutes: durationMinutes,
              location,
              special_gear: specialGear,
              notes,
              updated_at: new Date().toISOString(),
            })
            .eq("id", initialData.template_id);

          if (updateError) throw updateError;
        } else {
          const { data: template, error: templateError } = await supabase
            .from("practice_templates")
            .insert({
              cadence,
              days_of_week: selectedDays,
              start_time: startTime,
              duration_minutes: durationMinutes,
              location,
              special_gear: specialGear,
              notes,
            })
            .select()
            .single();

          if (templateError) throw templateError;

          // Generate practices from template
          if (generateThroughDate) {
            await generatePracticesFromTemplate(template.id, generateThroughDate, programId);
          }
        }

        router.push(`/admin/schedule?program=${programId}`);
      } else if (isSeries) {
        // Create multiple one-off practices
        const practicesToCreate = seriesDates
          .filter((date) => date)
          .map((date) => ({
            practice_date: date,
            start_time: startTime,
            duration_minutes: durationMinutes,
            location,
            special_gear: specialGear,
            notes,
            program_id: programId,
          }));

        const { error: practicesError } = await supabase
          .from("practices")
          .insert(practicesToCreate);

        if (practicesError) throw practicesError;

        // Create attendance records for each practice
        const { data: insertedPractices } = await supabase
          .from("practices")
          .select("id")
          .in("practice_date", seriesDates.filter((date) => date));

        for (const practice of insertedPractices || []) {
          await createAttendanceRecords(practice.id);
        }

        router.push(`/admin/schedule?program=${programId}`);
      } else {
        // Create single one-off practice
        const { data: practice, error: practiceError } = await supabase
          .from("practices")
          .insert({
            practice_date: practiceDate,
            start_time: startTime,
            duration_minutes: durationMinutes,
            location,
            special_gear: specialGear,
            notes,
            program_id: programId,
          })
          .select()
          .single();

        if (practiceError) throw practiceError;

        // Create attendance records
        await createAttendanceRecords(practice.id);

        router.push(`/admin/schedule?program=${programId}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-clay/10 border-2 border-clay p-4 text-clay">
          {error}
        </div>
      )}

      {/* Program Selector */}
      {programs.length > 0 && (
        <div>
          <label className="block font-mono text-sm uppercase tracking-wide mb-3">
            Team
          </label>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="w-full border-2 border-ink/15 p-3 font-mono text-sm"
          >
            <option value="">Select a team</option>
            {programs.map((prog) => (
              <option key={prog.id} value={prog.id}>
                {prog.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className="block font-mono text-sm uppercase tracking-wide mb-3">
          Practice Type
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="template"
              checked={practiceType === "template"}
              onChange={(e) => setPracticeType(e.target.value)}
              className="w-4 h-4"
            />
            <span className="font-mono text-sm">Recurring Template</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="one-off"
              checked={practiceType === "one-off"}
              onChange={(e) => setPracticeType(e.target.value)}
              className="w-4 h-4"
            />
            <span className="font-mono text-sm">One-Off Practice</span>
          </label>
        </div>
      </div>

      {/* Template Fields */}
      {practiceType === "template" && (
        <>
          <div>
            <label className="block font-mono text-sm uppercase tracking-wide mb-3">
              Cadence
            </label>
            <select
              value={cadence}
              onChange={(e) => setCadence(e.target.value)}
              className="w-full border-2 border-ink/15 p-3 font-mono text-sm"
            >
              {CADENCES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-mono text-sm uppercase tracking-wide mb-3">
              Days of Week
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DAYS.map((day) => (
                <label
                  key={day}
                  className={`flex items-center gap-2 p-2 border-2 cursor-pointer ${
                    selectedDays.includes(day)
                      ? "border-ink bg-ink/5"
                      : "border-ink/15"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedDays.includes(day)}
                    onChange={() => toggleDay(day)}
                    className="w-4 h-4"
                  />
                  <span className="font-mono text-xs">{day.slice(0, 3)}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-mono text-sm uppercase tracking-wide mb-2">
              Generate Practices Through Date
            </label>
            <input
              type="date"
              value={generateThroughDate}
              onChange={(e) => setGenerateThroughDate(e.target.value)}
              className="w-full border-2 border-ink/15 p-3 font-mono text-sm"
              required
            />
            <p className="font-mono text-xs text-ink/50 mt-1">
              Auto-generate practices from today through this date
            </p>
          </div>
        </>
      )}

      {/* One-Off Practice Fields */}
      {practiceType === "one-off" && (
        <>
          <div>
            <label className="flex items-center gap-2 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={isSeries}
                onChange={(e) => setIsSeries(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="font-mono text-sm">Multiple Dates (Series)</span>
            </label>
          </div>

          {isSeries ? (
            <div>
              <label className="block font-mono text-sm uppercase tracking-wide mb-3">
                Practice Dates
              </label>
              <div className="space-y-2">
                {seriesDates.map((date, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => updateSeriesDate(index, e.target.value)}
                      className="flex-1 border-2 border-ink/15 p-3 font-mono text-sm"
                    />
                    {seriesDates.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSeriesDate(index)}
                        className="px-3 py-2 border-2 border-clay text-clay font-mono text-xs uppercase hover:bg-clay/5"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addSeriesDate}
                className="mt-2 px-4 py-2 border-2 border-ink bg-ink/5 font-mono text-xs uppercase tracking-wide hover:bg-ink/10"
              >
                + Add Date
              </button>
            </div>
          ) : (
            <div>
              <label className="block font-mono text-sm uppercase tracking-wide mb-2">
                Practice Date
              </label>
              <input
                type="date"
                value={practiceDate}
                onChange={(e) => setPracticeDate(e.target.value)}
                className="w-full border-2 border-ink/15 p-3 font-mono text-sm"
                required
              />
            </div>
          )}
        </>
      )}

      {/* Common Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-sm uppercase tracking-wide mb-2">
            Start Time
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border-2 border-ink/15 p-3 font-mono text-sm"
            required
          />
        </div>

        <div>
          <label className="block font-mono text-sm uppercase tracking-wide mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
            min="15"
            step="15"
            className="w-full border-2 border-ink/15 p-3 font-mono text-sm"
            required
          />
        </div>
      </div>

      <div>
        <label className="block font-mono text-sm uppercase tracking-wide mb-2">
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Field A, Gym, etc."
          className="w-full border-2 border-ink/15 p-3 font-mono text-sm"
        />
      </div>

      <div>
        <label className="block font-mono text-sm uppercase tracking-wide mb-2">
          Special Gear Needed
        </label>
        <textarea
          value={specialGear}
          onChange={(e) => setSpecialGear(e.target.value)}
          placeholder="Cleats, glove, helmet, etc."
          rows="2"
          className="w-full border-2 border-ink/15 p-3 font-mono text-sm"
        />
      </div>

      <div>
        <label className="block font-mono text-sm uppercase tracking-wide mb-2">
          Notes for Coach
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Internal notes, focus areas, etc."
          rows="3"
          className="w-full border-2 border-ink/15 p-3 font-mono text-sm"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-ink text-chalk px-6 py-3 font-mono text-sm uppercase tracking-wide hover:bg-ink/90 disabled:opacity-50"
        >
          {loading ? "Saving..." : isEditing ? "Update Practice" : "Create Practice"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border-2 border-ink/15 px-6 py-3 font-mono text-sm uppercase tracking-wide hover:bg-ink/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
