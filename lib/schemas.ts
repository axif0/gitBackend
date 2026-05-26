import { z } from 'zod';

export const SettingsSchema = z.object({
  siteName: z.string().min(1).max(100),
  siteNameEn: z.string().max(100).optional().default(''),
  tagline: z.string().max(500).optional().default(''),
  logoUrl: z.string().max(500).optional().default(''),
  faviconUrl: z.string().max(500).optional().default(''),
  bkashNumber: z.string().max(20).optional().default(''),
  phone: z.string().max(20).optional().default(''),
  address: z.string().max(500).optional().default(''),
  facebookUrl: z.string().max(500).optional().default(''),
  messengerUrl: z.string().max(500).optional().default(''),
  tiktokUrl: z.string().max(500).optional().default(''),
  deliveryCharge: z.number().min(0).max(10000),
  freeDeliveryThreshold: z.number().min(0).max(100000),
  metaDescription: z.string().max(500).optional().default(''),
  announcementBar: z.string().max(500).optional().default(''),
  ogImageUrl: z.string().max(500).optional().default(''),
});

export type SiteSettings = z.infer<typeof SettingsSchema>;

export const LoginSchema = z.object({
  password: z.string().min(1).max(200),
});

export const UploadSchema = z.object({
  filename: z.string().min(1).max(200).regex(/^[a-zA-Z0-9._-]+$/),
  data: z.string().min(1).max(10 * 1024 * 1024),
});

export const CheckoutSchema = z.object({
  customer: z.object({
    fullName: z.string().min(2).max(200),
    phone: z.string().regex(/^01[3-9]\d{8}$/),
    email: z.string().email().optional().or(z.literal('')),
    division: z.string().min(1),
    district: z.string().min(1),
    address: z.string().min(5).max(1000),
    deliveryNote: z.string().max(500).optional().or(z.literal('')),
  }),
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    price: z.number().positive(),
    discountPercent: z.number().min(0).max(100),
    quantity: z.number().int().positive(),
    image: z.string().optional(),
  })).min(1),
  subtotal: z.number().positive(),
  discount: z.number().min(0),
  deliveryCharge: z.number().min(0),
  promoCode: z.string().optional(),
  promoDiscount: z.number().min(0).optional(),
  grandTotal: z.number().positive(),
  bkashTxId: z.string().min(10).max(50).regex(/^[A-Z0-9]+$/),
});

export const BulkDeleteSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(100),
});

export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  const errorMessage = result.error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`).join('; ');
  return { success: false, error: errorMessage };
}
