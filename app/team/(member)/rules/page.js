import { createClient } from "@/lib/supabase/server";
import PdfViewer from "./PdfViewer";

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
        <>
          <PdfViewer 
            url={signedUrl} 
            filename={settings.rulebook_filename || "Rule Book"} 
          />
          <p className="mt-4 font-mono text-xs text-ink/50">
            Viewer link expires after an hour — just refresh the page for a fresh one.
          </p>
        </>
      ) : (
        <p className="mt-6 font-mono text-sm text-ink/60">
          The rule book hasn&rsquo;t been uploaded yet.
        </p>
      )}
    </div>
  );
}
