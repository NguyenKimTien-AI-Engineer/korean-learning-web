-- Da chay truc tiep tren Supabase SQL Editor (project korean-learning-web, org SOVA).
-- File nay luu lai de tai lap khi can (vd: tao lai project moi).

create table interview_questions (
  id uuid primary key default gen_random_uuid(),
  global_order int unique not null,
  section text not null,
  section_position int not null,
  question_ko text not null,
  audio_path text not null,
  audio_url text not null,
  duration_seconds numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_interview_questions_order on interview_questions (global_order);

alter table interview_questions enable row level security;

create policy "public read questions" on interview_questions
  for select using (true);

insert into storage.buckets (id, name, public)
values ('audio', 'audio', true)
on conflict (id) do nothing;
