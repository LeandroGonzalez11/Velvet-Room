"use client";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { Kit } from "@/types/kit";

function kitWhatsappUrl(kit: Kit) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "59898705908";
  const price = `$ ${kit.price.toLocaleString("es-UY")}`;
  const text = `Hola, me interesa este kit:%0A%0A${encodeURIComponent(kit.name)}%0APrecio: ${price}%0A%0A¿Está disponible?`;
  return `https://wa.me/${number}?text=${text}`;
}

export function KitCard({ kit }: { kit: Kit }) {
  const discount = kit.compareAtPrice && kit.compareAtPrice > kit.price
    ? Math.round(100 - (kit.price / kit.compareAtPrice) * 100)
    : null;
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="group relative flex flex-col overflow-hidden border border-gold/15 bg-graphite"
    >
      <div className="relative aspect-square overflow-hidden bg-black">
        {kit.imageUrl ? (
          <img src={kit.imageUrl} alt={kit.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]" />
        ) : (
          <div className="grid h-full place-items-center px-6 text-center text-xs uppercase tracking-widest text-white/35">Imagen próximamente</div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-rose px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white shadow-lg">Oferta</span>
        {discount && <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold">-{discount}%</span>}
      </div>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <h3 className="font-display text-xl leading-snug">{kit.name}</h3>
        {kit.productNames.length > 0 && (
          <p className="mt-1.5 text-[11px] leading-5 text-white/45">Incluye: {kit.productNames.join(" · ")}</p>
        )}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-rose">$ {kit.price.toLocaleString("es-UY")}</span>
          {kit.compareAtPrice && <span className="text-xs text-white/35 line-through">$ {kit.compareAtPrice.toLocaleString("es-UY")}</span>}
        </div>
        <a href={kitWhatsappUrl(kit)} target="_blank" className="mt-4 flex items-center justify-center gap-2 rounded-full border border-gold/40 py-2.5 text-xs font-medium text-gold transition hover:bg-gold hover:text-velvet">
          <MessageCircle size={14} /> Consultar este kit
        </a>
      </div>
    </motion.article>
  );
}
