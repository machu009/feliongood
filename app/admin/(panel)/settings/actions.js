"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSettings(formData) {
  const supabase = createClient();

  const fields = {
    bio: formData.get("bio")?.toString().trim() || "",
    coach_name: formData.get("coach_name")?.toString().trim() || "",
    coach_bio: formData.get("coach_bio")?.toString().trim() || "",
    donation_venmo: formData.get("donation_venmo")?.toString().trim() || "",
    donation_paypal: formData.get("donation_paypal")?.toString().trim() || "",
    contact_email: formData.get("contact_email")?.toString().trim() || "",
    contact_phone: formData.get("contact_phone")?.toString().trim() || "",
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("site_settings")
    .update(fields)
    .eq("id", 1);

  if (error) {
    return { error: "Could not save settings. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/donate");
  revalidatePath("/admin/settings");
  return { success: true };
}
