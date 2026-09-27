import { useSyncExternalStore } from "react";
import type { InterviewQuestion } from "@/lib/types";

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

// --- Diem cao nhat, luu localStorage theo tung chu de ---

const KEY_PREFIX = "korean-learning:quiz-best:";
const EVENT_NAME = "korean-learning:quiz-best-changed";

export type BestScore = { score: number; total: number } | null;

function keyFor(section: string) {
  return `${KEY_PREFIX}${section}`;
}

function readBest(section: string): BestScore {
  try {
    const raw = window.localStorage.getItem(keyFor(section));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const cache = new Map<string, BestScore>();

function getSnapshot(section: string): BestScore {
  if (typeof window === "undefined") return null;
  if (!cache.has(section)) {
    cache.set(section, readBest(section));
  }
  return cache.get(section) ?? null;
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT_NAME, callback);
  return () => window.removeEventListener(EVENT_NAME, callback);
}

export function saveBestScoreIfBetter(
  section: string,
  score: number,
  total: number,
) {
  if (typeof window === "undefined" || total === 0) return;
  const current = readBest(section);
  const newPercent = score / total;
  const currentPercent = current ? current.score / current.total : -1;
  if (newPercent <= currentPercent) return;

  const next = { score, total };
  window.localStorage.setItem(keyFor(section), JSON.stringify(next));
  cache.set(section, next);
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function useBestScore(section: string): BestScore {
  return useSyncExternalStore(
    subscribe,
    () => getSnapshot(section),
    () => null,
  );
}
