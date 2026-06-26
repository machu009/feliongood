import PlayerForm from "@/components/PlayerForm";
import { createClient } from "@/lib/supabase/server";
import { updatePlayer } from "../../actions";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EditPlayerPage({ params }) {
  const supabase = createClient();
  const { data: player } = await supabase
    .from("players")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!player) notFound();

  const updateThisPlayer = updatePlayer.bind(null, player.id);

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide">Edit Player</h1>
      <div className="mt-8">
        <PlayerForm
          initialValues={player}
          action={updateThisPlayer}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
