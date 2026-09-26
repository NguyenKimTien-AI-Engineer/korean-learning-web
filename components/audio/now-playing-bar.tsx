"use client";

import { useAudio } from "./audio-provider";

export function NowPlayingBar() {
  const { current, isPlaying, toggle } = useAudio();

  if (!current) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t border-border bg-surface px-6 py-3 shadow-dialog sm:left-64">
      <button
        type="button"
        onClick={() => toggle(current)}
        aria-label={isPlaying ? "Tạm dừng" : "Phát"}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-alt text-sm ${
          isPlaying ? "text-accent" : "text-foreground"
        }`}
      >
        {isPlaying ? "❚❚" : "▶"}
      </button>
      <span className="truncate text-sm">
        <span className="text-muted">#{current.global_order}</span>{" "}
        {current.question_ko}
      </span>
    </div>
  );
}
