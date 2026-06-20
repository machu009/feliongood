import Link from "next/link";
import NewThreadForm from "./NewThreadForm";

export default function NewThreadPage() {
  return (
    <div>
      <Link
        href="/team/locker-room"
        className="font-mono text-xs uppercase tracking-wide text-ink/50 hover:text-ink"
      >
        ← Back to Locker Room
      </Link>
      <h1 className="mt-3 font-display text-4xl tracking-wide">New Topic</h1>
      <div className="mt-8">
        <NewThreadForm />
      </div>
    </div>
  );
}
