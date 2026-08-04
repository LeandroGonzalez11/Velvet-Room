import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { KitsSection } from "@/components/kits-section";

export const metadata = { title: "Kits" };

export default function KitsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <p className="eyebrow">Combos pensados para vos</p>
        <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">Encontrá el kit ideal.</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-white/55">
          Combinaciones seleccionadas con mejor precio que comprar cada pieza por separado.
        </p>
        <KitsSection />
      </main>
      <SiteFooter />
    </>
  );
}
