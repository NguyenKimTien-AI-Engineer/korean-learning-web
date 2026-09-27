"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { TOPICS } from "@/lib/topics";

const NAV_ITEMS = [
  { href: "/", label: "Trang chủ", icon: Home },
  ...TOPICS.map((t) => ({
    href: `/luyen-tap/${t.slug}`,
    label: t.title,
    icon: t.icon,
  })),
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] sm:hidden">
      <div className="flex h-16 items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 text-xs ${
                isActive ? "text-accent" : "text-muted"
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden />
              {item.href === "/" ? item.label : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
