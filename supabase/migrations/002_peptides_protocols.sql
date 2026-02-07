-- Phase 2: peptides + protocols tables with RLS

-- 1) Create peptides table
create table if not exists public.peptides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  unit text not null,
  route text null,
  notes text null,
  created_at timestamptz default now()
);

alter table public.peptides enable row level security;

create policy "Users can view own peptides"
  on public.peptides for select
  using (auth.uid() = user_id);

create policy "Users can insert own peptides"
  on public.peptides for insert
  with check (auth.uid() = user_id);

create policy "Users can update own peptides"
  on public.peptides for update
  using (auth.uid() = user_id);

create policy "Users can delete own peptides"
  on public.peptides for delete
  using (auth.uid() = user_id);

create index if not exists idx_peptides_user_id on public.peptides(user_id);

-- 2) Create protocols table
create table if not exists public.protocols (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  start_date date not null,
  end_date date null,
  timezone text not null default 'Asia/Kuala_Lumpur',
  is_active boolean not null default true,
  created_at timestamptz default now()
);

alter table public.protocols enable row level security;

create policy "Users can view own protocols"
  on public.protocols for select
  using (auth.uid() = user_id);

create policy "Users can insert own protocols"
  on public.protocols for insert
  with check (auth.uid() = user_id);

create policy "Users can update own protocols"
  on public.protocols for update
  using (auth.uid() = user_id);

create policy "Users can delete own protocols"
  on public.protocols for delete
  using (auth.uid() = user_id);

create index if not exists idx_protocols_user_id on public.protocols(user_id);
