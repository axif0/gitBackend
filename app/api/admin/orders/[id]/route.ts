import { NextRequest, NextResponse } from 'next/server';
import { getOrders, saveOrders } from '@/lib/github';
import { verifySession } from '@/lib/security/session';
import { verifyCsrfToken } from '@/lib/security/csrf';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { validateRequest } from '@/lib/schemas';
import { OrderStatusUpdateSchema } from '@/types/order';
import { revalidatePath } from 'next/cache';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const { allowed } = checkRateLimit(`admin:${ip}`);
  if (!allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  if (!verifyCsrfToken(request)) return NextResponse.json({ error: 'Invalid CSRF' }, { status: 403 });

  const body = await request.json();
  const validation = validateRequest(OrderStatusUpdateSchema, body);
  if (!validation.success) return NextResponse.json({ error: validation.error }, { status: 400 });

  const orders = await getOrders();
  const index = orders.findIndex(o => o.id === params.id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  orders[index].status = validation.data.status;
  orders[index].updatedAt = new Date().toISOString();
  await saveOrders(orders);
  revalidatePath('/admin/orders'); revalidatePath('/sales');
  return NextResponse.json(orders[index]);
}
