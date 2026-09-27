import { TOPICS } from "@/lib/topics";
import { TopicCard } from "@/components/topics/topic-card";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <section className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-foreground-bright sm:text-4xl">
          Luyện tiếng Hàn cho kỳ thi và phỏng vấn EPS
        </h1>
        <p className="mt-2 max-w-xl text-base text-muted">
          Chọn một chủ đề bên dưới để bắt đầu nghe và luyện tập từng câu hỏi
          thật, có phát âm chuẩn, nghĩa tiếng Việt và phiên âm đi kèm.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {TOPICS.map(({ icon: Icon, ...topic }) => (
          <TopicCard key={topic.slug} topic={topic} icon={<Icon className="h-6 w-6" aria-hidden />} />
        ))}
      </section>
    </div>
  );
}
