import NewTeamMemberForm from "./NewTeamMemberForm";

export default function NewTeamMemberPage() {
  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide">
        Add Team Member
      </h1>
      <p className="mt-1 font-mono text-sm text-ink/60">
        Creates their account and gives you a temporary password to send
        them.
      </p>
      <div className="mt-8">
        <NewTeamMemberForm />
      </div>
    </div>
  );
}
