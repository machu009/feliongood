import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function TeamCalendarPage() {
  const supabase = createClient();
  const { data: settings } = await supabase
    .from("team_settings")
    .select("*")
    .single();

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide">Team Calendar</h1>

      {settings?.google_calendar_embed_url ? (
        <div className="mt-6 border-2 border-ink/15 bg-white p-2">
          <iframe
            src={settings.google_calendar_embed_url}
            style={{ border: 0 }}
            width="100%"
            height="650"
            title="Team Calendar"
          />
        </div>
      ) : (
        <p className="mt-6 font-mono text-sm text-ink/60">
          The calendar hasn&rsquo;t been connected yet. Coach can add it from
          Team Settings in the admin panel.
        </p>
      )}
    </div>
  );
}
