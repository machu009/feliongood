import GameForm from "@/components/GameForm";
import { createGame } from "../actions";

export default function NewGamePage() {
  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide">Add Game</h1>
      <div className="mt-8">
        <GameForm action={createGame} submitLabel="Add Game" />
      </div>
    </div>
  );
}
