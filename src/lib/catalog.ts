"use client";

import { useCallback, useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Product } from "@/types/product";

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
