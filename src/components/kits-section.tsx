"use client";

import { usePublicKits } from "@/lib/catalog";
import { KitCard } from "./kit-card";

export function KitsSection() {
  const { kits, loading } = usePublicKits();
  if (loading) return <p className="py-12 text-sm text-white/45">Cargando kits…</p>;
  if (!kits.length) return null;
  return (
    <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {kits.map(kit => <KitCard kit={kit} key={kit.id} />)}
    </div>
  );
}
