"use client";

import { Play, Pause } from "lucide-react";
import { useAudio } from "./audio-provider";

export function NowPlayingBar() {
  const { current, isPlaying, toggle } = useAudio();

  if (!current) return null;

  return (
    <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-50 flex items-center gap-4 border-t border-border bg-surface px-4 py-3 shadow-dialog sm:inset-x-auto sm:right-0 sm:bottom-0 sm:left-64 sm:px-6">
      <button
        type="button"
        onClick={() => toggle(current)}
        aria-label={isPlaying ? "Tạm dừng" : "Phát"}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-alt ${
          isPlaying ? "text-accent" : "text-foreground"
        }`}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 fill-current" aria-hidden />
        ) : (
          <Play className="h-4 w-4 fill-current" aria-hidden />
        )}
      </button>
      <span className="truncate text-sm">
        <span className="text-muted">#{current.global_order}</span>{" "}
        {current.question_ko}
      </span>
    </div>
  );
}
