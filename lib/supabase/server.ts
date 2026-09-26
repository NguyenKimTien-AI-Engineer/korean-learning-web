import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";

/**
 * Client dung trong Server Components. MVP khong co dang nhap nen khong
 * can quan ly cookie/session — chi doc du lieu cong khai qua publishable key.
 */
export function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Thieu NEXT_PUBLIC_SUPABASE_URL hoac NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY trong .env.local",
    );
  }

  return createClient<Database>(url, publishableKey, {
    auth: { persistSession: false },
  });
}
