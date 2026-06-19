import { createClient } from "@/lib/supabase/server";
import CalendarUrlForm from "./CalendarUrlForm";
import RulebookUploadForm from "./RulebookUploadForm";

export const revalidate = 0;

export default async function TeamSettingsPage() {
  const supabase = createClient();
  const { data: settings } = await supabase
    .from("team_settings")
    .select("*")
    .single();

  return (
    <div className="max-w-xl space-y-12">
      <div>
        <h1 className="font-display text-4xl tracking-wide">
          Team Settings
        </h1>
        <p className="mt-1 font-mono text-sm text-ink/60">
          Controls the calendar and rule book shown in the private team
          section.
        </p>
      </div>

      <CalendarUrlForm
        initialValue={settings?.google_calendar_embed_url}
      />

      <div className="stitch-divider" />

      <RulebookUploadForm currentFilename={settings?.rulebook_filename} />
    </div>
  );
}
