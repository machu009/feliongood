"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadProfilePic(playerId, fileBuffer, fileName) {
  const supabase = createClient();

  try {
    if (!fileBuffer || !fileName) {
      return { error: "No file provided" };
    }

    // Generate unique file name
    const timestamp = Date.now();
    const uniqueFileName = `${playerId}_${timestamp}_${fileName}`;
    const filePath = `${playerId}/${uniqueFileName}`;

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from("profilepic")
      .upload(filePath, fileBuffer, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { error: "Failed to upload image" };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("profilepic")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData?.publicUrl;

    if (!publicUrl) {
      return { error: "Failed to get public URL" };
    }

    return { success: true, url: publicUrl };
  } catch (err) {
    console.error("Error in uploadProfilePic:", err);
    return { error: err.message };
  }
}
