// Nap 81 cau hoi + audio mp3 tuong ung vao Supabase (table interview_questions,
// bucket storage "audio"). Chay: npm run seed -- /duong/dan/toi/thu/muc/mp3
//
// Can bien moi truong (trong .env.local):
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SECRET_KEY   (secret key, KHONG phai publishable key — bo qua RLS)

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { romanize } from "./lib/hangul-romanize.mjs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SECRET_KEY) {
  console.error(
    "Thieu NEXT_PUBLIC_SUPABASE_URL hoac SUPABASE_SECRET_KEY. Kiem tra .env.local.",
  );
  process.exit(1);
}

const audioDir =
  process.argv[2] ??
  path.join(
    process.env.HOME ?? "",
    "Downloads",
    "ElevenLabs_Untitled_project",
  );

if (!existsSync(audioDir)) {
  console.error(`Khong tim thay thu muc audio: ${audioDir}`);
  console.error(
    "Truyen duong dan thu muc chua file mp3 lam tham so, vi du:",
  );
  console.error("  npm run seed -- /home/user/Downloads/ElevenLabs_Untitled_project");
  process.exit(1);
}

const contentPath = path.join(
  import.meta.dirname,
  "..",
  "content",
  "interview-questions.json",
);

const questions = JSON.parse(await readFile(contentPath, "utf-8"));

const supabase = createClient(SUPABASE_URL, SECRET_KEY, {
  auth: { persistSession: false },
});

console.log(`Nap ${questions.length} cau hoi tu ${contentPath}`);
console.log(`Doc file mp3 tu ${audioDir}`);

let ok = 0;
let failed = 0;

for (const q of questions) {
  const mp3FileName = `${q.global_order}_Chapter_1.mp3`;
  const localPath = path.join(audioDir, mp3FileName);
  const storagePath = `interview/${q.global_order}.mp3`;

  try {
    const fileBuffer = await readFile(localPath);

    const { error: uploadError } = await supabase.storage
      .from("audio")
      .upload(storagePath, fileBuffer, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("audio").getPublicUrl(storagePath);

    const { error: dbError } = await supabase
      .from("interview_questions")
      .upsert(
        {
          global_order: q.global_order,
          section: q.section,
          section_position: q.section_position,
          question_ko: q.question_ko,
          question_vi: q.question_vi ?? null,
          pronunciation: romanize(q.question_ko),
          audio_path: storagePath,
          audio_url: publicUrl,
        },
        { onConflict: "global_order" },
      );

    if (dbError) throw dbError;

    ok += 1;
    console.log(`[${q.global_order}/81] OK - ${q.question_ko.slice(0, 30)}...`);
  } catch (err) {
    failed += 1;
    console.error(`[${q.global_order}/81] LOI - ${localPath}:`, err.message ?? err);
  }
}

console.log(`\nHoan tat: ${ok} thanh cong, ${failed} loi.`);
process.exit(failed > 0 ? 1 : 0);
