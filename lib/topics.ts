export type TopicSlug = "hoi-thoai-co-ban" | "ung-xu";

export type Topic = {
  slug: TopicSlug;
  section: "B" | "C";
  title: string;
  description: string;
  icon: string;
  accent: string;
  totalCount: number;
};

export const TOPICS: Topic[] = [
  {
    slug: "hoi-thoai-co-ban",
    section: "B",
    title: "Câu hỏi hội thoại cơ bản",
    description:
      "Bản thân, gia đình, sở thích, thời gian — nền tảng để bắt đầu mọi cuộc phỏng vấn.",
    icon: "💬",
    accent: "from-sky-500/20 to-sky-500/0",
    totalCount: 41,
  },
  {
    slug: "ung-xu",
    section: "C",
    title: "Câu hỏi ứng xử",
    description:
      "Tình huống với đồng nghiệp, cấp trên, sự cố tại nơi làm việc — luyện phản xạ trả lời.",
    icon: "🤝",
    accent: "from-amber-500/20 to-amber-500/0",
    totalCount: 40,
  },
];

export function getTopic(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}
