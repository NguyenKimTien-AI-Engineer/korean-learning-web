"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { AuthCard, authInputClass } from "@/components/auth/auth-card";

function translateError(message: string) {
  if (message.includes("Invalid login credentials")) {
    return "Email hoặc mật khẩu không đúng.";
  }
  return message;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (error) {
      setError(translateError(error.message));
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <AuthCard title="Đăng nhập" subtitle="Lưu tiến độ học của bạn trên mọi thiết bị.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
          className={authInputClass}
        />

        {error ? <p className="text-sm text-negative">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-pill bg-accent px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <LogIn className="h-4 w-4" aria-hidden />
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <div className="flex flex-col gap-1 text-center text-sm text-muted">
        <Link href="/quen-mat-khau" className="hover:text-foreground">
          Quên mật khẩu?
        </Link>
        <span>
          Chưa có tài khoản?{" "}
          <Link href="/dang-ky" className="font-semibold text-accent">
            Đăng ký
          </Link>
        </span>
      </div>
    </AuthCard>
  );
}
