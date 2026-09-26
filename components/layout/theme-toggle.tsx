"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Tranh hydration mismatch: server luon render "chua mounted", client
  // sau khi hydrate moi biet theme that tu localStorage.
  const isClient = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  if (!isClient) {
    return <div className="h-9 w-9 rounded-full bg-surface-alt" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-alt text-foreground transition-colors hover:bg-border"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
