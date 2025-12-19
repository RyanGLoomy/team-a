-- Minimal schema for Team A / Trias Custom Home task

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  company text not null default 'Team A',
  house_size text not null,
  specs jsonb not null,

  total_price numeric not null,
  payment_method text not null check (payment_method in ('cash','credit')),
  dp numeric null,
  tenor_months int null,
  interest_rate numeric not null default 0.12,
  monthly_installment numeric null,

  full_name text not null,
  phone text not null,
  email text null,
  address text null,
  contact_person text null,
  notes text null,

  status text not null default 'new'
);

-- RLS
alter table public.leads enable row level security;

-- Public website can submit (insert) leads
drop policy if exists "allow anon insert leads" on public.leads;
create policy "allow anon insert leads"
on public.leads
for insert
to anon, authenticated
with check (true);

-- Only authenticated users (admin) can read
drop policy if exists "allow authenticated read leads" on public.leads;
create policy "allow authenticated read leads"
on public.leads
for select
to authenticated
using (true);

-- Only authenticated users (admin) can update
drop policy if exists "allow authenticated update leads" on public.leads;
create policy "allow authenticated update leads"
on public.leads
for update
to authenticated
using (true)
with check (true);
