-- =============================================================
-- Record Breaker — Supabase Schema
-- =============================================================

-- profiles
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  role text not null default 'trainee' check (role in ('trainee', 'coach')),
  display_name text,
  created_at timestamptz not null default now()
);

create index idx_profiles_role on public.profiles (role);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'trainee'),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- muscle_groups
create table public.muscle_groups (
  id uuid default gen_random_uuid() primary key,
  name_en text not null,
  name_zh text not null,
  region text not null,
  description text not null default '',
  mesh_key text not null unique,
  created_at timestamptz not null default now()
);

create index idx_muscle_groups_region on public.muscle_groups (region);
create index idx_muscle_groups_mesh_key on public.muscle_groups (mesh_key);

alter table public.muscle_groups enable row level security;

create policy "Muscle groups are publicly readable"
  on public.muscle_groups for select using (true);


-- exercise_library
create table public.exercise_library (
  id uuid default gen_random_uuid() primary key,
  name_en text not null,
  name_zh text not null,
  equipment text not null default 'barbell',
  category text not null default 'compound',
  instructions text not null default '',
  created_at timestamptz not null default now()
);

create index idx_exercise_library_category on public.exercise_library (category);

alter table public.exercise_library enable row level security;

create policy "Exercises are publicly readable"
  on public.exercise_library for select using (true);


-- exercise_muscle_map
create table public.exercise_muscle_map (
  id uuid default gen_random_uuid() primary key,
  exercise_id uuid not null references public.exercise_library (id) on delete cascade,
  muscle_id uuid not null references public.muscle_groups (id) on delete cascade,
  role text not null check (role in ('primary', 'secondary')),
  weight_score numeric(3, 2),
  created_at timestamptz not null default now(),
  unique (exercise_id, muscle_id)
);

create index idx_emm_exercise on public.exercise_muscle_map (exercise_id);
create index idx_emm_muscle on public.exercise_muscle_map (muscle_id);

alter table public.exercise_muscle_map enable row level security;

create policy "Exercise-muscle map is publicly readable"
  on public.exercise_muscle_map for select using (true);


-- workout_sessions
create table public.workout_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  session_date date not null default current_date,
  title text not null default '',
  note text,
  created_at timestamptz not null default now()
);

create index idx_sessions_user on public.workout_sessions (user_id);
create index idx_sessions_date on public.workout_sessions (session_date desc);

alter table public.workout_sessions enable row level security;

create policy "Users can view own sessions"
  on public.workout_sessions for select using (auth.uid() = user_id);
create policy "Users can insert own sessions"
  on public.workout_sessions for insert with check (auth.uid() = user_id);
create policy "Users can update own sessions"
  on public.workout_sessions for update using (auth.uid() = user_id);
create policy "Users can delete own sessions"
  on public.workout_sessions for delete using (auth.uid() = user_id);


-- exercise_logs
create table public.exercise_logs (
  id uuid default gen_random_uuid() primary key,
  session_id uuid not null references public.workout_sessions (id) on delete cascade,
  exercise_id uuid not null references public.exercise_library (id) on delete restrict,
  sets integer not null default 0,
  reps integer not null default 0,
  weight numeric(7, 2) not null default 0,
  rpe numeric(3, 1),
  note text,
  created_at timestamptz not null default now()
);

create index idx_logs_session on public.exercise_logs (session_id);
create index idx_logs_exercise on public.exercise_logs (exercise_id);

alter table public.exercise_logs enable row level security;

create policy "Users can view own exercise logs"
  on public.exercise_logs for select
  using (
    exists (
      select 1 from public.workout_sessions ws
      where ws.id = exercise_logs.session_id and ws.user_id = auth.uid()
    )
  );
create policy "Users can insert own exercise logs"
  on public.exercise_logs for insert
  with check (
    exists (
      select 1 from public.workout_sessions ws
      where ws.id = exercise_logs.session_id and ws.user_id = auth.uid()
    )
  );
create policy "Users can update own exercise logs"
  on public.exercise_logs for update
  using (
    exists (
      select 1 from public.workout_sessions ws
      where ws.id = exercise_logs.session_id and ws.user_id = auth.uid()
    )
  );
create policy "Users can delete own exercise logs"
  on public.exercise_logs for delete
  using (
    exists (
      select 1 from public.workout_sessions ws
      where ws.id = exercise_logs.session_id and ws.user_id = auth.uid()
    )
  );


-- progress_photos
create table public.progress_photos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  image_path text not null,
  shot_type text not null default 'front' check (shot_type in ('front', 'back', 'side', 'custom')),
  taken_at date not null default current_date,
  note text,
  created_at timestamptz not null default now()
);

create index idx_photos_user on public.progress_photos (user_id);
create index idx_photos_date on public.progress_photos (taken_at desc);

alter table public.progress_photos enable row level security;

create policy "Users can view own photos"
  on public.progress_photos for select using (auth.uid() = user_id);
create policy "Users can insert own photos"
  on public.progress_photos for insert with check (auth.uid() = user_id);
create policy "Users can delete own photos"
  on public.progress_photos for delete using (auth.uid() = user_id);


-- coach_student_links
create table public.coach_student_links (
  id uuid default gen_random_uuid() primary key,
  coach_id uuid not null references public.profiles (id) on delete cascade,
  trainee_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'active', 'inactive')),
  created_at timestamptz not null default now(),
  unique (coach_id, trainee_id)
);

create index idx_csl_coach on public.coach_student_links (coach_id);
create index idx_csl_trainee on public.coach_student_links (trainee_id);

alter table public.coach_student_links enable row level security;

create policy "Coaches can view own links"
  on public.coach_student_links for select
  using (auth.uid() = coach_id or auth.uid() = trainee_id);
create policy "Coaches can create links"
  on public.coach_student_links for insert
  with check (auth.uid() = coach_id);
create policy "Either party can update link"
  on public.coach_student_links for update
  using (auth.uid() = coach_id or auth.uid() = trainee_id);


-- storage bucket for progress photos
insert into storage.buckets (id, name, public)
values ('progress-photos', 'progress-photos', false)
on conflict (id) do nothing;

create policy "Users can upload own photos"
  on storage.objects for insert
  with check (
    bucket_id = 'progress-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can view own photos"
  on storage.objects for select
  using (
    bucket_id = 'progress-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete own photos"
  on storage.objects for delete
  using (
    bucket_id = 'progress-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
