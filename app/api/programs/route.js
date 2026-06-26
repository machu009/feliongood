import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: programs, error } = await supabase
      .from("programs")
      .select("id, name, slug, type")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json({ programs });
  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
