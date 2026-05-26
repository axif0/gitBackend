import { z } from 'zod';

export const CategoryEnum = z.enum(['necklace', 'ring', 'bracelet', 'earring', 'watch', 'other']);
export type Category = z.infer<typeof CategoryEnum>;

export const ProductSchema = z.object({
  id: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9\u0980-\u09FF-]+$/),
  name: z.string().min(1).max(200),
  nameEn: z.string().max(200).optional().default(''),
  description: z.string().min(1).max(5000),
  descriptionEn: z.string().max(5000).optional().default(''),
  price: z.number().positive().max(10000000),
  discountPercent: z.number().min(0).max(100),
  category: CategoryEnum,
  images: z.array(z.string()).max(10),
  inStock: z.boolean(),
  stock: z.number().int().min(0).max(100000),
  isPublished: z.boolean(),
  createdAt: z.string().datetime(),
});

export const ProductCreateSchema = ProductSchema;
export const ProductUpdateSchema = ProductSchema;
export const ProductPartialSchema = ProductSchema.partial().extend({ id: z.string().min(1) });

export type Product = z.infer<typeof ProductSchema>;

export function getFinalPrice(product: Pick<Product, 'price' | 'discountPercent'>): number {
  return product.price - (product.price * product.discountPercent) / 100;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0980-\u09FF-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
