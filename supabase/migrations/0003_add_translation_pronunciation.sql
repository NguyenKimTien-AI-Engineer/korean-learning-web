-- Them cot nghia tieng Viet va phien am (romanization) de hien thi tren
-- flip-card giao dien moi. Da chay truc tiep tren Supabase SQL Editor.

alter table interview_questions
  add column if not exists question_vi text,
  add column if not exists pronunciation text;
