import { cookies } from 'next/headers';
import { randomBytes, createHash } from 'crypto';

const SESSION_COOKIE = 'admin_session';
const TOKEN_LENGTH = 32;

// In-memory token store (resets on server restart - acceptable for single admin)
const validTokens = new Map<string, { hash: string; expires: number }>();

// Cleanup expired tokens periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of Array.from(validTokens.entries())) {
    if (now > value.expires) validTokens.delete(key);
  }
}, 60 * 60 * 1000); // Every hour

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export interface SessionData {
  role: 'admin';
  tokenHash: string;
}

export async function createSession(): Promise<string> {
  const token = randomBytes(TOKEN_LENGTH).toString('hex');
  const tokenHash = hashToken(token);
  const expires = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days

  // Store hash server-side
  validTokens.set(tokenHash, { hash: tokenHash, expires });

  // Set cookie
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
  if (!token || token.length < TOKEN_LENGTH * 2) return null;

  const tokenHash = hashToken(token);
  const stored = validTokens.get(tokenHash);

  if (!stored || Date.now() > stored.expires) {
    // Token not found or expired
    if (stored) validTokens.delete(tokenHash);
    return null;
  }

  return { role: 'admin', tokenHash };
}

export function destroySession(): void {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    const tokenHash = hashToken(token);
    validTokens.delete(tokenHash);
  }
  cookies().delete(SESSION_COOKIE);
}
