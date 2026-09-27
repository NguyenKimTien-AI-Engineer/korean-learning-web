"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Check, X } from "lucide-react";
import type { QuizItem } from "@/lib/quiz";

export function QuizQuestion({
  item,
  index,
  total,
  onNext,
}: {
  item: QuizItem;
  index: number;
  total: number;
  onNext: (chosen: string, correct: boolean) => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);

  // Component remount moi cau (QuizRunner truyen key={currentIndex}) nen
  // chosen/isPlaying da tu ve trang thai ban dau, chi can tu phat audio.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = item.question.audio_url;
    audio.play().catch(() => {});
    setIsPlaying(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  }

  function handleChoose(choice: string) {
    if (chosen) return;
    setChosen(choice);
  }

  const isCorrect = chosen === item.correctAnswer;

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 py-8">
      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-muted">
          <span>
            Câu {index + 1}/{total}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-pill bg-surface-alt">
          <div
            className="h-full rounded-pill bg-accent transition-all"
            style={{ width: `${(index / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 py-6">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Tạm dừng" : "Nghe lại"}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-alt text-accent transition-transform hover:scale-105"
        >
          {isPlaying ? (
            <Pause className="h-8 w-8 fill-current" aria-hidden />
          ) : (
            <Play className="h-8 w-8 fill-current" aria-hidden />
          )}
        </button>
        <p className="text-xs text-muted">Bấm để nghe lại</p>
        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />
      </div>

      <div className="flex flex-col gap-3">
        {item.choices.map((choice) => {
          const isChosen = chosen === choice;
          const showCorrect = chosen && choice === item.correctAnswer;
          const showWrong = chosen && isChosen && choice !== item.correctAnswer;

          return (
            <button
              key={choice}
              type="button"
              onClick={() => handleChoose(choice)}
              disabled={!!chosen}
              className={`flex items-center justify-between gap-3 rounded-panel border px-4 py-3 text-left text-sm transition-colors ${
                showCorrect
                  ? "border-accent bg-accent/10 text-foreground"
                  : showWrong
                    ? "border-negative bg-negative/10 text-foreground"
                    : "border-border bg-surface text-foreground hover:bg-surface-alt"
              }`}
            >
              {choice}
              {showCorrect ? (
                <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden />
              ) : null}
              {showWrong ? (
                <X className="h-4 w-4 shrink-0 text-negative" aria-hidden />
              ) : null}
            </button>
          );
        })}
      </div>

      {chosen ? (
        <div className="flex flex-col gap-3 rounded-panel bg-surface-alt p-4">
          <p className="text-sm">
            <span className="text-muted">Câu hỏi: </span>
            <span className="font-semibold">{item.question.question_ko}</span>
          </p>
          {item.question.pronunciation ? (
            <p className="text-sm italic text-muted">
              {item.question.pronunciation}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => onNext(chosen, isCorrect)}
            className="self-end rounded-pill bg-accent px-5 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90"
          >
            {index + 1 === total ? "Xem kết quả" : "Câu tiếp theo"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
