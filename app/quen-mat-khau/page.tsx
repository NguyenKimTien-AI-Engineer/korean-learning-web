"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { AuthCard, authInputClass } from "@/components/auth/auth-card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dat-lai-mat-khau`,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <AuthCard title="Đã gửi email">
        <p className="text-sm text-muted">
          Kiểm tra hộp thư <span className="font-semibold text-foreground">{email}</span> và
          bấm vào đường dẫn để đặt lại mật khẩu.
        </p>
        <Link href="/dang-nhap" className="text-sm font-semibold text-accent">
          Về trang đăng nhập
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Quên mật khẩu"
      subtitle="Nhập email đã đăng ký, chúng tôi sẽ gửi đường dẫn đặt lại mật khẩu."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={authInputClass}
        />

        {error ? <p className="text-sm text-negative">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-pill bg-accent px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <Mail className="h-4 w-4" aria-hidden />
          {loading ? "Đang gửi..." : "Gửi đường dẫn"}
        </button>
      </form>

      <Link href="/dang-nhap" className="text-center text-sm text-muted hover:text-foreground">
        Quay lại đăng nhập
      </Link>
    </AuthCard>
  );
}
