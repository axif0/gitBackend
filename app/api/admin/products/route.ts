import { NextRequest, NextResponse } from 'next/server';
import { getProducts, saveProducts, deleteImage } from '@/lib/github';
import { verifySession } from '@/lib/security/session';
import { verifyCsrfToken } from '@/lib/security/csrf';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { sanitizeObject } from '@/lib/security/sanitize';
import { validateRequest, BulkDeleteSchema } from '@/lib/schemas';
import { ProductCreateSchema, ProductUpdateSchema, slugify, type Product } from '@/types/product';
import { revalidatePath } from 'next/cache';

function ip(req: NextRequest) { return req.headers.get('x-forwarded-for') || 'unknown'; }

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { allowed } = checkRateLimit(`admin:${ip(request)}`);
  if (!allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  if (!verifyCsrfToken(request)) return NextResponse.json({ error: 'Invalid CSRF' }, { status: 403 });

  const body = await request.json();
  const sanitized = sanitizeObject(body);
  if (!sanitized.slug && sanitized.name) sanitized.slug = slugify(sanitized.name as string);

  const validation = validateRequest(ProductCreateSchema, sanitized);
  if (!validation.success) return NextResponse.json({ error: validation.error }, { status: 400 });

  const products = await getProducts();
  if (products.some(p => p.id === validation.data.id)) {
    return NextResponse.json({ error: 'ID already exists' }, { status: 400 });
  }
  if (products.some(p => p.slug === validation.data.slug)) {
    validation.data.slug = `${validation.data.slug}-${Date.now()}`;
  }

  products.push(validation.data);
  await saveProducts(products);
  revalidatePath('/'); revalidatePath('/shop');
  return NextResponse.json(validation.data, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!verifyCsrfToken(request)) return NextResponse.json({ error: 'Invalid CSRF' }, { status: 403 });

  const body = await request.json();
  const sanitized = sanitizeObject(body);
  const validation = validateRequest(ProductUpdateSchema, sanitized);
  if (!validation.success) return NextResponse.json({ error: validation.error }, { status: 400 });

  const products = await getProducts();
  const index = products.findIndex(p => p.id === validation.data.id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  products[index] = validation.data;
  await saveProducts(products);
  revalidatePath('/'); revalidatePath('/shop'); revalidatePath(`/product/${validation.data.slug}`);
  return NextResponse.json(validation.data);
}

export async function DELETE(request: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!verifyCsrfToken(request)) return NextResponse.json({ error: 'Invalid CSRF' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const bulkParam = searchParams.get('bulk');
  const idParam = searchParams.get('id');

  if (bulkParam) {
    const ids = JSON.parse(bulkParam);
    const validation = validateRequest(BulkDeleteSchema, { ids });
    if (!validation.success) return NextResponse.json({ error: validation.error }, { status: 400 });
    const products = await getProducts();
    const toDelete = products.filter(p => validation.data.ids.includes(p.id));
    for (const p of toDelete) for (const img of p.images) { const f = img.split('/').pop(); if (f) await deleteImage(f); }
    await saveProducts(products.filter(p => !validation.data.ids.includes(p.id)));
    revalidatePath('/'); revalidatePath('/shop');
    return NextResponse.json({ deleted: toDelete.length });
  }

  if (!idParam) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  const products = await getProducts();
  const product = products.find(p => p.id === idParam);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  for (const img of product.images) { const f = img.split('/').pop(); if (f) await deleteImage(f); }
  await saveProducts(products.filter(p => p.id !== idParam));
  revalidatePath('/'); revalidatePath('/shop');
  return NextResponse.json({ success: true });
}
