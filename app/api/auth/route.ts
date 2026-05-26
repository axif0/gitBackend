import { NextRequest, NextResponse } from 'next/server';
import { createSession, destroySession } from '@/lib/security/session';
import { generateCsrfToken, setCsrfCookie } from '@/lib/security/csrf';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { validateRequest, LoginSchema } from '@/lib/schemas';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const { allowed } = checkRateLimit(`auth:${ip}`, 10);
  if (!allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const body = await request.json();
  const validation = validateRequest(LoginSchema, body);
  if (!validation.success) return NextResponse.json({ error: validation.error }, { status: 400 });
  if (validation.data.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  await createSession();
  const csrfToken = generateCsrfToken();
  setCsrfCookie(csrfToken);
  return NextResponse.json({ success: true, csrfToken });
}

export async function GET() {
  const { verifySession } = await import('@/lib/security/session');
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  return NextResponse.json({ authenticated: true });
}

export async function DELETE() {
  destroySession();
  return NextResponse.json({ success: true });
}
