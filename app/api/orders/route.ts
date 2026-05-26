import { NextRequest, NextResponse } from 'next/server';
import { getOrders, saveOrders } from '@/lib/github';
import { verifySession } from '@/lib/security/session';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { sanitizeObject } from '@/lib/security/sanitize';
import { validateRequest, CheckoutSchema } from '@/lib/schemas';
import type { Order } from '@/types/order';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  // Require authentication for viewing orders (contains PII)
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (err) {
    console.error('Orders GET error:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const { allowed } = checkRateLimit(`order:${ip}`, 10);
  if (!allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const body = await request.json();
  const sanitized = sanitizeObject(body);
  const validation = validateRequest(CheckoutSchema, sanitized);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const now = new Date().toISOString();
  const order: Order = {
    id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    customer: validation.data.customer,
    items: validation.data.items,
    subtotal: validation.data.subtotal,
    discount: validation.data.discount,
    deliveryCharge: validation.data.deliveryCharge,
    promoCode: validation.data.promoCode,
    promoDiscount: validation.data.promoDiscount,
    grandTotal: validation.data.grandTotal,
    bkashTxId: validation.data.bkashTxId.toUpperCase(),
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  try {
    const orders = await getOrders();
    orders.push(order);
    await saveOrders(orders);
    revalidatePath('/admin/orders');
    revalidatePath('/sales');
    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (err) {
    console.error('Order creation error:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
