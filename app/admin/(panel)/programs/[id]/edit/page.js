import ProgramForm from "@/components/ProgramForm";
import { createClient } from "@/lib/supabase/server";
import { updateProgram } from "../../actions";
import { notFound } from "next/navigation";

export default async function EditProgramPage({ params }) {
  const supabase = createClient();
  const { data: program } = await supabase
    .from("programs")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!program) notFound();

  const updateThisProgram = updateProgram.bind(null, program.id);

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-4xl tracking-wide">Edit Program</h1>
      <div className="mt-8">
        <ProgramForm
          initialValues={program}
          action={updateThisProgram}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
