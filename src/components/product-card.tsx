"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/types/product";
import { whatsappUrl } from "@/lib/whatsapp";

export function ProductCard({ product }: { product: Product }) {
  const toggleFavorite=()=>{const old=JSON.parse(localStorage.getItem("velvet-favorites")||"[]") as string[];localStorage.setItem("velvet-favorites",JSON.stringify(old.includes(product.id)?old.filter(x=>x!==product.id):[...old,product.id]));window.dispatchEvent(new Event("favorites-change"));};
  return <motion.article initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.35}} className="group relative"><Link href={`/catalogo/${product.slug}`} className="block"><div className="relative aspect-[4/5] overflow-hidden bg-graphite"><Image fill sizes="(max-width: 768px) 50vw, 25vw" src={product.images[0]} alt={product.name} className="object-cover transition duration-500 group-hover:scale-[1.035]"/>{(product.isNew||product.offer)&&<span className="absolute left-3 top-3 bg-velvet/90 px-2.5 py-1 text-[10px] uppercase tracking-widest text-gold">{product.offer?"Selección especial":"Novedad"}</span>}<button onClick={(e)=>{e.preventDefault();toggleFavorite();}} className="absolute right-3 top-3 grid h-9 w-9 rounded-full bg-black/30 backdrop-blur transition hover:bg-rose" aria-label={`Guardar ${product.name}`}><Heart size={16}/></button></div><div className="pt-4"><p className="text-[10px] uppercase tracking-[.16em] text-gold">{product.category}</p><div className="mt-1 flex items-baseline justify-between gap-3"><h3 className="font-display text-xl">{product.name}</h3><p className="text-sm">{product.price > 0 ? `$ ${product.price.toLocaleString("es-UY")}` : "Consultar"}</p></div></div></Link><a href={whatsappUrl(product)} target="_blank" className="mt-3 flex items-center gap-2 text-xs text-white/55 transition hover:text-gold"><MessageCircle size={14}/> Consultar disponibilidad</a></motion.article>
}
