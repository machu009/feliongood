// app/admin/schedule/practices/new/page.js
import PracticeForm from "@/components/PracticeForm";

export default function NewPracticePage() {
  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide mb-8">
        Create Practice
      </h1>
      <PracticeForm />
    </div>
  );
}
