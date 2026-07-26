"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { usePublicProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function FavoritesPage() { const [ids, setIds] = useState<string[]>([]); const { products, loading } = usePublicProducts(); useEffect(() => { const sync = () => setIds(JSON.parse(localStorage.getItem("velvet-favorites") || "[]")); sync(); addEventListener("favorites-change", sync); return () => removeEventListener("favorites-change", sync); }, []); const saved = products.filter(product => ids.includes(product.id)); return <><SiteHeader /><main className="mx-auto min-h-screen max-w-7xl px-5 py-20"><p className="eyebrow">Tu selección</p><h1 className="mt-3 font-display text-5xl">Favoritos</h1>{loading ? <p className="mt-12 text-white/50">Cargando favoritos…</p> : saved.length ? <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-11 md:grid-cols-3 lg:grid-cols-4">{saved.map(product => <ProductCard key={product.id} product={product} />)}</div> : <div className="mt-14 grid place-items-center border border-dashed border-white/15 py-24 text-center"><Heart className="text-gold" /><p className="mt-4 text-white/60">Todavía no guardaste ninguna pieza.</p><Link className="mt-5 text-sm text-gold underline underline-offset-4" href="/catalogo">Explorar catálogo</Link></div>}</main><SiteFooter /></>; }
