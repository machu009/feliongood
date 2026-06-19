import Link from "next/link";

function formatDate(d) {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function ProgramCard({ program, number }) {
  const deadlinePassed =
    program.signup_deadline &&
    new Date(program.signup_deadline + "T23:59:59") < new Date();

  const dateLabel = program.start_date
    ? program.end_date && program.end_date !== program.start_date
      ? `${formatDate(program.start_date)}–${formatDate(program.end_date)}`
      : formatDate(program.start_date)
    : "Ongoing";

  return (
    <div className="flex gap-5 border-2 border-ink bg-chalk p-5">
      <div className="w-14 shrink-0 text-center font-display text-5xl leading-none text-clay">
        {String(number).padStart(2, "0")}
      </div>
      <div className="flex-1">
        <div className="flex items-baseline">
          <h3 className="font-display text-2xl leading-none tracking-wide">
            {program.name}
          </h3>
          <span className="leader-line" />
          <span className="shrink-0 font-mono text-sm text-ink/70">
            {dateLabel}
          </span>
        </div>

        {program.location ? (
          <p className="mt-1 font-mono text-xs uppercase tracking-wide text-ink/60">
            {program.location}
          </p>
        ) : null}

        {program.description ? (
          <p className="mt-3 text-sm text-ink/80">{program.description}</p>
        ) : null}

        <div className="mt-4 flex items-center gap-4">
          <span
            className={`stamp font-mono text-xs uppercase ${
              deadlinePassed ? "text-ink/40" : "text-turf"
            }`}
          >
            {deadlinePassed ? "Closed" : "Open"}
          </span>
          <Link
            href={`/programs/${program.slug}`}
            className="font-mono text-sm font-medium text-clay underline-offset-4 hover:underline"
          >
            View &amp; sign up →
          </Link>
        </div>
      </div>
    </div>
  );
}
