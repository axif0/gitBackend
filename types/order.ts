import { z } from 'zod';

export const OrderStatusEnum = z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']);
export type OrderStatus = z.infer<typeof OrderStatusEnum>;

export const CustomerSchema = z.object({
  fullName: z.string().min(2).max(200),
  phone: z.string().regex(/^01[3-9]\d{8}$/, 'ফোন নম্বর সঠিক নয়'),
  email: z.string().email().optional().or(z.literal('')),
  division: z.string().min(1),
  district: z.string().min(1),
  address: z.string().min(5).max(1000),
  deliveryNote: z.string().max(500).optional().or(z.literal('')),
});

export type Customer = z.infer<typeof CustomerSchema>;

export const OrderItemSchema = z.object({
  productId: z.string().min(1),
  productName: z.string().min(1),
  price: z.number().positive(),
  discountPercent: z.number().min(0).max(100),
  quantity: z.number().int().positive().max(100),
  image: z.string().optional(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;

export const OrderSchema = z.object({
  id: z.string().min(1),
  customer: CustomerSchema,
  items: z.array(OrderItemSchema).min(1).max(50),
  subtotal: z.number().positive(),
  discount: z.number().min(0),
  deliveryCharge: z.number().min(0),
  promoCode: z.string().optional(),
  promoDiscount: z.number().min(0).optional(),
  grandTotal: z.number().positive(),
  bkashTxId: z.string().min(10).max(50).regex(/^[A-Z0-9]+$/, 'Transaction ID must be uppercase alphanumeric'),
  status: OrderStatusEnum,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Order = z.infer<typeof OrderSchema>;

export const OrderCreateSchema = z.object({
  customer: CustomerSchema,
  items: z.array(OrderItemSchema).min(1),
  subtotal: z.number().positive(),
  discount: z.number().min(0),
  deliveryCharge: z.number().min(0),
  promoCode: z.string().optional(),
  promoDiscount: z.number().min(0).optional(),
  grandTotal: z.number().positive(),
  bkashTxId: z.string().min(10).max(50).regex(/^[A-Z0-9]+$/),
});

export const OrderStatusUpdateSchema = z.object({
  status: OrderStatusEnum,
});

export const DIVISIONS = [
  'ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ',
] as const;

export const DISTRICTS_BY_DIVISION: Record<string, string[]> = {
  'ঢাকা': ['ঢাকা', 'গাজীপুর', 'নারায়ণগঞ্জ', 'মুন্সিগঞ্জ', 'মানিকগঞ্জ', 'ফরিদপুর', 'গোপালগঞ্জ', 'মাদারীপুর', 'শরীয়তপুর', 'রাজবাড়ী', 'কিশোরগঞ্জ', 'নরসিংদী', 'টাঙ্গাইল', 'জামালপুর', 'শেরপুর', 'নেত্রকোণা'],
  'চট্টগ্রাম': ['চট্টগ্রাম', 'কক্সবাজার', 'রাঙ্গামাটি', 'বান্দরবান', 'খাগড়াছড়ি', 'ফেনী', 'লক্ষ্মীপুর', 'চাঁদপুর', 'কুমিল্লা', 'ব্রাহ্মণবাড়িয়া', 'নোয়াখালী', 'লাকসাম'],
  'রাজশাহী': ['রাজশাহী', 'নাটোর', 'নওগাঁ', 'চাঁপাইনবাবগঞ্জ', 'বগুড়া', 'জয়পুরহাট', 'সিরাজগঞ্জ', 'পাবনা'],
  'খুলনা': ['খুলনা', 'যশোর', 'সাতক্ষীরা', 'বাগেরহাট', 'কুষ্টিয়া', 'মেহেরপুর', 'চুয়াডাঙ্গা', 'ঝিনাইদহ', 'মাগুরা', 'নড়াইল'],
  'বরিশাল': ['বরিশাল', 'পটুয়াখালী', 'ভোলা', 'বরগুনা', 'ঝালকাঠি', 'পিরোজপুর'],
  'সিলেট': ['সিলেট', 'মৌলভীবাজার', 'হবিগঞ্জ', 'সুনামগঞ্জ'],
  'রংপুর': ['রংপুর', 'দিনাজপুর', 'গাইবান্ধা', 'কুড়িগ্রাম', 'লালমনিরহাট', 'নীলফামারী', 'পঞ্চগড়', 'ঠাকুরগাঁও'],
  'ময়মনসিংহ': ['ময়মনসিংহ', 'জামালপুর', 'শেরপুর', 'নেত্রকোণা'],
};

export const ALL_DISTRICTS = Object.values(DISTRICTS_BY_DIVISION).flat();
