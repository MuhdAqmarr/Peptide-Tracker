-- Phase 7: vials (inventory) table with RLS

create table if not exists public.vials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  peptide_id uuid not null references public.peptides(id) on delete restrict,
  label text null,
  batch text null,
  total_amount numeric not null,
  unit text not null,
  opened_on date null,
  expires_on date null,
  remaining_estimate numeric null,
  created_at timestamptz default now()
);

alter table public.vials enable row level security;

create policy "Users can view own vials"
  on public.vials for select
  using (auth.uid() = user_id);

create policy "Users can insert own vials"
  on public.vials for insert
  with check (auth.uid() = user_id);

create policy "Users can update own vials"
  on public.vials for update
  using (auth.uid() = user_id);

create policy "Users can delete own vials"
  on public.vials for delete
  using (auth.uid() = user_id);

create index if not exists idx_vials_user_id on public.vials(user_id);
create index if not exists idx_vials_peptide_id on public.vials(peptide_id);
create index if not exists idx_vials_expires_on on public.vials(expires_on);
