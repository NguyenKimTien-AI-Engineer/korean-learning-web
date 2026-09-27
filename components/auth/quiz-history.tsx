"use client";

import { Trophy } from "lucide-react";
import { TOPICS } from "@/lib/topics";
import { useQuizAttempts, useBestScore } from "@/lib/quiz";

function SectionHistory({ section, title }: { section: string; title: string }) {
  const attempts = useQuizAttempts(section);
  const best = useBestScore(section);

  return (
    <div className="rounded-panel bg-surface p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold">{title}</h3>
        {best ? (
          <span className="flex items-center gap-1 text-xs text-muted">
            <Trophy className="h-3.5 w-3.5 text-accent" aria-hidden />
            {best.score}/{best.total}
          </span>
        ) : null}
      </div>

      {attempts.length === 0 ? (
        <p className="text-xs text-muted">Chưa làm quiz chủ đề này.</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {attempts.slice(0, 5).map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between text-xs text-muted"
            >
              <span>
                {new Date(a.created_at).toLocaleDateString("vi-VN")}{" "}
                {new Date(a.created_at).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="font-semibold text-foreground">
                {a.score}/{a.total}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function QuizHistory() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {TOPICS.map((topic) => (
        <SectionHistory
          key={topic.section}
          section={topic.section}
          title={topic.title}
        />
      ))}
    </div>
  );
}
