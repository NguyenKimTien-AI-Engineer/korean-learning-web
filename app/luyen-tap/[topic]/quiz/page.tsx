import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getTopic } from "@/lib/topics";
import { QuizRunner } from "@/components/quiz/quiz-runner";

export const dynamic = "force-dynamic";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: topicSlug } = await params;
  const topic = getTopic(topicSlug);
  if (!topic) notFound();

  const supabase = await createServerSupabaseClient();
  const { data: questions, error } = await supabase
    .from("interview_questions")
    .select("*")
    .eq("section", topic.section)
    .order("section_position", { ascending: true });

  if (error) {
    throw new Error(`Khong tai duoc cau hoi: ${error.message}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-2">
        <h1 className="text-2xl font-bold">Quiz — {topic.title}</h1>
      </div>
      <QuizRunner
        questions={questions}
        section={topic.section}
        topicHref={`/luyen-tap/${topic.slug}`}
      />
    </div>
  );
}
