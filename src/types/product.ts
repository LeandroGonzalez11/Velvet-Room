export type ProductImage = { id: string; url: string; alt: string | null; sortOrder: number };
export type Product = { id: string; slug: string; name: string; description: string | null; price: number; category: string; images: ProductImage[]; stock: number; code: string | null; isNew: boolean; featured: boolean; offer: boolean; active: boolean; createdAt: string };
