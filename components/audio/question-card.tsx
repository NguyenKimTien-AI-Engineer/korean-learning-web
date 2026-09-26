"use client";

import { forwardRef } from "react";
import type { InterviewQuestion } from "@/lib/types";
import { useAudio } from "./audio-provider";

export const QuestionCard = forwardRef<
  HTMLDivElement,
  {
    question: InterviewQuestion;
    isFlipped: boolean;
    isListened: boolean;
    onToggleFlip: () => void;
  }
>(function QuestionCard({ question, isFlipped, isListened, onToggleFlip }, ref) {
  const { current, isPlaying, toggle } = useAudio();
  const isActive = current?.global_order === question.global_order;

  return (
    <div ref={ref} className="[perspective:1200px]">
      <div
        className={`relative h-56 w-full cursor-pointer transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
        onClick={onToggleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onToggleFlip();
        }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 flex flex-col justify-between rounded-panel p-4 shadow-card [backface-visibility:hidden] ${
            isActive ? "bg-surface-alt" : "bg-surface"
          }`}
        >
          <div className="flex items-start justify-between">
            <span className="text-xs text-muted">#{question.global_order}</span>
            {isListened ? (
              <span className="text-xs text-accent" title="Đã nghe">
                ✓ đã nghe
              </span>
            ) : null}
          </div>

          <p className="line-clamp-4 text-base font-bold leading-snug">
            {question.question_ko}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">Bấm để xem nghĩa</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggle(question);
              }}
              aria-label="Phát âm"
              className={`flex h-10 w-10 items-center justify-center rounded-full bg-surface-alt text-base transition-colors ${
                isActive ? "text-accent" : "text-foreground"
              }`}
            >
              {isActive && isPlaying ? "❚❚" : "▶"}
            </button>
          </div>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 flex flex-col justify-between rounded-panel border border-border p-4 shadow-card [backface-visibility:hidden] [transform:rotateY(180deg)] ${
            isActive ? "bg-surface-alt" : "bg-surface"
          }`}
        >
          <div>
            <span className="text-xs text-muted">Nghĩa tiếng Việt</span>
            <p className="mt-1 text-sm font-semibold leading-snug">
              {question.question_vi ?? "Đang cập nhật"}
            </p>
          </div>

          <div>
            <span className="text-xs text-muted">Phiên âm</span>
            <p className="mt-1 text-sm italic leading-snug text-muted">
              {question.pronunciation ?? "—"}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">Bấm để quay lại</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggle(question);
              }}
              aria-label="Phát âm"
              className={`flex h-10 w-10 items-center justify-center rounded-full bg-surface-alt text-base transition-colors ${
                isActive ? "text-accent" : "text-foreground"
              }`}
            >
              {isActive && isPlaying ? "❚❚" : "▶"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
