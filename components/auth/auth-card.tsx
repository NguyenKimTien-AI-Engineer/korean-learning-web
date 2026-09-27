import type { ReactNode } from "react";
import Link from "next/link";
import { GraduationCap, Volume2, ListChecks, TrendingUp } from "lucide-react";

export const authInputClass =
  "w-full rounded-input border border-border bg-surface-alt px-3 py-2.5 text-sm text-foreground placeholder:text-muted transition-colors focus:border-accent focus:outline-none";

const FEATURES = [
  {
    icon: Volume2,
    text: "Nghe phát âm chuẩn cho từng câu hỏi phỏng vấn thật",
  },
  {
    icon: ListChecks,
    text: "Luyện tập với quiz đo lường trình độ theo từng chủ đề",
  },
  {
    icon: TrendingUp,
    text: "Theo dõi tiến độ nghe và lịch sử làm bài của riêng bạn",
  },
];

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-surface p-12 lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, var(--color-accent) 0%, transparent 40%), radial-gradient(circle at 85% 75%, var(--color-accent) 0%, transparent 35%)",
          }}
          aria-hidden
        />

        <Link href="/" className="relative z-10 flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-panel bg-accent text-black">
            <GraduationCap className="h-6 w-6" aria-hidden />
          </span>
          <div>
            <p className="text-lg font-bold leading-tight">Học tiếng Hàn</p>
            <p className="text-xs text-muted">Luyện thi EPS</p>
          </div>
        </Link>

        <div className="relative z-10 flex flex-col gap-8">
          <h2 className="max-w-md text-3xl font-bold leading-tight">
            Tự tin bước vào buổi phỏng vấn EPS của bạn
          </h2>
          <ul className="flex flex-col gap-5">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-muted">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-alt text-accent">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-muted">
          Học tiếng Hàn EPS — luyện nghe, luyện nói, tự tin đi phỏng vấn.
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
          <span className="flex h-9 w-9 items-center justify-center rounded-panel bg-accent text-black">
            <GraduationCap className="h-5 w-5" aria-hidden />
          </span>
          <p className="text-base font-bold">Học tiếng Hàn EPS</p>
        </Link>

        <div className="w-full max-w-sm rounded-panel bg-surface p-8 shadow-card">
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle ? <p className="mt-1.5 text-sm text-muted">{subtitle}</p> : null}
          <div className="mt-6 flex flex-col gap-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
