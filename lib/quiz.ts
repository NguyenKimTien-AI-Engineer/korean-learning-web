"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { InterviewQuestion, QuizAttempt } from "@/lib/types";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";

export type QuizItem = {
  question: InterviewQuestion;
  choices: string[];
  correctAnswer: string;
};

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Tao bo cau hoi trac nghiem "nghe & chon nghia": moi cau lay 1 dap an
 * dung (question_vi that) + 3 dap an nhieu (lay ngau nhien tu cac cau
 * khac cung chu de), tron thu tu dap an va thu tu cau hoi.
 */
export function buildQuiz(
  questions: InterviewQuestion[],
  count: number,
): QuizItem[] {
  const withMeaning = questions.filter((q) => q.question_vi);
  const picked = shuffle(withMeaning).slice(0, count);

  return picked.map((question) => {
    const distractorPool = withMeaning.filter(
      (q) => q.id !== question.id && q.question_vi !== question.question_vi,
    );
    const distractors = shuffle(distractorPool)
      .slice(0, 3)
      .map((q) => q.question_vi!);
    const choices = shuffle([question.question_vi!, ...distractors]);
    return { question, choices, correctAnswer: question.question_vi! };
  });
}

// --- Lich su lam quiz theo tung user, luu Supabase (bang quiz_attempts) ---
// Diem cao nhat la gia tri suy ra tu danh sach lich su, khong luu rieng.

export type BestScore = { score: number; total: number } | null;

const EMPTY_ATTEMPTS: QuizAttempt[] = [];
const cache = new Map<string, QuizAttempt[]>();
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

async function fetchAttempts(userId: string, section: string) {
  const supabase = createBrowserSupabaseClient();
  const { data } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("user_id", userId)
    .eq("section", section)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function saveQuizAttempt(
  userId: string,
  section: string,
  score: number,
  total: number,
) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("quiz_attempts")
    .insert({ user_id: userId, section, score, total })
    .select()
    .single();

  if (error || !data) return;

  const key = cacheKey(userId, section);
  const current = cache.get(key) ?? [];
  cache.set(key, [data, ...current]);
  notify();
}

export function useQuizAttempts(section: string): QuizAttempt[] {
  const { user } = useAuth();
  const key = user ? cacheKey(user.id, section) : null;

  useEffect(() => {
    if (!key || !user || cache.has(key)) return;
    let cancelled = false;
    fetchAttempts(user.id, section).then((rows) => {
      if (cancelled) return;
      cache.set(key, rows);
      notify();
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return useSyncExternalStore(
    subscribe,
    () => (key ? (cache.get(key) ?? EMPTY_ATTEMPTS) : EMPTY_ATTEMPTS),
    () => EMPTY_ATTEMPTS,
  );
}

export function useBestScore(section: string): BestScore {
  const attempts = useQuizAttempts(section);
  if (attempts.length === 0) return null;
  return attempts.reduce<BestScore>((best, a) => {
    if (!best || a.score / a.total > best.score / best.total) {
      return { score: a.score, total: a.total };
    }
    return best;
  }, null);
}
