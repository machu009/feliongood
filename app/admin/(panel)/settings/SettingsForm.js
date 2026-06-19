"use client";

import { useState, useTransition } from "react";
import { updateSettings } from "./actions";

export default function SettingsForm({ initialValues }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    setResult(null);
    startTransition(async () => {
      const res = await updateSettings(formData);
      setResult(res);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Homepage bio / intro text
        </label>
        <textarea
          name="bio"
          rows={4}
          defaultValue={initialValues.bio || ""}
          className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Venmo link
          </label>
          <input
            name="donation_venmo"
            placeholder="https://venmo.com/u/your-handle"
            defaultValue={initialValues.donation_venmo || ""}
            className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
            PayPal link
          </label>
          <input
            name="donation_paypal"
            placeholder="https://paypal.me/your-handle"
            defaultValue={initialValues.donation_paypal || ""}
            className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Contact email
          </label>
          <input
            name="contact_email"
            type="email"
            defaultValue={initialValues.contact_email || ""}
            className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Contact phone
          </label>
          <input
            name="contact_phone"
            defaultValue={initialValues.contact_phone || ""}
            className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
          />
        </div>
      </div>

      {result?.error ? (
        <p className="font-mono text-sm text-clay">{result.error}</p>
      ) : null}
      {result?.success ? (
        <p className="font-mono text-sm text-turf">Saved.</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="bg-ink px-6 py-3 font-mono text-sm font-medium uppercase tracking-wide text-chalk hover:bg-ink/90 disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save Settings"}
      </button>
    </form>
  );
}
