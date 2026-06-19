import { createClient } from "@/lib/supabase/server";
import ContactForm from "./ContactForm";

export const revalidate = 0;

export default async function ContactPage() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  let profile = null;
  if (data?.user) {
    const { data: p } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();
    profile = p;
  }

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide">
        Contact Coach / Join Baseball
      </h1>
      <p className="mt-2 font-mono text-sm text-ink/60">
        Questions, scheduling conflicts, or know someone who wants to join
        the team? Send a message below.
      </p>
      <div className="mt-8">
        <ContactForm
          defaultName={profile?.full_name}
          defaultEmail={profile?.email || data?.user?.email}
        />
      </div>
    </div>
  );
}
