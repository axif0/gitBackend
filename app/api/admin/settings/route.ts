import { NextRequest, NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/settings';
import { verifySession } from '@/lib/security/session';
import { verifyCsrfToken } from '@/lib/security/csrf';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { sanitizeObject } from '@/lib/security/sanitize';
import { validateRequest, SettingsSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const settings = await getSettings();
    const { getCsrfToken } = await import('@/lib/security/csrf');
    const csrfToken = getCsrfToken() || '';
    return NextResponse.json({ ...settings, _csrf: csrfToken });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const { allowed } = checkRateLimit(`admin:${ip}`);
  if (!allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  if (!verifyCsrfToken(request)) return NextResponse.json({ error: 'Invalid CSRF' }, { status: 403 });

  const body = await request.json();
  const sanitized = sanitizeObject(body);
  const validation = validateRequest(SettingsSchema, sanitized);
  if (!validation.success) return NextResponse.json({ error: validation.error }, { status: 400 });

  await saveSettings(validation.data);
  revalidatePath('/'); revalidatePath('/shop'); revalidatePath('/cart'); revalidatePath('/checkout');
  return NextResponse.json(validation.data);
}
