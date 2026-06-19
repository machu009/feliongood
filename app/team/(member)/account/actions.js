"use server";

import { createClient } from "@/lib/supabase/server";

export async function changePassword(formData) {
  const supabase = createClient();

  const newPassword = formData.get("new_password")?.toString();
  const confirmPassword = formData.get("confirm_password")?.toString();

  if (!newPassword || newPassword.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "Passwords don't match." };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: "Could not update your password. Please try again." };
  }

  return { success: true };
}

export async function updateFullName(formData) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data?.user) return { error: "Not signed in." };

  const fullName = formData.get("full_name")?.toString().trim();
  if (!fullName) return { error: "Name can't be empty." };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", data.user.id);

  if (error) {
    return { error: "Could not update your name." };
  }

  return { success: true };
}
