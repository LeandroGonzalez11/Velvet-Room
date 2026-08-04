"use client";

import { useCallback, useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Product } from "@/types/product";
import type { Kit } from "@/types/kit";

type DbImage = { id: string; storage_path: string; alt_text: string | null; sort_order: number };
type DbRow = { id: string; slug: string; name: string; description: string | null; price: number; stock: number; code: string | null; is_new: boolean; featured: boolean; offer: boolean; active: boolean; created_at: string; categories: { name: string } | null; product_images: DbImage[] | null };

function mapProduct(row: DbRow): Product {
  const supabase = createSupabaseBrowserClient();
  return { id: row.id, slug: row.slug, name: row.name, description: row.description, price: Number(row.price), category: row.categories?.name || "Sin categoría", stock: row.stock, code: row.code, isNew: row.is_new, featured: row.featured, offer: row.offer, active: row.active, createdAt: row.created_at, images: (row.product_images || []).sort((a, b) => a.sort_order - b.sort_order).map(image => ({ id: image.id, url: supabase?.storage.from("product-images").getPublicUrl(image.storage_path).data.publicUrl || "", alt: image.alt_text, sortOrder: image.sort_order })) };
}

const select = "id,slug,name,description,price,stock,code,is_new,featured,offer,active,created_at,categories(name),product_images(id,storage_path,alt_text,sort_order)";

export async function fetchPublicProducts(): Promise<Product[]> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("products").select(select).eq("active", true).order("sort_order").order("created_at", { ascending: false });
  if (error) throw error;
  return ((data || []) as unknown as DbRow[]).map(mapProduct);
}

export function usePublicProducts() {
  const [products, setProducts] = useState<Product[]>([]), [loading, setLoading] = useState(true), [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => { try { setError(null); setProducts(await fetchPublicProducts()); } catch (err) { setError(err instanceof Error ? err.message : "No se pudo cargar el catálogo."); } finally { setLoading(false); } }, []);
  useEffect(() => { refresh(); const supabase = createSupabaseBrowserClient(); if (!supabase) return; const channel = supabase.channel("velvet-public-catalog").on("postgres_changes", { event: "*", schema: "public", table: "products" }, refresh).on("postgres_changes", { event: "*", schema: "public", table: "product_images" }, refresh).subscribe(); return () => { supabase.removeChannel(channel); }; }, [refresh]);
  return { products, loading, error, refresh };
}

type DbKitRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  storage_path: string | null;
  active: boolean;
  created_at: string;
  kit_products: { products: { name: string } | null }[] | null;
};

function mapKit(row: DbKitRow): Kit {
  const supabase = createSupabaseBrowserClient();
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : null,
    imageUrl: row.storage_path ? supabase?.storage.from("product-images").getPublicUrl(row.storage_path).data.publicUrl || null : null,
    active: row.active,
    productNames: (row.kit_products || []).map(item => item.products?.name).filter((n): n is string => !!n),
    createdAt: row.created_at,
  };
}

const kitSelect = "id,slug,name,description,price,compare_at_price,storage_path,active,created_at,kit_products(products(name))";

export async function fetchPublicKits(): Promise<Kit[]> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("kits").select(kitSelect).eq("active", true).order("sort_order").order("created_at", { ascending: false });
  if (error) throw error;
  return ((data || []) as unknown as DbKitRow[]).map(mapKit);
}

export function usePublicKits() {
  const [kits, setKits] = useState<Kit[]>([]), [loading, setLoading] = useState(true), [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => { try { setError(null); setKits(await fetchPublicKits()); } catch (err) { setError(err instanceof Error ? err.message : "No se pudieron cargar los kits."); } finally { setLoading(false); } }, []);
  useEffect(() => { refresh(); const supabase = createSupabaseBrowserClient(); if (!supabase) return; const channel = supabase.channel("velvet-public-kits").on("postgres_changes", { event: "*", schema: "public", table: "kits" }, refresh).on("postgres_changes", { event: "*", schema: "public", table: "kit_products" }, refresh).subscribe(); return () => { supabase.removeChannel(channel); }; }, [refresh]);
  return { kits, loading, error, refresh };
}
