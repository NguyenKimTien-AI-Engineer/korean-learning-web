"use client";

import { forwardRef } from "react";
import { Play, Pause, CheckCircle2, Languages, Volume2 } from "lucide-react";
import type { InterviewQuestion } from "@/lib/types";
import { useAudio } from "./audio-provider";

function PlayButton({
  isActive,
  isPlaying,
  onClick,
}: {
  isActive: boolean;
  isPlaying: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Phát âm"
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-alt transition-colors ${
        isActive ? "text-accent" : "text-foreground"
      }`}
    >
      {isActive && isPlaying ? (
        <Pause className="h-4 w-4 fill-current" aria-hidden />
      ) : (
        <Play className="h-4 w-4 fill-current" aria-hidden />
      )}
    </button>
  );
}

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

  function handlePlayClick(e: React.MouseEvent) {
    e.stopPropagation();
    toggle(question);
  }

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
              <span
                className="flex items-center gap-1 text-xs text-accent"
                title="Đã nghe"
              >
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                đã nghe
              </span>
            ) : null}
          </div>

          <p className="text-base font-bold leading-snug">
            {question.question_ko}
          </p>

          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted">Bấm để xem nghĩa</span>
            <PlayButton
              isActive={isActive}
              isPlaying={isPlaying}
              onClick={handlePlayClick}
            />
          </div>
        </div>

        {/* Back */}
        <div
          className={`col-start-1 row-start-1 flex min-h-52 flex-col justify-between gap-3 rounded-panel border border-border p-4 shadow-card [backface-visibility:hidden] [transform:rotateY(180deg)] ${
            isActive ? "bg-surface-alt" : "bg-surface"
          }`}
        >
          <div>
            <span className="flex items-center gap-1 text-xs text-muted">
              <Languages className="h-3.5 w-3.5" aria-hidden />
              Nghĩa tiếng Việt
            </span>
            <p className="mt-1 text-sm font-semibold leading-snug">
              {question.question_vi ?? "Đang cập nhật"}
            </p>
          </div>

          <div>
            <span className="flex items-center gap-1 text-xs text-muted">
              <Volume2 className="h-3.5 w-3.5" aria-hidden />
              Phiên âm
            </span>
            <p className="mt-1 text-sm italic leading-snug text-muted">
              {question.pronunciation ?? "—"}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted">Bấm để quay lại</span>
            <PlayButton
              isActive={isActive}
              isPlaying={isPlaying}
              onClick={handlePlayClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
