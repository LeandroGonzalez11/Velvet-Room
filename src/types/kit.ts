export type Kit = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string | null;
  active: boolean;
  productNames: string[];
  createdAt: string;
};
