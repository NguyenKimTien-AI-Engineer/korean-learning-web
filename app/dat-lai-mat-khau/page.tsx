"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { AuthCard, authInputClass } from "@/components/auth/auth-card";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 1500);
  }

  if (done) {
    return (
      <AuthCard title="Đã đổi mật khẩu">
        <p className="text-sm text-muted">Đang chuyển về trang chủ...</p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Đặt lại mật khẩu" subtitle="Nhập mật khẩu mới cho tài khoản của bạn.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu mới"
          className={authInputClass}
        />
        <input
          type="password"
          required
          minLength={6}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Nhập lại mật khẩu mới"
          className={authInputClass}
        />

        {error ? <p className="text-sm text-negative">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-pill bg-accent px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <KeyRound className="h-4 w-4" aria-hidden />
          {loading ? "Đang lưu..." : "Đổi mật khẩu"}
        </button>
      </form>
    </AuthCard>
  );
}
