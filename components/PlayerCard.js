export default function PlayerCard({ player, program, onEdit, onRemove }) {
  return (
    <div className="border-2 border-ink/20 bg-chalk p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-baseline gap-3">
            <span className="font-display text-2xl text-clay">{player.jersey_number}</span>
            <h3 className="font-display text-xl">{player.full_name}</h3>
          </div>
          <div className="space-y-1 font-mono text-xs uppercase tracking-wide text-ink/60">
            {player.position && <p>{player.position} · CLASS OF {player.grad_year}</p>}
            {!player.position && <p>CLASS OF {player.grad_year}</p>}
            {program && (
              <p className="text-clay font-medium">{program.name}</p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
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
