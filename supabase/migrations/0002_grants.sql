-- Can thiet vi luc tao project da tat "Automatically expose new tables",
-- nen bang interview_questions chua duoc cap quyen cho cac role API.
-- Da chay truc tiep tren Supabase SQL Editor.

grant select on table interview_questions to anon, authenticated;
grant select, insert, update, delete on table interview_questions
  to service_role, authenticator;
