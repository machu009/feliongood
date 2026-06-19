"use client";

import { useState, useTransition } from "react";
import { sendContactMessage } from "./actions";

export default function ContactForm({ defaultName, defaultEmail }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    setResult(null);
    startTransition(async () => {
      const res = await sendContactMessage(formData);
      setResult(res);
      if (res?.success) e.target.reset();
    });
  }

  if (result?.success) {
    return (
      <div className="border-2 border-turf bg-turf/5 p-6">
        <p className="stamp inline-block font-mono text-sm uppercase text-turf">
          Sent
        </p>
        <p className="mt-3 text-sm text-ink/80">
          Your message is on its way to Coach. Thanks for reaching out!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Your name
          </label>
          <input
            name="sender_name"
            defaultValue={defaultName || ""}
            required
            className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
            Your email
          </label>
          <input
            name="sender_email"
            type="email"
            defaultValue={defaultEmail || ""}
            required
            className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          This is about
        </label>
        <select
          name="category"
          defaultValue="contact"
          className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
        >
          <option value="contact">General question for Coach</option>
          <option value="join">Joining the team</option>
        </select>
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Message
        </label>
        <textarea
          name="message"
          rows={5}
          required
          className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
        />
      </div>

      {result?.error ? (
        <p className="font-mono text-sm text-clay">{result.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="bg-clay px-6 py-3 font-mono text-sm font-medium uppercase tracking-wide text-chalk hover:bg-clay/90 disabled:opacity-60"
      >
        {isPending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
