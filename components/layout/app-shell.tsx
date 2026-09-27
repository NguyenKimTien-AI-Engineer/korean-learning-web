"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";

const AUTH_PATH_PREFIXES = [
  "/dang-nhap",
  "/dang-ky",
  "/quen-mat-khau",
  "/dat-lai-mat-khau",
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="flex-1 pb-[calc(4rem+env(safe-area-inset-bottom))] sm:pb-0">
            {children}
          </main>
        </div>
      </div>
      <MobileNav />
    </>
  );
}
