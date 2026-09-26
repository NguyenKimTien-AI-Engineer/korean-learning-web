# Kế hoạch phát triển — Website học tiếng Hàn (EPS)

> Trạng thái: **DRAFT — chưa triển khai gì**, chỉ mới lên kế hoạch. Mọi hành động tạo repo/Supabase project/deploy đều cần bạn xác nhận từng bước trước khi thực hiện.

## 0. Bối cảnh & dữ liệu đã có

- Mục tiêu dài hạn: một website dạy tiếng Hàn (cho lao động đi EPS Hàn Quốc), thiết kế theo phong cách Spotify (dark theme, pill button, xanh lá làm điểm nhấn) mô tả trong `DESIGN-spotify.md`.
- Tính năng đang làm trước: **module "Câu hỏi phỏng vấn"** — danh sách câu hỏi tiếng Hàn kèm audio phát âm (mp3).
- Đã kiểm tra thực tế:
  - `~/Downloads/ElevenLabs_Untitled_project/` có đúng **81 file mp3**, đặt tên `{n}_Chapter_1.mp3` với n = 1..81, tổng dung lượng **6.6 MB** (rất nhỏ, không lo giới hạn dung lượng free tier).
  - 81 file này khớp số lượng với file `cau-hoi-phong-van-eps-BC.md` đã làm sạch trước đó: **Phần B = 41 câu, Phần C = 40 câu → 41 + 40 = 81**. Giả định: file mp3 số `n` (1–41) = câu B thứ n; file mp3 số `n` (42–81) = câu C thứ (n-41). Đây là giả định hợp lý theo đúng thứ tự bạn đã dán vào ElevenLabs, **nhưng nên nghe thử vài file để đối chiếu lại trước khi seed dữ liệu chính thức** (ví dụ nghe file 1, 41, 42, 81).
  - Tài khoản GitHub `NguyenKimTien-AI-Engineer` đã đăng nhập sẵn trên máy qua `gh` CLI (song song với tài khoản `it-sismo`) → có thể tạo repo trực tiếp bằng `gh repo create` khi bạn đồng ý.
  - Supabase hiện chỉ có 1 tổ chức (`letienhunggh@gmail.com's Org`) và tổ chức này đang ở **gói Pro**, đã có 2 project (`SISMO - KHACH HANG`, `SOVA`). Nếu tạo project mới trong tổ chức Pro này, project sẽ **không miễn phí** — Supabase tính thêm phí compute (~10 USD/tháng) cho mỗi project ngoài phần đã bao gồm.
  - **Khuyến nghị**: tạo một **tổ chức Supabase mới, gói Free** riêng cho dự án cá nhân này (tách biệt khỏi dữ liệu công ty SISMO/SOVA) → project sẽ thật sự $0/tháng theo đúng ý "supabase free" bạn yêu cầu. Việc này cần bạn tạo tổ chức mới trên dashboard supabase.com (hoặc dùng tài khoản Supabase khác), vì MCP hiện tại chỉ thấy 1 org Pro sẵn có.
- **[ĐÃ TẠO]** Project Supabase thật đã được tạo (qua trình duyệt, org **SOVA — Free**, khác với org Pro "letienhunggh@gmail.com's Org"):
  - Project name: `korean-learning-web`
  - Project ref: `alcljmtapbznuavzmctz`
  - URL: `https://alcljmtapbznuavzmctz.supabase.co`
  - Region: Southeast Asia (Singapore) — `ap-southeast-1`, compute Nano (free)
  - Bảo mật lúc tạo: tắt "Automatically expose new tables", bật "Enable automatic RLS" — khớp thiết kế RLS ở mục 4.
  - Mật khẩu DB: đã copy vào clipboard lúc tạo, Claude không đọc/lưu lại giá trị này (chặn bởi chính sách bảo mật) — bạn tự lưu vào nơi an toàn.
  - Lưu ý: project này **không hiện trong danh sách qua Supabase MCP tool** (MCP đang xác thực dưới tài khoản Supabase khác, chỉ thấy org Pro). Mọi thao tác schema/SQL cho project này sẽ thực hiện qua SQL Editor trên trình duyệt (browser automation), không qua MCP `apply_migration`.

