"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types";

/**
 * Client dung trong Client Components. Goi ham nay moi lan can dung
 * (thu vien tu quan ly singleton ben trong), khong tao bien module-level
 * de tranh giu session cu qua HMR.
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
