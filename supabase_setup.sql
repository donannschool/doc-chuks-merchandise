-- =========================================================
-- DOC Chuks Merchandise Ltd — Supabase Database & Storage Setup
-- Run this entire script once in Supabase SQL Editor
-- =========================================================

-- ---------------------------------------------------------
-- 1. EXTENSIONS
-- ---------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- 2. PRODUCTS TABLE
-- ---------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  product_name text not null,
  part_number text not null,
  dimensions text,                    -- e.g. "35x50x8mm"
  material_brand text,                -- e.g. "Viton", "NBR", "NOK", "Corteco"
  category text not null check (category in (
    'Oil Seals', 'Gasket Rubbers', 'Valve Seals', 'O-Rings & Kits'
  )),
  car_make text not null check (car_make in (
    'Toyota', 'Honda', 'Mercedes-Benz', 'Lexus', 'Hyundai/Kia', 'Universal / Industrial'
  )),
  compatible_models text,
  sale_type text not null default 'Wholesale & Retail' check (sale_type in (
    'Wholesale & Retail', 'Wholesale Only', 'Retail Only'
  )),
  description text,
  image_url text,
  in_stock boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_car_make_idx on public.products (car_make);
create index if not exists products_search_idx on public.products
  using gin (
    to_tsvector('english',
      coalesce(product_name,'') || ' ' ||
      coalesce(part_number,'') || ' ' ||
      coalesce(dimensions,'') || ' ' ||
      coalesce(car_make,'')
    )
  );

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------
-- 3. SITE_SETTINGS TABLE (single row, id = 1)
-- ---------------------------------------------------------
create table if not exists public.site_settings (
  id int primary key default 1,
  business_name text not null default 'DOC Chuks Merchandise Ltd',
  motto text not null default 'With God all things are possible',
  tagline text not null default 'Wholesale & Retail Importers of Genuine Oil Seals, Gasket Rubbers, Valve Seals & O-Rings',
  about_history text not null default 'Headquartered at Zone B, Block 1, Shop 53, ASPAMDA Main Gate, Trade Fair International Complex, Ojo, Lagos, DOC Chuks Merchandise Ltd is a premier wholesale and retail distributor of precision automotive and industrial sealing components. We supply authentic Oil Seals, Gasket Rubbers, Valve Seals, and O-Rings to mechanics, fleet operators, and spare parts dealers across Nigeria and neighboring West African markets including Accra (Ghana) and Cotonou (Benin Republic).',
  whatsapp_number text not null default '2348033460040',
  secondary_phone text not null default '+234 913 748 8033',
  shop_address text not null default 'Zone B, Block 1, Shop 53, ASPAMDA Main Gate, Trade Fair International, Ojo, Lagos',
  directions_note text not null default 'Enter through Trade Fair Complex main gate and proceed straight to ASPAMDA Main Gate, Zone B, Block 1, Shop 53.',
  google_maps_embed_url text not null default '',
  instagram_url text not null default 'https://instagram.com',
  facebook_url text not null default 'https://facebook.com',
  tiktok_url text not null default '',
  opening_hours text not null default 'Mon - Sat: 8:00 AM - 6:00 PM',
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- seed the single settings row with defaults (no-op if it already exists)
insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

-- ---------------------------------------------------------
-- 4. STORAGE BUCKET
-- ---------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Public read access to product images
drop policy if exists "Public read product-images" on storage.objects;
create policy "Public read product-images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Authenticated users can upload
drop policy if exists "Authenticated upload product-images" on storage.objects;
create policy "Authenticated upload product-images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- Authenticated users can update their uploads
drop policy if exists "Authenticated update product-images" on storage.objects;
create policy "Authenticated update product-images"
  on storage.objects for update
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- Authenticated users can delete
drop policy if exists "Authenticated delete product-images" on storage.objects;
create policy "Authenticated delete product-images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- ---------------------------------------------------------
-- 5. ROW LEVEL SECURITY
-- ---------------------------------------------------------
alter table public.products enable row level security;
alter table public.site_settings enable row level security;

-- products: anyone can read, only authenticated can write
drop policy if exists "Public read products" on public.products;
create policy "Public read products"
  on public.products for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated insert products" on public.products;
create policy "Authenticated insert products"
  on public.products for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated update products" on public.products;
create policy "Authenticated update products"
  on public.products for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated delete products" on public.products;
create policy "Authenticated delete products"
  on public.products for delete
  to authenticated
  using (true);

-- site_settings: anyone can read, only authenticated can write
drop policy if exists "Public read site_settings" on public.site_settings;
create policy "Public read site_settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated update site_settings" on public.site_settings;
create policy "Authenticated update site_settings"
  on public.site_settings for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated insert site_settings" on public.site_settings;
create policy "Authenticated insert site_settings"
  on public.site_settings for insert
  to authenticated
  with check (true);

-- =========================================================
-- Done. Next steps:
-- 1. Go to Authentication > Users in Supabase dashboard and
--    create your admin user (email + password).
-- 2. Copy your Project URL and anon public key into the
--    frontend .env file (see README.md).
-- =========================================================