## 1. Phạm vi MVP

Chỉ tập trung đúng tính năng đang cần, đơn giản hết mức: **một trang duy nhất (1 tab) hiển thị toàn bộ 81 câu hỏi phỏng vấn theo đúng thứ tự gốc, mỗi câu có một nút play để nghe file mp3 tương ứng.**

- **Không chia theo chuyên mục A/B/C/D** ở MVP — không cần trang con, không cần điều hướng phụ. Một danh sách phẳng 81 dòng, xếp theo đúng `global_order` (1 → 81).
- Nhấn play ở dòng nào thì phát audio dòng đó; đang phát dòng nào thì dòng đó có trạng thái "đang phát" (icon đổi màu xanh); phát xong tự dừng, không tự next (tự next có thể thêm sau nếu bạn thích).
- Không cần đăng nhập/tài khoản người học — nội dung công khai, ai vào cũng xem/nghe được.
- Không cần trang quản trị (CMS) — quản lý nội dung trực tiếp qua Supabase Studio + script seed, vì khối lượng nội dung còn nhỏ (81 câu). Xây CMS riêng lúc này là over-engineering.
- Vẫn giữ cột `section` (B/C) trong dữ liệu làm metadata dự phòng (không hiển thị chia tab ở MVP) để sau này dễ bật tính năng lọc/nhóm mà không phải đổi schema.

## 2. Kiến trúc tổng thể

```
Người dùng → Vercel (Next.js, Server Components)
                  │
                  ├── đọc dữ liệu câu hỏi ─────► Supabase Postgres (RLS: public read-only)
                  └── phát audio ──────────────► Supabase Storage (bucket public "audio")

Quản trị nội dung (bạn) → script seed (Node/TS) → Supabase (service role key, chạy local, không lên client)
```

Không có backend server riêng (không Express/Nest). Next.js App Router đọc thẳng Supabase qua Server Components — đủ dùng cho nội dung tĩnh, giảm một tầng phức tạp không cần thiết. Chỉ khi thêm tính năng cần ghi dữ liệu theo người dùng (yêu thích, tiến độ học, làm bài) mới cần thêm Supabase Auth + Route Handlers.

## 3. Tech stack

| Thành phần | Lựa chọn | Lý do |
|---|---|---|
| Framework | Next.js 15 (App Router) + TypeScript | Đồng bộ với các dự án web khác bạn đang có (2S Group, Zensip) |
| Styling | Tailwind CSS v4 | Đồng bộ stack hiện có, dễ implement design token từ `DESIGN-spotify.md` |
| Database | Supabase Postgres | Miễn phí, có sẵn kinh nghiệm dùng trong SISMO/SOVA |
| File audio | Supabase Storage (bucket public) | Cùng project với DB, không cần dịch vụ thứ 3 |
| Hosting | Vercel (Hobby/free) | Deploy Next.js tốt nhất, tích hợp GitHub tự động |
| Repo | GitHub — `NguyenKimTien-AI-Engineer/korean-learning-web` (public) | Đã đăng nhập sẵn trên máy, đã chốt tên + public |
| Font | `Be Vietnam Pro` (Google Fonts, self-host qua `next/font`) cho toàn bộ chữ Latin | Thay thế SpotifyMixUI (font độc quyền, không dùng lại được), tối ưu dấu tiếng Việt, hình dáng geometric gần giống Circular. Chữ Hàn (Hangul) tự fallback theo font hệ thống trình duyệt — đúng cách Spotify cũng làm. |
| Supabase org | Tổ chức **Free mới**, tách khỏi org Pro hiện có (SISMO/SOVA) | Đảm bảo $0/tháng đúng nghĩa, không trộn dữ liệu công ty với dự án cá nhân |

## 4. Thiết kế dữ liệu (Supabase Postgres)

Đơn giản hoá theo quyết định "1 tab, danh sách phẳng": **1 bảng duy nhất**, không cần bảng chuyên mục.

