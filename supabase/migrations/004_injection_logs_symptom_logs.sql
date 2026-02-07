-- Phase 5: injection_logs + symptom_logs tables with RLS

-- 1) Create injection_logs table
create table if not exists public.injection_logs (
  id uuid primary key default gen_random_uuid(),
  scheduled_dose_id uuid not null references public.scheduled_doses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  actual_time timestamptz not null,
  site text null,
  pain_score int null,
  notes text null,
  created_at timestamptz default now(),

  constraint chk_pain_score check (pain_score is null or (pain_score >= 0 and pain_score <= 10))
);

alter table public.injection_logs enable row level security;

create policy "Users can view own injection logs"
  on public.injection_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own injection logs"
  on public.injection_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own injection logs"
  on public.injection_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete own injection logs"
  on public.injection_logs for delete
  using (auth.uid() = user_id);

create index if not exists idx_injection_logs_user_id on public.injection_logs(user_id);
create index if not exists idx_injection_logs_dose_id on public.injection_logs(scheduled_dose_id);

-- 2) Create symptom_logs table
create table if not exists public.symptom_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_time timestamptz not null,
  nausea int null,
  headache int null,
  sleep int null,
  appetite int null,
  notes text null,
  created_at timestamptz default now(),

  constraint chk_nausea check (nausea is null or (nausea >= 0 and nausea <= 10)),
  constraint chk_headache check (headache is null or (headache >= 0 and headache <= 10)),
  constraint chk_sleep check (sleep is null or (sleep >= 0 and sleep <= 10)),
  constraint chk_appetite check (appetite is null or (appetite >= 0 and appetite <= 10))
);

alter table public.symptom_logs enable row level security;

create policy "Users can view own symptom logs"
  on public.symptom_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own symptom logs"
  on public.symptom_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own symptom logs"
  on public.symptom_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete own symptom logs"
  on public.symptom_logs for delete
  using (auth.uid() = user_id);

create index if not exists idx_symptom_logs_user_id on public.symptom_logs(user_id);
create index if not exists idx_symptom_logs_log_time on public.symptom_logs(log_time);
