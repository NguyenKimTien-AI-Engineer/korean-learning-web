"use client";

import { usePathname } from "next/navigation";
import { TOPICS } from "@/lib/topics";
import { ThemeToggle } from "./theme-toggle";
import { AvatarMenu } from "./avatar-menu";

function useTitle(pathname: string) {
  if (pathname === "/") return "Trang chủ";
  const topic = TOPICS.find((t) => pathname.endsWith(t.slug));
  return topic?.title ?? "Học tiếng Hàn";
}

export function Topbar() {
  const pathname = usePathname();
  const title = useTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-background/95 px-6 py-3 backdrop-blur">
      <h2 className="text-sm font-bold text-muted sm:text-base sm:text-foreground">
        {title}
      </h2>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <AvatarMenu />
      </div>
    </header>
  );
}
