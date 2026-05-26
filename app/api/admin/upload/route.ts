import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/github';
import { verifySession } from '@/lib/security/session';
import { verifyCsrfToken } from '@/lib/security/csrf';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { validateRequest, UploadSchema } from '@/lib/schemas';

export async function POST(request: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const { allowed } = checkRateLimit(`admin:${ip}`);
  if (!allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  if (!verifyCsrfToken(request)) return NextResponse.json({ error: 'Invalid CSRF' }, { status: 403 });

  const body = await request.json();
  const validation = validateRequest(UploadSchema, body);
  if (!validation.success) return NextResponse.json({ error: validation.error }, { status: 400 });

  try {
    const base64 = validation.data.data.replace(/^data:image\/\w+;base64,/, '');
    const path = await uploadImage(validation.data.filename, base64);
    return NextResponse.json({ path, filename: validation.data.filename });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
