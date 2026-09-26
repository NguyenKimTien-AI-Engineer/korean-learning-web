"use client";

import { useRef, useState } from "react";
import type { InterviewQuestion } from "@/lib/types";

export function QuestionList({
  questions,
}: {
  questions: InterviewQuestion[];
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentOrder, setCurrentOrder] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const current = questions.find((q) => q.global_order === currentOrder);

  function togglePlay(question: InterviewQuestion) {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentOrder === question.global_order) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
      return;
    }

    audio.src = question.audio_url;
    audio.play();
    setCurrentOrder(question.global_order);
    setIsPlaying(true);
  }

  return (
    <div className="flex flex-col gap-1 pb-24">
      {questions.map((question) => {
        const isActive = question.global_order === currentOrder;
        return (
          <button
            key={question.id}
            type="button"
            onClick={() => togglePlay(question)}
            className={`flex items-center gap-4 rounded-card px-4 py-3 text-left transition-colors hover:bg-surface-alt ${
              isActive ? "bg-surface-alt" : "bg-surface"
            }`}
          >
            <span className="w-6 shrink-0 text-sm text-muted">
              {question.global_order}
            </span>
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-alt text-sm ${
                isActive ? "text-accent" : "text-foreground"
              }`}
            >
              {isActive && isPlaying ? "❚❚" : "▶"}
            </span>
            <span className="flex-1 text-base">{question.question_ko}</span>
          </button>
        );
      })}

      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />

      {current ? (
        <div className="fixed inset-x-0 bottom-0 flex items-center gap-4 border-t border-border bg-surface px-6 py-3 shadow-dialog">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-alt text-sm ${
              isPlaying ? "text-accent" : "text-foreground"
            }`}
            onClick={() => togglePlay(current)}
            role="button"
          >
            {isPlaying ? "❚❚" : "▶"}
          </span>
          <span className="truncate text-sm text-foreground">
            {current.question_ko}
          </span>
        </div>
      ) : null}
    </div>
  );
}
