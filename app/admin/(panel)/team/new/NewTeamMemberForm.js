"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createTeamMember } from "../actions";

function buildMailto({ email, fullName, tempPassword }) {
  const subject = encodeURIComponent("Your Felion Good Baseball team login");
  const body = encodeURIComponent(
    `Hi ${fullName},\n\n` +
      `You're all set up for the team site. Log in here:\n` +
      `https://feliongood.com/team/login\n\n` +
      `Email: ${email}\n` +
      `Temporary password: ${tempPassword}\n\n` +
      `Once you're in, you can change your password from the Account page.\n\n` +
      `See you at practice!\nCoach Felion`
  );
  return `mailto:${email}?subject=${subject}&body=${body}`;
}

export default function NewTeamMemberForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    setError(null);
    startTransition(async () => {
      const res = await createTeamMember(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setResult(res);
      }
    });
  }

  if (result) {
    return (
      <div className="space-y-5">
        <div className="border-2 border-turf bg-turf/5 p-6">
          <p className="stamp inline-block font-mono text-sm uppercase text-turf">
            Account Created
          </p>
          <p className="mt-3 text-sm text-ink/80">
            {result.fullName}&rsquo;s account is ready. Send them their login
            below — this temporary password is only shown once, so do this
            now.
          </p>
          <div className="mt-4 space-y-2 font-mono text-sm">
            <p>
              <span className="text-ink/50">Email:</span> {result.email}
            </p>
            <p>
              <span className="text-ink/50">Temp password:</span>{" "}
              <span className="bg-ink/5 px-2 py-0.5">
                {result.tempPassword}
              </span>
            </p>
          </div>
          <a
            href={buildMailto(result)}
            className="mt-5 inline-block bg-clay px-6 py-3 font-mono text-sm font-medium uppercase tracking-wide text-chalk hover:bg-clay/90"
          >
            Open in Mail App
          </a>
        </div>
        <Link
          href="/admin/team"
          className="font-mono text-sm text-ink/60 hover:text-ink"
        >
          ← Back to Team List
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Full name
        </label>
        <input
          name="fullName"
          required
          className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
        />
      </div>
      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-ink/70">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          className="mt-1 w-full border-2 border-ink/20 bg-chalk p-3 text-sm focus:border-clay focus:outline-none"
        />
      </div>

      {error ? <p className="font-mono text-sm text-clay">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="bg-ink px-6 py-3 font-mono text-sm font-medium uppercase tracking-wide text-chalk hover:bg-ink/90 disabled:opacity-60"
      >
        {isPending ? "Creating…" : "Create Account"}
      </button>
    </form>
  );
}
