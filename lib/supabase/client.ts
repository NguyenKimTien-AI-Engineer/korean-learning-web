"use client";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/**
 * Client dung trong Client Components. Chua can cho MVP (audio player
 * chi phat url duoc truyen tu server), du phong cho tinh nang sau nay
 * (yeu thich, tien do hoc...).
 */
export const supabaseBrowserClient = createClient<Database>(
  url,
  publishableKey,
);
