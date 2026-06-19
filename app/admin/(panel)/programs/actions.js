"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function uniqueSlug(supabase, base, excludeId = null) {
  let slug = base || "program";
  let attempt = 0;

  while (true) {
    let query = supabase.from("programs").select("id").eq("slug", slug);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();

    if (!data) return slug;
    attempt += 1;
    slug = `${base}-${attempt + 1}`;
  }
}

function readProgramFields(formData) {
  return {
    name: formData.get("name")?.toString().trim() || "",
    type: formData.get("type")?.toString().trim() || "camp",
    description: formData.get("description")?.toString().trim() || "",
    location: formData.get("location")?.toString().trim() || "",
    start_date: formData.get("start_date")?.toString() || null,
    end_date: formData.get("end_date")?.toString() || null,
    signup_deadline: formData.get("signup_deadline")?.toString() || null,
    capacity: formData.get("capacity")
      ? parseInt(formData.get("capacity"), 10)
      : null,
    is_active: formData.get("is_active") === "on",
  };
}

export async function createProgram(formData) {
  const supabase = createClient();
  const fields = readProgramFields(formData);

  if (!fields.name) {
    return { error: "Program name is required." };
  }

  const slug = await uniqueSlug(supabase, slugify(fields.name));

  const { error } = await supabase.from("programs").insert({
    ...fields,
    slug,
  });

  if (error) {
    return { error: "Could not create the program. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/programs");
  revalidatePath("/");
  redirect("/admin");
}

export async function updateProgram(programId, formData) {
  const supabase = createClient();
  const fields = readProgramFields(formData);

  if (!fields.name) {
    return { error: "Program name is required." };
  }

  const { error } = await supabase
    .from("programs")
    .update(fields)
    .eq("id", programId);

  if (error) {
    return { error: "Could not save changes. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/programs");
  revalidatePath("/");
  redirect("/admin");
}

export async function deleteProgram(programId) {
  const supabase = createClient();
  await supabase.from("programs").delete().eq("id", programId);

  revalidatePath("/admin");
  revalidatePath("/programs");
  revalidatePath("/");
}
