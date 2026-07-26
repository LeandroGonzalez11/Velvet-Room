"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { ArrowLeft, MessageCircle, ShieldCheck } from "lucide-react";
import { fetchPublicProducts } from "@/lib/catalog";
import { whatsappUrl } from "@/lib/whatsapp";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/types/product";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null), [related, setRelated] = useState<Product[]>([]), [loading, setLoading] = useState(true);
  useEffect(() => { fetchPublicProducts().then(items => { const current = items.find(item => item.slug === slug) || null; setProduct(current); setRelated(current ? items.filter(item => item.category === current.category && item.id !== current.id).slice(0, 3) : []); }).finally(() => setLoading(false)); }, [slug]);
  if (loading) return <><SiteHeader /><main className="min-h-screen px-5 py-28 text-center text-white/50">Cargando producto…</main><SiteFooter /></>;
  if (!product) return <><SiteHeader /><main className="min-h-screen px-5 py-28 text-center"><h1 className="font-display text-4xl">Esta pieza no está disponible.</h1><Link className="mt-6 inline-block text-gold underline" href="/catalogo">Volver al catálogo</Link></main><SiteFooter /></>;
  const mainImage = product.images[0];
  return <><SiteHeader /><main className="mx-auto max-w-7xl px-5 py-8 md:py-14"><Link className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-gold" href="/catalogo"><ArrowLeft size={16} /> Volver al catálogo</Link><section className="mt-8 grid gap-10 md:grid-cols-2 md:gap-20"><div className="relative grid aspect-[4/5] place-items-center overflow-hidden bg-graphite">{mainImage ? <img src={mainImage.url} alt={mainImage.alt || product.name} className="h-full w-full object-cover" /> : <span className="text-sm text-white/35">Sin imagen</span>}</div><div className="flex flex-col justify-center"><p className="eyebrow">{product.category}</p><h1 className="mt-4 font-display text-5xl md:text-6xl">{product.name}</h1><p className="mt-5 text-2xl">{product.price > 0 ? `$ ${product.price.toLocaleString("es-UY")}` : "Consultar precio"}</p><p className="mt-8 max-w-lg leading-7 text-white/60">{product.description || "Consultanos por WhatsApp para conocer todos los detalles."}</p><dl className="mt-9 grid grid-cols-2 gap-y-4 border-y border-white/10 py-6 text-sm"><div><dt className="text-white/40">Código</dt><dd className="mt-1">{product.code || "—"}</dd></div><div><dt className="text-white/40">Disponibilidad</dt><dd className="mt-1">{product.stock > 0 ? "Disponible" : "Consultar"}</dd></div></dl><a target="_blank" href={whatsappUrl(product)} className="mt-8 flex w-fit items-center gap-2 rounded-full bg-rose px-7 py-3.5 text-sm font-semibold transition hover:bg-[#c6818b]"><MessageCircle size={17} /> Comprar por WhatsApp</a><p className="mt-5 flex items-center gap-2 text-xs text-white/45"><ShieldCheck size={15} className="text-gold" /> Atención y envíos con total discreción.</p></div></section>{related.length > 0 && <section className="mt-28"><p className="eyebrow">También puede interesarte</p><h2 className="mt-3 font-display text-4xl">Continúa explorando</h2><div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">{related.map(item => <ProductCard key={item.id} product={item} />)}</div></section>}</main><SiteFooter /></>;
}
