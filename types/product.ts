export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPercent: number;
  category: 'necklace' | 'ring' | 'bracelet' | 'earring';
  images: string[];
  inStock: boolean;
  createdAt: string;
}

export function getFinalPrice(product: Product): number {
  return product.price - (product.price * product.discountPercent) / 100;
}
