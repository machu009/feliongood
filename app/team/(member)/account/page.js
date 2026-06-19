import { createClient } from "@/lib/supabase/server";
import ChangePasswordForm from "./ChangePasswordForm";
import UpdateNameForm from "./UpdateNameForm";

export const revalidate = 0;

export default async function AccountPage() {
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
    <div className="space-y-12">
      <div>
        <h1 className="font-display text-4xl tracking-wide">Account</h1>
        <p className="mt-1 font-mono text-sm text-ink/60">
          {data?.user?.email}
        </p>
      </div>

      <UpdateNameForm initialName={profile?.full_name} />

      <div className="stitch-divider" />

      <div>
        <h2 className="font-display text-2xl tracking-wide">
          Change Password
        </h2>
        <p className="mt-1 font-mono text-xs text-ink/50">
          If Coach sent you a temporary password, set your own here.
        </p>
        <div className="mt-4">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
