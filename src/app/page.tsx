import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Headphones, Lock, MessageCircle, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { FeaturedProducts } from "@/components/featured-products";
import { KitsSection } from "@/components/kits-section";
import { CategoryTiles } from "@/components/category-tiles";
import { whatsappUrl } from "@/lib/whatsapp";

const trustBadges = [
  { icon: Truck, title: "Envíos discretos", desc: "A todo Uruguay, en empaques neutros y sin referencias." },
  { icon: Lock, title: "Discreción total", desc: "Tu privacidad es nuestra máxima prioridad." },
  { icon: ShieldCheck, title: "Compra segura", desc: "Coordinación y pagos protegidos." },
  { icon: Headphones, title: "Atención confidencial", desc: "Estamos para asesorarte con respeto y cercanía." },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative flex min-h-[88vh] items-end overflow-hidden bg-black md:min-h-[calc(100vh-108px)]">
          <Image src="/velvet-room-hero-v2.jpg" alt="Selección íntima premium Velvet Room" fill priority sizes="100vw" className="object-cover object-[68%_center] md:object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/25 to-transparent md:from-black/45" />
          <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-40 md:pb-20">
            <p className="eyebrow flex items-center gap-2"><Sparkles size={12} className="text-gold" /> Boutique íntima · Uruguay</p>
            <h1 className="mt-5 max-w-2xl font-display text-5xl leading-[1.02] sm:text-6xl md:text-8xl">
              Placer con <em className="font-normal not-italic text-rose">elegancia</em> y discreción.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-white/65">Descubrí una selección exclusiva para tu bienestar íntimo, tu placer y tu confianza.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/catalogo" className="rounded-full bg-white px-6 py-3 text-sm font-medium text-velvet transition hover:bg-gold">Descubrí la colección</Link>
              <a target="_blank" href={whatsappUrl()} className="flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm transition hover:border-gold hover:text-gold"><MessageCircle size={16} /> Hablar con nosotros</a>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-2 text-[11px] uppercase tracking-wider text-white/45">
              <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-gold" /> Productos premium</span>
              <span className="flex items-center gap-1.5"><Lock size={13} className="text-gold" /> Pago seguro</span>
              <span className="flex items-center gap-1.5"><Headphones size={13} className="text-gold" /> Atención confidencial</span>
            </div>
            <ArrowDown className="absolute bottom-6 right-5 hidden animate-bounce text-gold sm:block md:right-10" size={19} />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <p className="eyebrow">Explorá por categoría</p>
          <h2 className="mt-3 max-w-lg font-display text-4xl leading-tight md:text-5xl">Cada momento tiene su pieza ideal.</h2>
          <div className="mt-9"><CategoryTiles /></div>
        </section>

        <section className="border-y border-white/10">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/10 md:grid-cols-4">
            {trustBadges.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-velvet p-6 md:p-8">
                <Icon className="text-gold" size={20} />
                <h3 className="mt-4 font-display text-lg md:text-xl">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-white/50 md:text-sm md:leading-6">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pt-20 md:pt-28">
          <div className="flex items-end justify-between">
            <div><p className="eyebrow">Combos con mejor precio</p><h2 className="mt-3 font-display text-4xl md:text-5xl">Encontrá el kit ideal.</h2></div>
            <Link href="/kits" className="hidden items-center gap-1 text-sm text-gold md:flex">Ver todos <ArrowUpRight size={16} /></Link>
          </div>
          <KitsSection />
        </section>

        <section className="mx-auto max-w-7xl px-5 py-24 md:py-32">
          <div className="flex items-end justify-between">
            <div><p className="eyebrow">Selección Velvet</p><h2 className="mt-3 font-display text-4xl md:text-5xl">Piezas para descubrir.</h2></div>
            <Link href="/catalogo" className="hidden items-center gap-1 text-sm text-gold md:flex">Ver todo <ArrowUpRight size={16} /></Link>
          </div>
          <FeaturedProducts />
        </section>

        <section className="relative overflow-hidden px-5 py-20 md:py-28">
          <Image src="/velvet-room-hero.jpg" alt="" fill className="object-cover opacity-25" />
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
            <h2 className="font-display text-3xl leading-tight md:text-5xl">Tu bienestar, tu placer, tu conexión.</h2>
            <p className="max-w-md text-sm leading-6 text-white/60 md:text-base">Explorá, disfrutá y elegí lo que te hace sentir bien. Siempre con total discreción.</p>
            <Link href="/catalogo" className="rounded-full bg-rose px-7 py-3.5 text-sm font-semibold transition hover:bg-[#c6818b]">Explorá más</Link>
          </div>
        </section>

        <section id="faq" className="bg-[#151313] px-5 py-24">
          <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">
            <div><p className="eyebrow">Una experiencia simple</p><h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">La intimidad merece su propio tiempo.</h2></div>
            <div className="divide-y divide-white/10">
              {[
                ["¿Cómo compro?", "Elegí tu producto y escribinos por WhatsApp. Confirmamos la disponibilidad y coordinamos todo personalmente."],
                ["¿Los envíos son discretos?", "Sí. Todos los pedidos se preparan sin referencias al contenido y con el máximo cuidado."],
                ["¿Cómo puedo pagar?", "Te compartimos los métodos disponibles durante la coordinación de tu pedido."],
              ].map(([q, a]) => (
                <details key={q} className="group py-5">
                  <summary className="cursor-pointer list-none font-medium">{q}<span className="float-right text-gold group-open:rotate-45">+</span></summary>
                  <p className="pt-3 text-sm leading-6 text-white/55">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
