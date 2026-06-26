export default function PlayerCard({ player, program, onEdit, onRemove }) {
  // Parse honors string into array
  const honors = player.honors
    ? player.honors.split(",").map((h) => h.trim()).filter(Boolean)
    : [];

  return (
    <div className="border-2 border-ink/20 bg-chalk p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          {/* Profile Picture Avatar */}
          {player.profile_pic_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={player.profile_pic_url}
              alt={player.full_name}
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 object-cover border-2 border-ink/20"
            />
          ) : (
            <div className="h-14 w-14 shrink-0 bg-ink/10 border-2 border-ink/20 flex items-center justify-center">
              <span className="font-mono text-xs text-ink/50">
                {player.full_name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Player Info */}
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-baseline gap-3">
              <span className="font-display text-2xl text-clay">
                {player.jersey_number}
              </span>
              <h3 className="font-display text-xl">{player.full_name}</h3>
            </div>

            {/* Honors Badges */}
            {honors.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {honors.map((honor, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-clay/20 text-clay px-2.5 py-1 rounded-full font-mono text-xs font-medium uppercase tracking-wide"
                  >
                    {honor}
                  </span>
                ))}
              </div>
            )}

            {/* Player Details */}
            <div className="space-y-1 font-mono text-xs uppercase tracking-wide text-ink/60">
              {player.position && (
                <p>
                  {player.position} · {player.height}
                  {player.weight && ` · ${player.weight} lbs`}
                </p>
              )}
              {!player.position && (
                <p>
                  {player.height}
                  {player.weight && ` · ${player.weight} lbs`}
                </p>
              )}
              <p>CLASS OF {player.grad_year}</p>
              {program && (
                <p className="text-clay font-medium">{program.name}</p>
              )}
            </div>
          </div>
        </div>

        {/* Edit/Remove Buttons */}
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => onEdit(player.id)}
            className="font-mono text-sm text-ink hover:text-clay"
          >
            EDIT
          </button>
          <button
            onClick={() => onRemove(player.id)}
            className="font-mono text-sm text-clay hover:text-clay/70"
          >
            REMOVE
          </button>
        </div>
      </div>
    </div>
  );
}
