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
    <div className="flex gap-3 border-2 border-ink bg-chalk p-4 sm:gap-5 sm:p-5">
      <div className="w-10 shrink-0 text-center font-display text-3xl leading-none text-clay sm:w-14 sm:text-5xl">
        {String(number).padStart(2, "0")}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-baseline">
          <h3 className="font-display text-xl leading-none tracking-wide sm:text-2xl">
            {program.name}
          </h3>
          <span className="leader-line hidden sm:inline-flex" />
          <span className="mt-1 shrink-0 font-mono text-xs text-ink/70 sm:mt-0 sm:text-sm">
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

        <div className="mt-4 flex items-center gap-3 sm:gap-4">
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
