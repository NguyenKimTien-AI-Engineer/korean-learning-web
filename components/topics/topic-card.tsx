"use client";

import Link from "next/link";
import type { Topic } from "@/lib/topics";
import { useListenedSet } from "@/lib/progress";

export function TopicCard({ topic }: { topic: Topic }) {
  const listenedCount = useListenedSet(topic.section).size;
  const percent = Math.round((listenedCount / topic.totalCount) * 100);

  return (
    <Link
      href={`/luyen-tap/${topic.slug}`}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-panel bg-gradient-to-br ${topic.accent} bg-surface p-6 shadow-card transition-transform hover:-translate-y-1`}
    >
      <div className="flex items-start justify-between">
        <span className="text-4xl">{topic.icon}</span>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-alt text-accent opacity-0 transition-opacity group-hover:opacity-100">
          ▶
        </span>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold">{topic.title}</h3>
        <p className="mt-1 text-sm text-muted">{topic.description}</p>
      </div>

      <div className="mt-6">
        <div className="mb-1 flex items-center justify-between text-xs text-muted">
          <span>
            {listenedCount}/{topic.totalCount} đã nghe
          </span>
          <span>{percent}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-pill bg-surface-alt">
          <div
            className="h-full rounded-pill bg-accent transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
