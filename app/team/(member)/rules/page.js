import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function TeamRulesPage() {
  const supabase = createClient();
  const { data: settings } = await supabase
    .from("team_settings")
    .select("*")
    .single();

  let signedUrl = null;
  if (settings?.rulebook_path) {
    const { data } = await supabase.storage
      .from("team-docs")
      .createSignedUrl(settings.rulebook_path, 3600);
    signedUrl = data?.signedUrl || null;
  }

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide">Team Rule Book</h1>

      {signedUrl ? (
        <div className="mt-6">
          <a
            href={signedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-clay px-6 py-3 font-mono text-sm font-medium uppercase tracking-wide text-chalk hover:bg-clay/90"
          >
            Open {settings.rulebook_filename || "Rule Book"}
          </a>
          <p className="mt-3 font-mono text-xs text-ink/50">
            Link expires after an hour — just revisit this page for a fresh
            one.
          </p>
        </div>
      ) : (
        <p className="mt-6 font-mono text-sm text-ink/60">
          The rule book hasn&rsquo;t been uploaded yet.
        </p>
      )}
    </div>
  );
}
