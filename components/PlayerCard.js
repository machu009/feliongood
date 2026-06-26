import Image from "next/image";

export default function PlayerCard({ player, program, onEdit, onRemove }) {
  return (
    <div className="border-2 border-ink/20 bg-chalk p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          {/* Profile Picture Avatar */}
          {player.profile_pic_url ? (
            <Image
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
            <div className="space-y-1 font-mono text-xs uppercase tracking-wide text-ink/60">
              {player.position && <p>{player.position} · CLASS OF {player.grad_year}</p>}
              {!player.position && <p>CLASS OF {player.grad_year}</p>}
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
