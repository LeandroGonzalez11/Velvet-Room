-- Execute this in the Supabase SQL Editor before enabling the admin UI.
create table if not exists public.categories (id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique, created_at timestamptz not null default now());
create table if not exists public.products (id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique, description text, price numeric(12,2) not null check (price >= 0), category_id uuid references public.categories(id), stock integer not null default 0 check (stock >= 0), code text unique, is_new boolean not null default false, featured boolean not null default false, offer boolean not null default false, active boolean not null default true, sort_order integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.product_images (id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade, storage_path text not null, alt_text text, sort_order integer not null default 0);
create table if not exists public.settings (key text primary key, value jsonb not null, updated_at timestamptz not null default now());
create table if not exists public.admins (user_id uuid primary key references auth.users(id) on delete cascade, created_at timestamptz not null default now());
alter table public.categories enable row level security; alter table public.products enable row level security; alter table public.product_images enable row level security; alter table public.settings enable row level security;
alter table public.admins enable row level security;
create or replace function public.is_admin() returns boolean language sql security definer stable set search_path = public as $$ select exists(select 1 from public.admins where user_id = auth.uid()) $$;
create policy "public can read active products" on public.products for select using (active = true);
create policy "public can read categories" on public.categories for select using (true);
create policy "public can read product images" on public.product_images for select using (true);
create policy "admins manage products" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage categories" on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage images" on public.product_images for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins read settings" on public.settings for select to authenticated using (public.is_admin());
create policy "admins manage settings" on public.settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins view themselves" on public.admins for select to authenticated using (user_id = auth.uid());
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict do nothing;
create policy "admins upload product files" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin());
create policy "admins update product files" on storage.objects for update to authenticated using (bucket_id = 'product-images' and public.is_admin());
create policy "admins delete product files" on storage.objects for delete to authenticated using (bucket_id = 'product-images' and public.is_admin());
-- After creating the owner in Supabase Authentication, run this once with its UUID:
-- insert into public.admins (user_id) values ('OWNER_AUTH_USER_UUID');
