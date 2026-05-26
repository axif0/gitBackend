import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith('/api/admin');
  const isPage = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');

  if (!isApi && !isPage) return NextResponse.next();

  const session = request.cookies.get('admin_session')?.value;
  if (!session) {
    if (isApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
