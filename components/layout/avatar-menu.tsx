"use client";

import { useState } from "react";
import { UserRound, ExternalLink } from "lucide-react";

export function AvatarMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu người dùng"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-black"
      >
        EPS
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
              <UserRound className="h-3.5 w-3.5" aria-hidden />
              Học viên EPS
            </div>
            <div className="my-1 h-px bg-border" />
            <a
              href="https://github.com/NguyenKimTien-AI-Engineer/korean-learning-web"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-input px-3 py-2 text-sm hover:bg-surface-alt"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              Về dự án này
            </a>
          </div>
        </>
      ) : null}
    </div>
  );
}
