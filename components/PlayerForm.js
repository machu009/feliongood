"use client";

import { useState, useTransition, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PlayerForm({ initialValues = {}, action, submitLabel, programs = [] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(initialValues.profile_pic_url || null);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [availablePrograms, setAvailablePrograms] = useState(programs);
  const [programsFetched, setProgramsFetched] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState(initialValues.program_id || "");
  const supabase = createClient();

  // Fetch programs on component mount
  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const res = await fetch("/api/programs");
        const data = await res.json();
        if (data.programs) {
          setAvailablePrograms(data.programs);
        }
      } catch (err) {
        console.error("Failed to load programs:", err);
      } finally {
        setProgramsFetched(true);
      }
    };

    loadPrograms();
  }, []);

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB");
      return;
    }

    setUploadingPic(true);
    setError(null);

    try {
      // Generate unique file name
      const timestamp = Date.now();
      const playerId = initialValues.id || "new";
      const uniqueFileName = `${playerId}_${timestamp}_${file.name}`;
      const filePath = `${playerId}/${uniqueFileName}`;

      // Upload directly to Supabase Storage from browser
      const { data, error: uploadError } = await supabase.storage
        .from("profilepic")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        setError(`Upload failed: ${uploadError.message}`);
        setUploadingPic(false);
        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("profilepic")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl;

      if (!publicUrl) {
        setError("Failed to get public URL");
        setUploadingPic(false);
        return;
      }

      setProfilePicUrl(publicUrl);
      setError(null);
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image: " + err.message);
    } finally {
      setUploadingPic(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Add profile pic URL to form data
    if (profilePicUrl) {
      formData.set("profile_pic_url", profilePicUrl);
    }
    
    setError(null);
    startTransition(async () => {
      const res = await action(formData);
      if (res?.error) setError(res.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      {/* Profile Picture Upload */}
      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Profile Picture
        </label>
        <div className="mt-3 flex items-end gap-4">
          {profilePicUrl && (
            <div className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profilePicUrl}
                alt="Profile"
                width={80}
                height={80}
                className="h-20 w-20 object-cover border-2 border-ink/20"
              />
            </div>
          )}
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingPic}
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-mono file:bg-ink/10 file:text-ink hover:file:bg-ink/20"
            />
            {uploadingPic && (
              <p className="mt-1 font-mono text-xs text-ink/60">Uploading...</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Program
        </label>
        <select
          name="program_id"
          value={selectedProgramId}
          onChange={(e) => setSelectedProgramId(e.target.value)}
          required
          className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
        >
          <option value="">
            {programsFetched ? "Select a program" : "Loading programs..."}
          </option>
          {availablePrograms.map((program) => (
            <option key={program.id} value={program.id}>
              {program.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Full name
        </label>
        <input
          name="full_name"
          defaultValue={initialValues.full_name || ""}
          required
          className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Jersey #
          </label>
          <input
            name="jersey_number"
            defaultValue={initialValues.jersey_number || ""}
            className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Position
          </label>
          <input
            name="position"
            placeholder="e.g. SS, RHP"
            defaultValue={initialValues.position || ""}
            className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Grad year
          </label>
          <input
            type="number"
            name="grad_year"
            defaultValue={initialValues.grad_year || ""}
            className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Bats / Throws
          </label>
          <input
            name="bats_throws"
            placeholder="e.g. R/R"
            defaultValue={initialValues.bats_throws || ""}
            className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Height
          </label>
          <input
            name="height"
            placeholder={'e.g. 6\'1"'}
            defaultValue={initialValues.height || ""}
            className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Weight
          </label>
          <input
            name="weight"
            placeholder="e.g. 185"
            defaultValue={initialValues.weight || ""}
            className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Honors (optional)
        </label>
        <input
          name="honors"
          placeholder="e.g. All-State, Academic All-State, All-Region"
          defaultValue={initialValues.honors || ""}
          className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
        />
        <p className="mt-1 font-mono text-xs text-ink/50">Separate multiple honors with commas</p>
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Notes (optional)
        </label>
        <textarea
          name="notes"
          rows={2}
          defaultValue={initialValues.notes || ""}
          className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-2 font-mono text-sm">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={initialValues.is_active ?? true}
          className="h-4 w-4"
        />
        Active on roster
      </label>

      {/* Hidden field for profile_pic_url - will be set by JavaScript */}
      <input type="hidden" name="profile_pic_url" value={profilePicUrl || ""} />

      {error ? <p className="font-mono text-sm text-clay">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending || uploadingPic}
        className="bg-ink px-6 py-3 font-mono text-sm font-medium uppercase tracking-wide text-chalk hover:bg-ink/90 disabled:opacity-60"
      >
        {isPending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
