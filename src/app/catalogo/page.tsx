import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Catalogue } from "@/components/catalogue";
export const metadata={title:"Catálogo"};
export default function CatalogPage(){return <><SiteHeader/><main className="mx-auto min-h-screen max-w-7xl px-5 py-16 md:py-24"><p className="eyebrow">Catálogo</p><h1 className="mt-4 max-w-2xl font-display text-5xl md:text-7xl">Encuentra tu momento.</h1><p className="mt-5 max-w-xl text-white/55">Una colección seleccionada para el bienestar, el deseo y la conexión.</p><Catalogue/></main><SiteFooter/></>}
