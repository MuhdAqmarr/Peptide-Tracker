-- Phase 3: protocol_items + scheduled_doses tables with RLS

-- 1) Create protocol_items table
create table if not exists public.protocol_items (
  id uuid primary key default gen_random_uuid(),
  protocol_id uuid not null references public.protocols(id) on delete cascade,
  peptide_id uuid not null references public.peptides(id) on delete restrict,
  dose_value numeric not null,
  frequency_type text not null,  -- 'ED'|'EOD'|'WEEKLY'|'CUSTOM'
  interval_days int null,        -- required if CUSTOM
  days_of_week int[] null,       -- 0=Sun..6=Sat; used if WEEKLY
  time_of_day time not null,
  site_plan_enabled boolean not null default false,
  created_at timestamptz default now(),

  constraint chk_frequency_type check (frequency_type in ('ED', 'EOD', 'WEEKLY', 'CUSTOM')),
  constraint chk_custom_interval check (
    frequency_type != 'CUSTOM' or interval_days is not null
  ),
  constraint chk_weekly_days check (
    frequency_type != 'WEEKLY' or days_of_week is not null
  )
);

alter table public.protocol_items enable row level security;

-- RLS: access allowed only if parent protocol belongs to user
create policy "Users can view own protocol items"
  on public.protocol_items for select
  using (
    exists (
      select 1 from public.protocols
      where protocols.id = protocol_items.protocol_id
        and protocols.user_id = auth.uid()
    )
  );

create policy "Users can insert own protocol items"
  on public.protocol_items for insert
  with check (
    exists (
      select 1 from public.protocols
      where protocols.id = protocol_items.protocol_id
        and protocols.user_id = auth.uid()
    )
  );

create policy "Users can update own protocol items"
  on public.protocol_items for update
  using (
    exists (
      select 1 from public.protocols
      where protocols.id = protocol_items.protocol_id
        and protocols.user_id = auth.uid()
    )
  );

create policy "Users can delete own protocol items"
  on public.protocol_items for delete
  using (
    exists (
      select 1 from public.protocols
      where protocols.id = protocol_items.protocol_id
        and protocols.user_id = auth.uid()
    )
  );

create index if not exists idx_protocol_items_protocol_id on public.protocol_items(protocol_id);
create index if not exists idx_protocol_items_peptide_id on public.protocol_items(peptide_id);

-- 2) Create scheduled_doses table
create table if not exists public.scheduled_doses (
  id uuid primary key default gen_random_uuid(),
  protocol_item_id uuid not null references public.protocol_items(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  scheduled_at timestamptz not null,
  status text not null default 'DUE',
  done_at timestamptz null,
  created_at timestamptz default now(),

  constraint chk_dose_status check (status in ('DUE', 'DONE', 'SKIPPED', 'MISSED')),
  constraint uq_protocol_item_scheduled_at unique (protocol_item_id, scheduled_at)
);

alter table public.scheduled_doses enable row level security;

create policy "Users can view own scheduled doses"
  on public.scheduled_doses for select
  using (auth.uid() = user_id);

create policy "Users can insert own scheduled doses"
  on public.scheduled_doses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own scheduled doses"
  on public.scheduled_doses for update
  using (auth.uid() = user_id);

create policy "Users can delete own scheduled doses"
  on public.scheduled_doses for delete
  using (auth.uid() = user_id);

create index if not exists idx_scheduled_doses_user_id on public.scheduled_doses(user_id);
create index if not exists idx_scheduled_doses_protocol_item_id on public.scheduled_doses(protocol_item_id);
create index if not exists idx_scheduled_doses_scheduled_at on public.scheduled_doses(scheduled_at);
create index if not exists idx_scheduled_doses_status on public.scheduled_doses(status);
