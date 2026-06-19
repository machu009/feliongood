import { createClient } from "@supabase/supabase-js";

// Uses the SECRET service-role key — this file must only ever be
// imported from server-side code (server actions, route handlers).
// Never expose SUPABASE_SECRET_KEY to the browser (no NEXT_PUBLIC_ prefix).
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
