import Link from "next/link";

const tiles = [
  { title: "Juguetes", desc: "Explorá nuevas sensaciones.", href: "/catalogo?tag=juguetes", img: "/tiles/vibradores.jpg" },
  { title: "Bienestar íntimo", desc: "Cuidá tu cuerpo, elevá tu placer.", href: "/catalogo?tag=bienestar", img: "/tiles/bienestar.jpg" },
  { title: "BDSM", desc: "Para explorar con confianza.", href: "/catalogo?tag=bdsm", img: "/tiles/bdsm.jpg" },
  { title: "Kits para parejas", desc: "Conexión, complicidad y placer compartido.", href: "/kits", img: "/tiles/kits.jpg" },
];

export function CategoryTiles() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map(tile => (
        <Link key={tile.title} href={tile.href} className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden bg-graphite sm:aspect-[3/4]">
          <img src={tile.img} alt={tile.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
          <div className="relative p-5">
            <h3 className="font-display text-2xl">{tile.title}</h3>
            <p className="mt-1 max-w-[20ch] text-xs leading-5 text-white/60">{tile.desc}</p>
            <span className="mt-3 inline-block border-b border-gold text-[11px] uppercase tracking-widest text-gold transition group-hover:border-white group-hover:text-white">Ver más</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
