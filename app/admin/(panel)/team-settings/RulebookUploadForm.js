"use client";

import { useState, useTransition } from "react";
import { uploadRulebook } from "./actions";

export default function RulebookUploadForm({ currentFilename }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    setResult(null);
    startTransition(async () => {
      const res = await uploadRulebook(formData);
      setResult(res);
      if (res?.success) e.target.reset();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-3">
      <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
        Team Rule Book (PDF)
      </label>
      {currentFilename ? (
        <p className="font-mono text-xs text-ink/50">
          Currently uploaded: {currentFilename}
        </p>
      ) : (
        <p className="font-mono text-xs text-ink/50">
          Nothing uploaded yet.
        </p>
      )}
      <input
        type="file"
        name="file"
        accept="application/pdf"
        required
        className="w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
      />

      {result?.error ? (
        <p className="font-mono text-sm text-clay">{result.error}</p>
      ) : null}
      {result?.success ? (
        <p className="font-mono text-sm text-turf">Uploaded.</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="bg-ink px-6 py-2.5 font-mono text-sm font-medium uppercase tracking-wide text-chalk hover:bg-ink/90 disabled:opacity-60"
      >
        {isPending ? "Uploading…" : "Upload Rule Book"}
      </button>
    </form>
  );
}
