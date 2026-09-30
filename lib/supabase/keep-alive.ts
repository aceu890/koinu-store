import { createClient } from "@supabase/supabase-js";
import { supabasePublicUrl } from "@/lib/supabase/config";

export async function pingSupabaseDatabase() {
  const url = supabasePublicUrl();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from("products").select("id").limit(1);
  if (error) throw new Error(error.message);
}
