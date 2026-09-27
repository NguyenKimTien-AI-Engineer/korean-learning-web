"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Camera, Save, KeyRound, LogOut, UserRound } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { authInputClass } from "@/components/auth/auth-card";
import type { Profile } from "@/lib/types";

export function AccountSettings({
  userId,
  email,
  profile,
}: {
  userId: string;
  email: string;
  profile: Profile | null;
}) {
  const router = useRouter();
  const { refreshProfile, signOut } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? null);
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [uploading, setUploading] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [nameMessage, setNameMessage] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const supabase = createBrowserSupabaseClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${userId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);
    const bustedUrl = `${publicUrl}?t=${Date.now()}`;

    await supabase
      .from("profiles")
      .update({ avatar_url: bustedUrl })
      .eq("id", userId);

    setAvatarUrl(bustedUrl);
    await refreshProfile();
    setUploading(false);
  }

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setSavingName(true);
    setNameMessage(null);
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("id", userId);
    setSavingName(false);
    setNameMessage(error ? "Có lỗi xảy ra, thử lại nhé." : "Đã lưu.");
    if (!error) await refreshProfile();
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordError(null);
    setPasswordMessage(null);
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    setSavingPassword(false);
    if (error) {
      setPasswordError(error.message);
      return;
    }
    setNewPassword("");
    setPasswordMessage("Đã đổi mật khẩu.");
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-panel bg-surface p-5 shadow-card">
        <h2 className="mb-4 text-sm font-bold text-muted">Hồ sơ</h2>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-alt text-accent"
            aria-label="Đổi ảnh đại diện"
          >
            {avatarUrl ? (
              <Image src={avatarUrl} alt="" width={64} height={64} className="h-full w-full object-cover" />
            ) : (
              <UserRound className="h-7 w-7" aria-hidden />
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
              <Camera className="h-5 w-5 text-white" aria-hidden />
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <div className="text-sm">
            <p className="text-muted">{email}</p>
            {uploading ? <p className="text-xs text-muted">Đang tải ảnh lên...</p> : null}
          </div>
        </div>

        <form onSubmit={handleSaveName} className="mt-4 flex gap-2">
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Tên hiển thị"
            className={authInputClass}
          />
          <button
            type="submit"
            disabled={savingName}
            className="flex shrink-0 items-center gap-2 rounded-pill bg-accent px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <Save className="h-4 w-4" aria-hidden />
            Lưu
          </button>
        </form>
        {nameMessage ? <p className="mt-2 text-xs text-muted">{nameMessage}</p> : null}
      </section>

      <section className="rounded-panel bg-surface p-5 shadow-card">
        <h2 className="mb-4 text-sm font-bold text-muted">Đổi mật khẩu</h2>
        <form onSubmit={handleChangePassword} className="flex flex-col gap-3">
          <input
            type="password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
            className={authInputClass}
          />
          {passwordError ? <p className="text-sm text-negative">{passwordError}</p> : null}
          {passwordMessage ? <p className="text-sm text-accent">{passwordMessage}</p> : null}
          <button
            type="submit"
            disabled={savingPassword}
            className="flex w-fit items-center gap-2 rounded-pill bg-surface-alt px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-border disabled:opacity-60"
          >
            <KeyRound className="h-4 w-4" aria-hidden />
            {savingPassword ? "Đang lưu..." : "Đổi mật khẩu"}
          </button>
        </form>
      </section>

      <button
        type="button"
        onClick={handleSignOut}
        className="flex w-fit items-center gap-2 rounded-pill bg-surface-alt px-4 py-2 text-sm font-bold text-negative transition-colors hover:bg-border"
      >
        <LogOut className="h-4 w-4" aria-hidden />
        Đăng xuất
      </button>
    </div>
  );
}
