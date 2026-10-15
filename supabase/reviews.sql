create table if not exists public.reviews (
  id bigint generated always as identity primary key,
  name text not null check (char_length(trim(name)) between 1 and 60),
  rating smallint not null check (rating between 1 and 5),
  review text not null check (char_length(trim(review)) between 1 and 1000),
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

grant select, insert on public.reviews to anon;

drop policy if exists "Anyone can read reviews" on public.reviews;
create policy "Anyone can read reviews"
  on public.reviews for select
  to anon
  using (true);

drop policy if exists "Anyone can post reviews" on public.reviews;
create policy "Anyone can post reviews"
  on public.reviews for insert
  to anon
  with check (true);
