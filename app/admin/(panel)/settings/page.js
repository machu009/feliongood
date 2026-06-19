import { createClient } from "@/lib/supabase/server";
import SettingsForm from "./SettingsForm";

export const revalidate = 0;

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .single();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-4xl tracking-wide">Site Settings</h1>
      <p className="mt-1 font-mono text-sm text-ink/60">
        Controls the homepage bio, donation links, and contact info shown on
        the public site.
      </p>
      <div className="mt-8">
        <SettingsForm initialValues={settings || {}} />
      </div>
    </div>
  );
}
