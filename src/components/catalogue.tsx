"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { usePublicProducts } from "@/lib/catalog";
import { ProductCard } from "./product-card";

export function Catalogue() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("categoria") || "Todos";
  const initialQuery = searchParams.get("buscar") || "";
  const [query, setQuery] = useState(initialQuery), [category, setCategory] = useState(initialCategory), [sort, setSort] = useState("recent");
  const { products, loading, error } = usePublicProducts();
  const categories = ["Todos", ...Array.from(new Set(products.map(product => product.category)))];
  const result = useMemo(() => products.filter(product => (category === "Todos" || product.category === category) && product.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : sort === "name" ? a.name.localeCompare(b.name) : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [products, query, category, sort]);
  return <><div className="mt-10 flex flex-col gap-4 border-y border-white/10 py-5 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-center gap-2 border-b border-white/20 pb-2 lg:w-80"><Search size={16} className="text-gold" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar una pieza" className="w-full bg-transparent text-sm outline-none placeholder:text-white/35" /></div><div className="flex flex-wrap gap-2">{categories.map(item => <button key={item} onClick={() => setCategory(item)} className={`rounded-full border px-3 py-1.5 text-xs transition ${item === category ? "border-gold bg-gold text-velvet" : "border-white/15 text-white/60 hover:border-white/40"}`}>{item}</button>)}</div><label className="flex items-center gap-2 text-xs text-white/60"><SlidersHorizontal size={14} /><select value={sort} onChange={e => setSort(e.target.value)} className="bg-transparent outline-none"><option value="recent">Más recientes</option><option value="name">Nombre</option><option value="low">Menor precio</option><option value="high">Mayor precio</option></select></label></div>{loading ? <p className="py-24 text-center text-sm text-white/45">Cargando catálogo…</p> : error ? <p className="py-24 text-center text-sm text-rose">No se pudo cargar el catálogo.</p> : <><p className="mt-8 text-sm text-white/45">{result.length} piezas seleccionadas</p><div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-11 md:grid-cols-3 lg:grid-cols-4">{result.map(product => <ProductCard key={product.id} product={product} />)}</div>{!result.length && <p className="py-24 text-center text-white/45">No encontramos piezas con esa búsqueda.</p>}</>}</>;
}
