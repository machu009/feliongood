"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadProfilePic(playerId, base64String, fileName) {
  const supabase = createClient();

  try {
    console.log("uploadProfilePic called with:", { playerId, fileName, base64Length: base64String?.length });

    if (!base64String || !fileName) {
      console.log("Missing base64String or fileName");
      return { error: "No file provided" };
    }

    // Convert base64 to buffer
    const base64Data = base64String.split(",")[1] || base64String;
    console.log("Base64 data length:", base64Data.length);
    
    const buffer = Buffer.from(base64Data, "base64");
    console.log("Buffer created, size:", buffer.length);

    // Generate unique file name
    const timestamp = Date.now();
    const uniqueFileName = `${playerId}_${timestamp}_${fileName}`;
    const filePath = `${playerId}/${uniqueFileName}`;
    console.log("Upload path:", filePath);

    // Upload to Supabase Storage
    console.log("Starting upload to profilepic bucket...");
    const { data, error: uploadError } = await supabase.storage
      .from("profilepic")
      .upload(filePath, buffer, {
        cacheControl: "3600",
        upsert: false,
      });

    console.log("Upload response:", { data, uploadError });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { error: `Upload failed: ${uploadError.message}` };
    }

    // Get public URL
    console.log("Getting public URL...");
    const { data: publicUrlData } = supabase.storage
      .from("profilepic")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData?.publicUrl;
    console.log("Public URL:", publicUrl);

    if (!publicUrl) {
      console.error("No public URL returned");
      return { error: "Failed to get public URL" };
    }

    console.log("Upload successful!");
    return { success: true, url: publicUrl };
  } catch (err) {
    console.error("Error in uploadProfilePic:", err);
    return { error: `Server error: ${err.message}` };
  }
}
