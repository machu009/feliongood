import GameForm from "@/components/GameForm";
import { createClient } from "@/lib/supabase/server";
import { updateGame } from "../../actions";
import { notFound } from "next/navigation";

export default async function EditGamePage({ params }) {
  const supabase = createClient();
  const { data: game } = await supabase
    .from("games")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!game) notFound();

  const updateThisGame = updateGame.bind(null, game.id);

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide">Edit Game</h1>
      <div className="mt-8">
        <GameForm
          initialValues={game}
          action={updateThisGame}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
