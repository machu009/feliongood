"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData) {
  const supabase = createClient();

  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // TEMPORARY DEBUG: show the real Supabase error instead of a generic
    // message. Revert this once login works.
    const envCheck = {
      hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      urlPreview: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? process.env.NEXT_PUBLIC_SUPABASE_URL.slice(0, 25) + "..."
        : "MISSING",
      hasKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
    };
    return {
      error: `DEBUG: ${error.message} (status: ${error.status || "n/a"}, code: ${
        error.code || "n/a"
      }) | env: ${JSON.stringify(envCheck)}`,
    };
  }

  redirect("/admin");
}