"use client";

// Theo doi "da nghe" theo TUNG USER, luu tren Supabase (bang
// user_question_progress) thay vi localStorage — dong bo moi thiet bi.
// Cache trong bo nho + pub-sub don gian de nhieu component (luoi cau hoi,
// card chu de o trang chu) cung phan anh dung 1 trang thai, dung
// useSyncExternalStore de doc dong bo, tranh loi "setState trong effect".

import { useEffect, useSyncExternalStore } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";

const EMPTY_SET = new Set<number>();
const cache = new Map<string, Set<number>>();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((cb) => cb());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function cacheKey(userId: string, section: string) {
  return `${userId}:${section}`;
}

async function fetchListened(userId: string, section: string) {
  const supabase = createBrowserSupabaseClient();
  const { data } = await supabase
    .from("user_question_progress")
    .select("global_order")
    .eq("user_id", userId)
    .eq("section", section);
  return new Set((data ?? []).map((row) => row.global_order));
}

export async function markListened(
  userId: string,
  section: string,
  globalOrder: number,
) {
  const key = cacheKey(userId, section);
  const current = cache.get(key) ?? new Set<number>();
  if (current.has(globalOrder)) return;

  const next = new Set(current);
  next.add(globalOrder);
  cache.set(key, next);
  notify();

  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase.from("user_question_progress").upsert(
    { user_id: userId, section, global_order: globalOrder },
    { onConflict: "user_id,section,global_order" },
  );
  if (error) {
    // Rollback neu ghi that bai, tranh hien thi sai trang thai da nghe.
    const rolledBack = new Set(current);
    cache.set(key, rolledBack);
    notify();
  }
}

export function useListenedSet(section: string): Set<number> {
  const { user } = useAuth();
  const key = user ? cacheKey(user.id, section) : null;

  useEffect(() => {
    if (!key || !user || cache.has(key)) return;
    let cancelled = false;
    fetchListened(user.id, section).then((set) => {
      if (cancelled) return;
      cache.set(key, set);
      notify();
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return useSyncExternalStore(
    subscribe,
    () => (key ? (cache.get(key) ?? EMPTY_SET) : EMPTY_SET),
    () => EMPTY_SET,
  );
}
