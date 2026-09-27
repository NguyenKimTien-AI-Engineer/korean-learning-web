-- Migration 0004 thieu quyen UPDATE cho user_question_progress, khien
-- upsert() (INSERT ... ON CONFLICT DO UPDATE) bao loi 42501 permission
-- denied. Da chay truc tiep tren Supabase SQL Editor.

grant update on public.user_question_progress to authenticated, service_role;
