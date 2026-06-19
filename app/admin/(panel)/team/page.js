import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import TeamMemberActions from "@/components/TeamMemberActions";

export const revalidate = 0;

export default async function TeamMembersPage() {
  const supabase = createClient();
  const { data: members } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-wide">
            Team Members
          </h1>
          <p className="mt-1 font-mono text-sm text-ink/60">
            Accounts with access to the private team section.
          </p>
        </div>
        <Link
          href="/admin/team/new"
          className="bg-ink px-5 py-2.5 font-mono text-sm uppercase tracking-wide text-chalk hover:bg-ink/90"
        >
          + Add Team Member
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {(members || []).map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between border-2 border-ink/15 bg-white p-4"
          >
            <div>
              <div className="flex items-center gap-3">
                <p className="font-display text-xl tracking-wide">
                  {member.full_name || "(no name set)"}
                </p>
                {member.role === "admin" ? (
                  <span className="stamp font-mono text-xs uppercase text-brass">
                    Admin
                  </span>
                ) : null}
              </div>
              <p className="font-mono text-xs text-ink/50">{member.email}</p>
            </div>
            <TeamMemberActions member={member} />
          </div>
        ))}

        {(!members || members.length === 0) && (
          <p className="font-mono text-sm text-ink/60">
            No team members yet.{" "}
            <Link href="/admin/team/new" className="text-clay underline">
              Add the first one
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