```sql
create table interview_questions (
  id uuid primary key default gen_random_uuid(),
  global_order int unique not null,    -- thứ tự hiển thị & khớp số file mp3 gốc (1..81)
  section text not null,               -- 'B' | 'C' — metadata dự phòng, KHÔNG dùng để chia tab ở MVP
  section_position int not null,       -- thứ tự trong section gốc (1..41 cho B, 1..40 cho C) — để truy vết nguồn
  question_ko text not null,           -- câu hỏi tiếng Hàn (bản đã làm sạch, không còn tiếng Việt/ngoặc)
  audio_path text not null,            -- đường dẫn object trong Storage: interview/{global_order}.mp3
  audio_url text not null,             -- public URL suy ra từ audio_path, cache lại cho tiện truy vấn
  duration_seconds numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_interview_questions_order on interview_questions (global_order);

alter table interview_questions enable row level security;

create policy "public read questions" on interview_questions
  for select using (true);
-- Không có policy insert/update/delete cho anon/authenticated → chỉ service role (seed script) mới ghi được.
```

> Nếu sau này muốn thêm chuyên mục A/D hoặc chia tab, chỉ cần thêm cột `is_published boolean` và filter theo `section` — không phải đổi cấu trúc bảng.

**Storage**: bucket `audio` (public), cấu trúc `interview/{global_order}.mp3`. Public URL dạng:
`https://<project-ref>.supabase.co/storage/v1/object/public/audio/interview/1.mp3`

## 5. Nội dung nguồn & script seed

- Giữ file cấu trúc JSON làm nguồn chân lý duy nhất: `content/interview-questions.json`
  ```json
  [
    { "section": "B", "section_position": 1, "global_order": 1, "question_ko": "안녕하세요? 만나서 반갑습니다." },
    { "section": "B", "section_position": 2, "global_order": 2, "question_ko": "나이가 몇 살입니까?" }
  ]
  ```
  (sinh ra từ `cau-hoi-phong-van-eps-BC.md` đã làm sạch — sẽ viết script chuyển 1 lần).
- `scripts/seed-interview-questions.ts`:
  1. Đọc JSON.
  2. Với mỗi câu: upload file mp3 tương ứng (`{global_order}_Chapter_1.mp3` từ thư mục ElevenLabs) lên Storage tại `interview/{global_order}.mp3`.
  3. Insert/upsert vào `interview_questions` (dùng `SUPABASE_SERVICE_ROLE_KEY`, chạy bằng `pnpm seed`, không chạy trên client).
- Trước khi seed thật: **spot-check** vài file audio (1, 20, 41, 42, 60, 81) để xác nhận đúng khớp câu hỏi như giả định ở mục 0.

## 6. Cấu trúc thư mục Next.js

```
korean-learning-web/
├── app/
│   ├── layout.tsx                     # dark theme, font, provider chung
│   ├── globals.css                    # CSS variables theo DESIGN-spotify.md
│   ├── page.tsx                       # Trang chủ: giới thiệu, link vào module học
│   └── luyen-tap/
│       └── phong-van/
│           └── page.tsx               # 1 TAB DUY NHẤT: 81 câu hỏi dạng danh sách phẳng, mỗi dòng có nút play
├── components/
│   ├── ui/                            # Button (pill), Card, CircularPlayButton...
│   ├── audio/
│   │   ├── audio-player-provider.tsx  # client context: id đang phát, play/pause
│   │   ├── question-row.tsx           # 1 dòng câu hỏi + nút play
│   │   └── now-playing-bar.tsx        # thanh phát nhạc cố định dưới cùng (giống Spotify)
│   └── layout/
│       ├── navbar.tsx
│       └── sidebar.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                  # browser client (anon key)
│   │   └── server.ts                  # server client cho Server Components
│   └── types.ts                       # types sinh từ Supabase (generate_typescript_types)
├── content/
│   └── interview-questions.json
├── scripts/
│   └── seed-interview-questions.ts
├── .env.local                         # NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
└── PLAN.md
```

## 7. Ánh xạ thiết kế Spotify → tính năng này

