"use client";

import { usePublicProducts } from "@/lib/catalog";
import { ProductCard } from "./product-card";

export function FeaturedProducts() {
  const { products, loading } = usePublicProducts();
  const featured = products.filter(product => product.featured).slice(0, 6);
  if (loading) return <p className="py-12 text-sm text-white/45">Cargando selección…</p>;
  if (!featured.length) return <p className="py-12 text-sm text-white/45">La selección Velvet estará disponible pronto.</p>;
  return <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-11 md:grid-cols-3">{featured.map(product => <ProductCard product={product} key={product.id} />)}</div>;
}
