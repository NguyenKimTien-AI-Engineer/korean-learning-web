"use client";

import Link from "next/link";
import { Trophy, RotateCcw, ArrowLeft, X } from "lucide-react";
import type { QuizItem } from "@/lib/quiz";

export type QuizAnswer = { item: QuizItem; chosen: string; correct: boolean };

function messageFor(percent: number) {
  if (percent === 100) return "Xuất sắc! Bạn nắm rất chắc phần này.";
  if (percent >= 70) return "Khá tốt! Ôn lại vài câu sai là chắc chắn hơn.";
  if (percent >= 40) return "Cần luyện thêm — nghe lại các câu đã sai nhé.";
  return "Đừng nản, luyện lại vài lần là sẽ nhớ thôi.";
}

export function QuizResult({
  answers,
  topicHref,
  onRetry,
}: {
  answers: QuizAnswer[];
  topicHref: string;
  onRetry: () => void;
}) {
  const score = answers.filter((a) => a.correct).length;
  const total = answers.length;
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  const missed = answers.filter((a) => !a.correct);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-6 py-8 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-alt text-accent">
        <Trophy className="h-8 w-8" aria-hidden />
      </span>

      <div>
        <p className="text-4xl font-bold">
          {score}/{total}
        </p>
        <p className="mt-1 text-sm text-muted">{percent}% đúng</p>
      </div>

      <p className="text-sm text-foreground">{messageFor(percent)}</p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-2 rounded-pill bg-accent px-5 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Làm lại
        </button>
        <Link
          href={topicHref}
          className="flex items-center gap-2 rounded-pill bg-surface-alt px-5 py-2 text-sm font-bold text-foreground transition-colors hover:bg-border"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Về danh sách câu hỏi
        </Link>
      </div>

      {missed.length > 0 ? (
        <div className="w-full text-left">
          <p className="mb-2 text-xs text-muted">
            {missed.length} câu cần ôn lại
          </p>
          <div className="flex flex-col gap-2">
            {missed.map(({ item, chosen }) => (
              <div
                key={item.question.id}
                className="rounded-panel border border-border bg-surface p-3"
              >
                <p className="text-sm font-semibold">
                  {item.question.question_ko}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-negative">
                  <X className="h-3 w-3 shrink-0" aria-hidden />
                  Bạn chọn: {chosen}
                </p>
                <p className="mt-0.5 text-xs text-accent">
                  Đáp án đúng: {item.correctAnswer}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