- Trang giống một "playlist" Spotify: tiêu đề trang (24px/700) + danh sách 81 "track" bên dưới, không có điều hướng phụ.
- Mỗi dòng câu hỏi: nền `#181818`, bo góc 6–8px, không viền, hover sáng nhẹ — giống hàng track trong playlist.
- Nút play mỗi dòng: hình tròn (50% radius), nền `#1f1f1f`, icon trắng — khi đang phát thì icon/viền chuyển sang xanh Spotify `#1ed760` để báo trạng thái "đang phát" (đúng nguyên tắc "xanh chỉ dùng cho chức năng, không trang trí"); các dòng khác giữ nguyên icon trắng.
- Thanh "đang phát" cố định ở đáy màn hình (như Spotify) hiển thị câu đang nghe + nút play/pause — tái sử dụng đúng pattern gốc của thiết kế, hữu ích khi cuộn qua danh sách dài 81 câu.
- Số thứ tự bên trái mỗi dòng dùng Caption 14px, câu hỏi tiếng Hàn dùng Body 16px/400.
- Danh sách dài 81 dòng nên cân nhắc virtualize (ví dụ `react-virtual`) nếu load chậm trên máy yếu — ưu tiên đo thử trước, chỉ thêm nếu thực sự cần (81 dòng text đơn giản thường không cần virtualize).

## 8. Các bước triển khai (chờ bạn xác nhận từng bước)

1. **Repo GitHub** — `gh repo create NguyenKimTien-AI-Engineer/korean-learning-web --public --source=. --push`. *Đã chốt tên + public, chỉ còn chờ lệnh thực thi.*
2. **Scaffold Next.js** — `pnpm create next-app` + cài Tailwind v4 + `next/font` cho Be Vietnam Pro + copy design tokens từ `DESIGN-spotify.md` vào `globals.css`.
3. **Supabase** — bạn tạo tổ chức Free mới trên dashboard supabase.com (khác org Pro hiện có) → cho tôi biết org slug → tôi tạo project + apply migration schema ở mục 4 qua MCP `apply_migration`. *Cần bạn tạo org trước vì MCP hiện chỉ thấy org Pro sẵn có.*
4. **Storage + seed** — tạo bucket `audio` (public), chạy script seed để nạp 81 câu hỏi + audio vào `interview_questions`.
5. **Trang giao diện** — build 1 trang `/luyen-tap/phong-van` với danh sách phẳng 81 câu + audio player theo mục 6–7.
6. **Deploy Vercel** — import repo, set env vars, deploy production. *Lưu ý: Vercel Hobby chỉ dành cho dự án cá nhân/phi thương mại theo ToS.*
7. **Kiểm thử** — mở trên desktop + mobile, nghe thử toàn bộ 81 audio để soát lỗi khớp nội dung/âm thanh (đối chiếu với giả định ở mục 0).

## 9. Backlog (sau MVP, chưa làm)

- Chia tab/lọc theo `section` (B/C) nếu danh sách 81 câu trở nên khó cuộn trên mobile.
- Thêm chuyên mục A (giới thiệu bản thân) và D (dụng cụ) khi có audio — chỉ cần thêm dữ liệu, schema đã hỗ trợ sẵn qua cột `section`.
- Đăng nhập học viên (Supabase Auth) + bảng `user_progress` (đã nghe câu nào, đánh dấu yêu thích).
- Tự động phát câu tiếp theo (autoplay next) khi nghe hết danh sách.
- Chế độ luyện tập: ẩn đáp án, tự kiểm tra, chấm điểm phát âm.
- Trang quản trị nội dung (CMS) nếu số lượng câu hỏi/module tăng lên nhiều, thay vì sửa tay qua Supabase Studio.
- Tìm kiếm câu hỏi trong danh sách.

## 10. Đã chốt / còn chờ

- [x] Tên repo: `korean-learning-web`, **public**, dưới tài khoản `NguyenKimTien-AI-Engineer`.
- [x] Font: `Be Vietnam Pro`.
- [x] UI: **1 tab duy nhất**, danh sách phẳng 81 câu, nhấn play là chạy audio ngay — không chia chuyên mục A/B/C/D.
- [ ] **Còn chờ bạn**: tạo tổ chức Supabase **Free** mới trên dashboard (khác org Pro hiện có), gửi lại org slug để tôi tạo project + chạy migration.
- [ ] Xác nhận thời điểm bắt đầu code (tôi có thể scaffold Next.js + tạo repo ngay khi bạn đồng ý ở bước 1, song song chờ bạn tạo org Supabase ở bước 3).
