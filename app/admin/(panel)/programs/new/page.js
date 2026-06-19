import ProgramForm from "@/components/ProgramForm";
import { createProgram } from "../actions";

export default function NewProgramPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-4xl tracking-wide">New Program</h1>
      <div className="mt-8">
        <ProgramForm action={createProgram} submitLabel="Create Program" />
      </div>
    </div>
  );
}
