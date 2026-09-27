import type { ReactNode } from "react";

export const authInputClass =
  "w-full rounded-input bg-surface-alt px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none";

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
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-12">
      <div className="rounded-panel bg-surface p-6 shadow-card">
        <h1 className="text-xl font-bold">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
        <div className="mt-6 flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}
