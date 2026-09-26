import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-6 py-16">
      <header className="flex items-center gap-2">
        <span className="text-lg font-bold tracking-tight">Học tiếng Hàn</span>
      </header>

      <section className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold leading-tight text-foreground-bright sm:text-4xl">
          Luyện tiếng Hàn cho kỳ thi và phỏng vấn EPS
        </h1>
        <p className="max-w-xl text-base text-muted">
          Nghe và luyện tập từng câu hỏi thật, có phát âm chuẩn kèm theo — bắt
          đầu với bộ câu hỏi phỏng vấn.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/luyen-tap/phong-van"
          className="group flex flex-col gap-3 rounded-card bg-surface p-5 shadow-card transition-colors hover:bg-surface-alt"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-alt text-accent">
            ▶
          </span>
          <div>
            <h2 className="text-lg font-semibold">Câu hỏi phỏng vấn</h2>
            <p className="mt-1 text-sm text-muted">
              81 câu hỏi tiếng Hàn thường gặp khi phỏng vấn EPS, kèm audio
              phát âm.
            </p>
          </div>
        </Link>
      </section>
    </main>
  );
}
