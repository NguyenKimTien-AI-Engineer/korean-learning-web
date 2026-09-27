import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AccountSettings } from "@/components/auth/account-settings";
import { QuizHistory } from "@/components/auth/quiz-history";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/dang-nhap");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold">Tài khoản</h1>
      <AccountSettings
        userId={user.id}
        email={user.email ?? ""}
        profile={profile}
      />
      <div className="mt-10">
        <h2 className="mb-3 text-lg font-bold">Lịch sử làm Quiz</h2>
        <QuizHistory />
      </div>
    </div>
  );
}
