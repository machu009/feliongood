"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function teamLogin(formData) {
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
    return { error: "Incorrect email or password." };
  }

  redirect("/team");
}
