-- Run this once in the Supabase SQL Editor after deploying the unified catalog code.
-- It enables live refreshes when an administrator changes products, images, or categories.
do $$
begin
  alter publication supabase_realtime add table public.products;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.product_images;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.categories;
exception when duplicate_object then null;
end $$;
