"use client";

import { useState, useTransition } from "react";
import {
  resetTeamMemberPassword,
  deleteTeamMember,
} from "@/app/admin/(panel)/team/actions";

function buildMailto({ email, fullName, tempPassword }) {
  const subject = encodeURIComponent(
    "Your Felion Good Baseball team login (updated)"
  );
  const body = encodeURIComponent(
    `Hi ${fullName},\n\n` +
      `Here's a new temporary password for the team site:\n` +
      `https://feliongood.com/team/login\n\n` +
      `Email: ${email}\n` +
      `Temporary password: ${tempPassword}\n\n` +
      `Once you're in, you can change your password from the Account page.\n\n` +
      `Coach Felion`
  );
  return `mailto:${email}?subject=${subject}&body=${body}`;
}

export default function TeamMemberActions({ member }) {
  const [isPending, startTransition] = useTransition();
  const [resetResult, setResetResult] = useState(null);
  const [error, setError] = useState(null);

  function handleReset() {
    if (
      !confirm(
        `Generate a new temporary password for ${member.full_name || member.email}?`
      )
    ) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await resetTeamMemberPassword(member.id);
      if (res?.error) setError(res.error);
      else setResetResult(res);
    });
  }

  function handleDelete() {
    if (
      !confirm(
        `Remove ${member.full_name || member.email}? This deletes their account entirely.`
      )
    ) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await deleteTeamMember(member.id);
      if (res?.error) setError(res.error);
    });
  }

  if (resetResult?.success) {
    return (
      <div className="border-2 border-turf bg-turf/5 p-3 font-mono text-xs">
        <p>
          New password: <span className="bg-ink/5 px-1.5">{resetResult.tempPassword}</span>
        </p>
        <a
          href={buildMailto({
            email: member.email,
            fullName: member.full_name || member.email,
            tempPassword: resetResult.tempPassword,
          })}
          className="mt-2 inline-block text-clay underline"
        >
          Open in Mail App
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {error ? <span className="font-mono text-xs text-clay">{error}</span> : null}
      <button
        onClick={handleReset}
        disabled={isPending}
        className="font-mono text-xs uppercase tracking-wide text-ink/70 hover:text-ink disabled:opacity-50"
      >
        Reset Password
      </button>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="font-mono text-xs uppercase tracking-wide text-clay hover:underline disabled:opacity-50"
      >
        Remove
      </button>
    </div>
  );
}
