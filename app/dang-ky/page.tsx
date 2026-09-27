"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { AuthCard, authInputClass } from "@/components/auth/auth-card";

function translateError(message: string) {
  if (message.includes("already registered")) {
    return "Email này đã được đăng ký.";
  }
  if (message.includes("Password should be at least")) {
    return "Mật khẩu cần ít nhất 6 ký tự.";
  }
  return message;
}

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || email.split("@")[0] },
      },
    });

    setLoading(false);
    if (error) {
      setError(translateError(error.message));
      return;
    }
    const next = new URLSearchParams(window.location.search).get("next") || "/";
    router.push(next);
    router.refresh();
  }

  return (
    <AuthCard title="Tạo tài khoản" subtitle="Miễn phí — chỉ cần email và mật khẩu.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Tên hiển thị (tuỳ chọn)"
          className={authInputClass}
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={authInputClass}
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu (tối thiểu 6 ký tự)"
          className={authInputClass}
        />

        {error ? <p className="text-sm text-negative">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-pill bg-accent px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <UserPlus className="h-4 w-4" aria-hidden />
          {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
        </button>
      </form>

      <p className="text-center text-sm text-muted">
        Đã có tài khoản?{" "}
        <Link href="/dang-nhap" className="font-semibold text-accent">
          Đăng nhập
        </Link>
      </p>
    </AuthCard>
  );
}
