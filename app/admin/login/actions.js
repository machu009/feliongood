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
    const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    const envCheck = {
      fullUrl: rawUrl,
      urlLength: rawUrl.length,
      urlHasTrailingSlash: rawUrl.endsWith("/"),
      urlHasWhitespace: rawUrl !== rawUrl.trim(),
      keyPrefix: rawKey.slice(0, 15),
      keySuffix: rawKey.slice(-10),
      keyLength: rawKey.length,
      keyHasWhitespace: rawKey !== rawKey.trim(),
    };
    return {
      error: `DEBUG: ${error.message} (status: ${error.status || "n/a"}, code: ${
        error.code || "n/a"
      }) | env: ${JSON.stringify(envCheck)}`,
    };
  }

  redirect("/admin");
}