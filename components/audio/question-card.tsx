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
      {/*
        Ca 2 mat dung chung 1 grid cell ("[grid-area:1/1]") thay vi
        "absolute inset-0" — nho vay khung card tu gian theo mat NAO
        cao hon (thay vi chieu cao co dinh), tranh tran chu khi cau
        dai hoac man hinh hep khien chu xuong dong nhieu hon.
      */}
      <div
        className={`relative grid w-full min-h-52 cursor-pointer transition-transform duration-500 [transform-style:preserve-3d] ${
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
          className={`col-start-1 row-start-1 flex min-h-52 flex-col justify-between gap-3 rounded-panel p-4 shadow-card [backface-visibility:hidden] ${
            isActive ? "bg-surface-alt" : "bg-surface"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs text-muted">#{question.global_order}</span>
            {isListened ? (
              <span className="text-xs text-accent" title="Đã nghe">
                ✓ đã nghe
              </span>
            ) : null}
          </div>

          <p className="text-base font-bold leading-snug">
            {question.question_ko}
          </p>

          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted">Bấm để xem nghĩa</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggle(question);
              }}
              aria-label="Phát âm"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-alt text-base transition-colors ${
                isActive ? "text-accent" : "text-foreground"
              }`}
            >
              {isActive && isPlaying ? "❚❚" : "▶"}
            </button>
          </div>
        </div>

        {/* Back */}
        <div
          className={`col-start-1 row-start-1 flex min-h-52 flex-col justify-between gap-3 rounded-panel border border-border p-4 shadow-card [backface-visibility:hidden] [transform:rotateY(180deg)] ${
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

          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted">Bấm để quay lại</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggle(question);
              }}
              aria-label="Phát âm"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-alt text-base transition-colors ${
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
