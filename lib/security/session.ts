import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

const SESSION_COOKIE = 'admin_session';

export interface SessionData {
  role: 'admin';
  token: string;
}

export async function createSession(): Promise<string> {
  const token = randomBytes(32).toString('hex');
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return token;
}

export async function verifySession(): Promise<SessionData | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token || token.length < 32) return null;
  return { role: 'admin', token };
}

export function destroySession(): void {
  cookies().delete(SESSION_COOKIE);
}
