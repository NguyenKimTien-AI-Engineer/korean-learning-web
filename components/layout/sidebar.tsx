"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Home } from "lucide-react";
import { TOPICS } from "@/lib/topics";

const NAV_ITEMS = [
  { href: "/", label: "Trang chủ", icon: Home },
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
      <div className="mb-6 flex items-center gap-2 px-3">
        <GraduationCap className="h-6 w-6 text-accent" aria-hidden />
        <div>
          <span className="text-lg font-bold tracking-tight">
            Học tiếng Hàn
          </span>
          <p className="mt-0.5 text-xs text-muted">Luyện thi EPS</p>
        </div>
      </div>

      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
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
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}
