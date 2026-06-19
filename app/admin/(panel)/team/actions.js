"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

function generateTempPassword() {
  // Easy to read aloud / retype: avoids 0/O, 1/l/I, etc.
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

export async function createTeamMember(formData) {
  const email = formData.get("email")?.toString().trim();
  const fullName = formData.get("fullName")?.toString().trim();

  if (!email || !fullName) {
    return { error: "Name and email are required." };
  }

  const adminClient = createAdminClient();
  const tempPassword = generateTempPassword();

  const { data: created, error: createError } =
    await adminClient.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
    });

  if (createError) {
    return { error: createError.message || "Could not create the account." };
  }

  // The handle_new_user trigger already inserted a profiles row with
  // role='member' — just attach the full name.
  await adminClient
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", created.user.id);

  revalidatePath("/admin/team");

  return {
    success: true,
    email,
    fullName,
    tempPassword,
  };
}

export async function resetTeamMemberPassword(userId) {
  const adminClient = createAdminClient();
  const tempPassword = generateTempPassword();

  const { error } = await adminClient.auth.admin.updateUserById(userId, {
    password: tempPassword,
  });

  if (error) {
    return { error: "Could not reset the password." };
  }

  return { success: true, tempPassword };
}

export async function deleteTeamMember(userId) {
  const supabase = createClient();

  // Don't allow deleting yourself by accident from this screen.
  const { data: current } = await supabase.auth.getUser();
  if (current?.user?.id === userId) {
    return { error: "You can't delete your own account from here." };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.deleteUser(userId);

  if (error) {
    return { error: "Could not delete the account." };
  }

  revalidatePath("/admin/team");
  return { success: true };
}
