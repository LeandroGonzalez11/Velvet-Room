"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Menu, MessageCircle, Search, X } from "lucide-react";
import { useState } from "react";
import { whatsappUrl } from "@/lib/whatsapp";
import { AnnouncementBar } from "./announcement-bar";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const links = [
    ["Inicio", "/"],
    ["Catálogo", "/catalogo"],
    ["Kits", "/kits"],
    ["Envíos", "/envios"],
    ["Preguntas", "/#faq"],
  ];

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/catalogo?buscar=${encodeURIComponent(search.trim())}`);
    setSearchOpen(false);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-velvet/95 backdrop-blur">
      <AnnouncementBar />
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-2xl tracking-wide">
          <span className="text-rose">VR</span>
          <span className="hidden sm:inline">Velvet <span className="text-rose">Room</span></span>
        </Link>

        <nav className="hidden gap-8 text-sm text-white/70 lg:flex">
          {links.map(([n, h]) => (
            <Link key={n} href={h} className="transition hover:text-gold">{n}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <button aria-label="Buscar" onClick={() => setSearchOpen(v => !v)} className="hidden text-white/80 hover:text-gold md:block">
            <Search size={18} />
          </button>
          <Link href="/favoritos" aria-label="Favoritos" className="text-white/80 hover:text-gold">
            <Heart size={18} />
          </Link>
          <a href={whatsappUrl()} target="_blank" aria-label="WhatsApp" className="hidden items-center gap-2 rounded-full bg-rose px-4 py-2 text-xs font-semibold transition hover:bg-[#c6818b] md:flex">
            <MessageCircle size={15} /> Contactar
          </a>
          <button aria-label="Abrir menú" className="lg:hidden" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={submitSearch} className="hidden border-t border-white/10 bg-black/40 px-5 py-3 md:block">
          <div className="mx-auto flex max-w-7xl items-center gap-2">
            <Search size={16} className="text-gold" />
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar en el catálogo…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
            />
          </div>
        </form>
      )}

      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/10 bg-velvet px-5 py-6 text-sm lg:hidden">
          <form onSubmit={submitSearch} className="mb-4 flex items-center gap-2 border-b border-white/15 pb-3">
            <Search size={16} className="text-gold" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar en el catálogo…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
            />
          </form>
          {links.map(([n, h]) => (
            <Link onClick={() => setOpen(false)} key={n} href={h} className="py-2.5 text-base">{n}</Link>
          ))}
          <a href={whatsappUrl()} target="_blank" className="mt-4 flex items-center justify-center gap-2 rounded-full bg-rose px-4 py-3 text-sm font-semibold">
            <MessageCircle size={16} /> Contactar por WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
