import PlayerForm from "@/components/PlayerForm";
import { createPlayer } from "../actions";

export default function NewPlayerPage() {
  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide">Add Player</h1>
      <div className="mt-8">
        <PlayerForm action={createPlayer} submitLabel="Add Player" />
      </div>
    </div>
  );
}
