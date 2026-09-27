-- Auth: bang profile, tien do nghe va lich su quiz theo tung user.
-- Da chay truc tiep tren Supabase SQL Editor.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "select own profile" on public.profiles for select using (auth.uid() = id);
create policy "update own profile" on public.profiles for update using (auth.uid() = id);
create policy "insert own profile" on public.profiles for insert with check (auth.uid() = id);

create table public.user_question_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  section text not null,
  global_order int not null,
  listened_at timestamptz not null default now(),
  primary key (user_id, section, global_order)
);
alter table public.user_question_progress enable row level security;
create policy "select own progress" on public.user_question_progress for select using (auth.uid() = user_id);
create policy "insert own progress" on public.user_question_progress for insert with check (auth.uid() = user_id);
create policy "delete own progress" on public.user_question_progress for delete using (auth.uid() = user_id);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  section text not null,
  score int not null,
  total int not null,
  created_at timestamptz not null default now()
);
alter table public.quiz_attempts enable row level security;
create policy "select own attempts" on public.quiz_attempts for select using (auth.uid() = user_id);
create policy "insert own attempts" on public.quiz_attempts for insert with check (auth.uid() = user_id);

-- Vi da tat "Automatically expose new tables" luc tao project.
grant select, insert, update on public.profiles to authenticated, service_role;
grant select, insert, update, delete on public.user_question_progress to authenticated, service_role;
grant select, insert on public.quiz_attempts to authenticated, service_role;

-- Tu tao profile khi co user dang ky moi.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Storage bucket cho avatar, cau truc path: avatars/{user_id}/filename
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatar public read" on storage.objects
  for select using (bucket_id = 'avatars');
create policy "avatar owner insert" on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "avatar owner update" on storage.objects
  for update using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "avatar owner delete" on storage.objects
  for delete using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
