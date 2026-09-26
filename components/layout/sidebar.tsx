"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOPICS } from "@/lib/topics";

const NAV_ITEMS = [
  { href: "/", label: "Trang chủ", icon: "🏠" },
  ...TOPICS.map((t) => ({
    href: `/luyen-tap/${t.slug}`,
    label: t.title,
    icon: t.icon,
  })),
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-1 border-r border-border bg-background px-3 py-6 sm:flex">
      <div className="mb-6 px-3">
        <span className="text-lg font-bold tracking-tight">
          Học tiếng Hàn
        </span>
        <p className="mt-0.5 text-xs text-muted">Luyện thi EPS</p>
      </div>

      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-input px-3 py-2 text-sm transition-colors ${
              isActive
                ? "bg-surface-alt font-bold text-foreground"
                : "text-muted hover:bg-surface hover:text-foreground"
            }`}
          >
            <span aria-hidden>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}
