import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { whatsappUrl } from "@/lib/whatsapp";

export default function Home() {
  return <><SiteHeader /><main>
    <section className="relative flex min-h-[calc(100vh-80px)] items-end overflow-hidden bg-black">
      <Image src="/velvet-room-hero-v2.png" alt="Selección íntima premium Velvet Room" fill priority sizes="100vw" className="object-cover object-[68%_center] md:object-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/20 to-transparent md:from-black/40" />
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-40 md:pb-28">
        <p className="eyebrow">Boutique íntima · Uruguay</p>
        <h1 className="mt-5 max-w-2xl font-display text-6xl leading-[.96] md:text-8xl">El arte de <em className="font-normal text-rose">sentirse</em> bien.</h1>
        <p className="mt-7 max-w-md text-base leading-7 text-white/65">Una selección íntima y cuidadosa para explorar tu bienestar con total confianza.</p>
        <div className="mt-10 flex flex-wrap gap-3"><Link href="/catalogo" className="rounded-full bg-white px-6 py-3 text-sm font-medium text-velvet transition hover:bg-gold">Descubrir catálogo</Link><a target="_blank" href={whatsappUrl()} className="flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm transition hover:border-gold hover:text-gold"><MessageCircle size={16} /> Hablar con nosotros</a></div>
        <ArrowDown className="absolute bottom-8 right-5 animate-bounce text-gold md:right-10" size={19} />
      </div>
    </section>
    <section className="mx-auto grid max-w-7xl gap-px bg-white/10 md:grid-cols-3">
      <div className="bg-velvet p-8"><ShieldCheck className="text-gold" /><h2 className="mt-5 font-display text-2xl">Absoluta discreción</h2><p className="mt-3 text-sm leading-6 text-white/55">Cuidamos cada detalle, desde tu consulta hasta la entrega.</p></div>
      <div className="bg-velvet p-8"><Truck className="text-gold" /><h2 className="mt-5 font-display text-2xl">Envíos cuidados</h2><p className="mt-3 text-sm leading-6 text-white/55">Envíos discretos a todo Uruguay y retiro por locker.</p></div>
      <div className="bg-velvet p-8"><MessageCircle className="text-gold" /><h2 className="mt-5 font-display text-2xl">Atención personal</h2><p className="mt-3 text-sm leading-6 text-white/55">Te acompañamos de manera privada por WhatsApp.</p></div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-24 md:py-32"><div className="flex items-end justify-between"><div><p className="eyebrow">Selección Velvet</p><h2 className="mt-3 font-display text-4xl md:text-5xl">Piezas para descubrir.</h2></div><Link href="/catalogo" className="hidden items-center gap-1 text-sm text-gold md:flex">Ver todo <ArrowUpRight size={16} /></Link></div><div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-11 md:grid-cols-3">{products.filter(p => p.featured).map(p => <ProductCard product={p} key={p.id} />)}</div></section>
    <section id="faq" className="bg-[#151313] px-5 py-24"><div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2"><div><p className="eyebrow">Una experiencia simple</p><h2 className="mt-4 font-display text-5xl leading-tight">La intimidad merece su propio tiempo.</h2></div><div className="divide-y divide-white/10">{[["¿Cómo compro?", "Elegí tu producto y escribinos por WhatsApp. Confirmamos la disponibilidad y coordinamos todo personalmente."], ["¿Los envíos son discretos?", "Sí. Todos los pedidos se preparan sin referencias al contenido y con el máximo cuidado."], ["¿Cómo puedo pagar?", "Te compartimos los métodos disponibles durante la coordinación de tu pedido."]].map(([q, a]) => <details key={q} className="group py-5"><summary className="cursor-pointer list-none font-medium">{q}<span className="float-right text-gold group-open:rotate-45">+</span></summary><p className="pt-3 text-sm leading-6 text-white/55">{a}</p></details>)}</div></div></section>
  </main><SiteFooter /></>;
}
