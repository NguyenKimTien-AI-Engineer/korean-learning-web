import { createServerSupabaseClient } from "@/lib/supabase/server";
import { QuestionList } from "@/components/audio/question-list";

// Noi dung doc tu Supabase co the duoc cap nhat sau khi da deploy
// (vd: seed lai sau khi sua cau hoi/audio), nen khong duoc cache tinh.
export const dynamic = "force-dynamic";

export default async function InterviewQuestionsPage() {
  const supabase = createServerSupabaseClient();
  const { data: questions, error } = await supabase
    .from("interview_questions")
    .select("*")
    .order("global_order", { ascending: true });

  if (error) {
    throw new Error(`Khong tai duoc cau hoi: ${error.message}`);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="text-2xl font-bold">Câu hỏi phỏng vấn</h1>
        <p className="mt-1 text-sm text-muted">
          {questions.length} câu hỏi — bấm vào từng câu để nghe phát âm.
        </p>
      </div>
      <QuestionList questions={questions} />
    </main>
  );
}
