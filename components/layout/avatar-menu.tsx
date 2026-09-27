"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserRound, LogIn, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";

function initialsFor(name: string | null, email: string | null | undefined) {
  const source = name || email || "?";
  return source.trim().charAt(0).toUpperCase();
}

export function AvatarMenu() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading) {
    return <div className="h-9 w-9 rounded-full bg-surface-alt" />;
  }

  if (!user) {
    return (
      <Link
        href="/dang-nhap"
        className="flex items-center gap-2 rounded-pill bg-accent px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90"
      >
        <LogIn className="h-4 w-4" aria-hidden />
        Đăng nhập
      </Link>
    );
  }

  async function handleSignOut() {
    setOpen(false);
    await signOut();
    router.push("/");
    router.refresh();
  }

  const displayName = profile?.display_name || user.email || "Học viên";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu người dùng"
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-accent text-sm font-bold text-black"
      >
        {profile?.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt=""
            width={36}
            height={36}
            className="h-full w-full object-cover"
          />
        ) : (
          initialsFor(profile?.display_name ?? null, user.email)
        )}
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Đóng menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div className="absolute right-0 z-20 mt-2 w-56 rounded-panel bg-surface p-1 shadow-dialog">
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted">
              <UserRound className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">{displayName}</span>
            </div>
            <div className="my-1 h-px bg-border" />
            <Link
              href="/tai-khoan"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-input px-3 py-2 text-sm hover:bg-surface-alt"
            >
              <Settings className="h-3.5 w-3.5" aria-hidden />
              Tài khoản
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-input px-3 py-2 text-left text-sm text-negative hover:bg-surface-alt"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden />
              Đăng xuất
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
