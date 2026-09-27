"use client";

import Link from "next/link";
import { ListChecks, Trophy, LogIn } from "lucide-react";
import type { BestScore } from "@/lib/quiz";

const LENGTH_OPTIONS = [5, 10, 20];

export function QuizSetup({
  totalQuestions,
  bestScore,
  isLoggedIn,
  onStart,
}: {
  totalQuestions: number;
  bestScore: BestScore;
  isLoggedIn: boolean;
  onStart: (count: number) => void;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 py-12 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-alt text-accent">
        <ListChecks className="h-8 w-8" aria-hidden />
      </span>

      <div>
        <h2 className="text-xl font-bold">Nghe & chọn nghĩa</h2>
        <p className="mt-2 text-sm text-muted">
          Nghe audio câu hỏi (không xem chữ Hàn) rồi chọn đúng nghĩa tiếng
          Việt trong 4 đáp án — luyện đúng phản xạ như khi phỏng vấn thật.
        </p>
      </div>

      {bestScore ? (
        <div className="flex items-center gap-2 rounded-pill bg-surface-alt px-4 py-2 text-sm text-muted">
          <Trophy className="h-4 w-4 text-accent" aria-hidden />
          Điểm cao nhất: {bestScore.score}/{bestScore.total}
        </div>
      ) : null}

      {!isLoggedIn ? (
        <Link
          href="/dang-nhap"
          className="flex items-center gap-2 rounded-pill bg-surface-alt px-4 py-2 text-sm text-muted hover:text-foreground"
        >
          <LogIn className="h-4 w-4" aria-hidden />
          Đăng nhập để lưu điểm và lịch sử làm bài
        </Link>
      ) : null}

      <div className="flex flex-col gap-3">
        <p className="text-xs text-muted">Chọn số câu hỏi</p>
        <div className="flex flex-wrap justify-center gap-2">
          {LENGTH_OPTIONS.filter((n) => n <= totalQuestions).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onStart(n)}
              className="rounded-pill bg-surface-alt px-5 py-2 text-sm font-bold text-foreground transition-colors hover:bg-border"
            >
              {n} câu
            </button>
          ))}
          <button
            type="button"
            onClick={() => onStart(totalQuestions)}
            className="rounded-pill bg-accent px-5 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90"
          >
            Tất cả ({totalQuestions})
          </button>
        </div>
      </div>
    </div>
  );
}
