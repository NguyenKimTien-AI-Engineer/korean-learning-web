"use client";

import { useMemo, useRef, useState } from "react";
import type { InterviewQuestion } from "@/lib/types";
import { AudioProvider, useAudio } from "@/components/audio/audio-provider";
import { QuestionCard } from "@/components/audio/question-card";
import { NowPlayingBar } from "@/components/audio/now-playing-bar";
import { useListenedSet } from "@/lib/progress";

function ShuffleButton({
  questions,
  listened,
  onPick,
}: {
  questions: InterviewQuestion[];
  listened: Set<number>;
  onPick: (q: InterviewQuestion) => void;
}) {
  const { toggle } = useAudio();

  function handleShuffle() {
    if (questions.length === 0) return;
    const unlistened = questions.filter(
      (q) => !listened.has(q.global_order),
    );
    const pool = unlistened.length > 0 ? unlistened : questions;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    onPick(pick);
    toggle(pick);
  }

  return (
    <button
      type="button"
      onClick={handleShuffle}
      className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-pill bg-surface-alt px-3 py-2 text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:bg-border sm:px-4 sm:text-sm"
    >
      🔀 Ngẫu nhiên
    </button>
  );
}

function GridBody({
  questions,
  section,
}: {
  questions: InterviewQuestion[];
  section: string;
}) {
  const [search, setSearch] = useState("");
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const listened = useListenedSet(section);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return questions;
    return questions.filter(
      (item) =>
        item.question_ko.toLowerCase().includes(q) ||
        (item.question_vi ?? "").toLowerCase().includes(q),
    );
  }, [questions, search]);

  function toggleFlip(globalOrder: number) {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(globalOrder)) next.delete(globalOrder);
      else next.add(globalOrder);
      return next;
    });
  }

  function handleShufflePick(question: InterviewQuestion) {
    setFlipped((prev) => new Set(prev).add(question.global_order));
    cardRefs.current
      .get(question.global_order)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm câu hỏi (tiếng Hàn hoặc tiếng Việt)..."
          className="w-full rounded-pill bg-surface-alt px-4 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none sm:max-w-xs"
        />
        <div className="flex items-center justify-between gap-3">
          <span className="shrink-0 whitespace-nowrap text-xs text-muted">
            {listened.size}/{questions.length} đã nghe
          </span>
          <ShuffleButton
            questions={filtered}
            listened={listened}
            onPick={handleShufflePick}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            isFlipped={flipped.has(question.global_order)}
            isListened={listened.has(question.global_order)}
            onToggleFlip={() => toggleFlip(question.global_order)}
            ref={(el) => {
              if (el) cardRefs.current.set(question.global_order, el);
              else cardRefs.current.delete(question.global_order);
            }}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted">Không tìm thấy câu hỏi phù hợp.</p>
      ) : null}

      <NowPlayingBar />
    </>
  );
}

export function TopicQuestionGrid({
  questions,
  section,
}: {
  questions: InterviewQuestion[];
  section: string;
}) {
  return (
    <AudioProvider section={section}>
      <GridBody questions={questions} section={section} />
    </AudioProvider>
  );
}
