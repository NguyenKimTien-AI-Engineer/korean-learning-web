"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOPICS } from "@/lib/topics";

const NAV_ITEMS = [
  { href: "/", label: "Trang chủ", icon: "🏠" },
  ...TOPICS.map((t) => ({
    href: `/luyen-tap/${t.slug}`,
    label: t.icon,
    icon: t.icon,
  })),
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-surface py-2 sm:hidden">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-4 py-1 text-xs ${
              isActive ? "text-accent" : "text-muted"
            }`}
          >
            <span className="text-lg" aria-hidden>
              {item.icon}
            </span>
            {item.href === "/" ? item.label : null}
          </Link>
        );
      })}
    </nav>
  );
}
