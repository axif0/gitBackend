import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.ADMIN_PASSWORD || 'fallback-secret');
const SESSION_COOKIE = 'admin_session';

async function isValidSession(token: string): Promise<boolean> {
  try { await jwtVerify(token, SECRET); return true; } catch { return false; }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith('/api/admin');
  const isPage = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');

  if (!isApi && !isPage) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token || !(await isValidSession(token))) {
    if (isApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
