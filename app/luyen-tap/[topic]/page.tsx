import Link from "next/link";
import { notFound } from "next/navigation";
import { ListChecks } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getTopic } from "@/lib/topics";
import { TopicQuestionGrid } from "@/components/topics/topic-question-grid";

export const dynamic = "force-dynamic";

export default async function TopicPage({
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
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{topic.title}</h1>
          <p className="mt-1 text-sm text-muted">{topic.description}</p>
        </div>
        <Link
          href={`/luyen-tap/${topic.slug}/quiz`}
          className="flex shrink-0 items-center gap-2 rounded-pill bg-accent px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90"
        >
          <ListChecks className="h-4 w-4" aria-hidden />
          Bắt đầu Quiz
        </Link>
      </div>
      <TopicQuestionGrid questions={questions} section={topic.section} />
    </div>
  );
}
