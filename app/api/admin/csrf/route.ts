import { NextResponse } from 'next/server';
import { getCsrfToken } from '@/lib/security/csrf';
import { verifySession } from '@/lib/security/session';

export async function GET() {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const token = getCsrfToken() || '';
  return NextResponse.json({ csrfToken: token });
}
