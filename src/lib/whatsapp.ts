import type { Product } from "@/types/product";
export function whatsappUrl(product?: Product) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "59800000000";
  const price = product?.price ? `$ ${product.price.toLocaleString("es-UY")}` : "A consultar";
  const text = product ? `Hola, me interesa este producto:%0A%0ANombre: ${product.name}%0ACódigo: ${product.code}%0APrecio: ${price}%0A%0A¿Está disponible?` : "Hola, quisiera hacer una consulta sobre Velvet Room.";
  return `https://wa.me/${number}?text=${text}`;
}
