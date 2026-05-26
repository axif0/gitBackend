interface RateLimitEntry { count: number; resetTime: number; }
const store = new Map<string, RateLimitEntry>();
const WINDOW_MS = 60 * 1000;

export function checkRateLimit(ip: string, maxRequests = 30): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(ip);
  if (!entry || now > entry.resetTime) {
    store.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return { allowed: true, remaining: maxRequests - 1 };
  }
  if (entry.count >= maxRequests) return { allowed: false, remaining: 0 };
  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count };
}

setInterval(() => {
  const now = Date.now();
  const entries = Array.from(store.entries());
  for (const [key, value] of entries) {
    if (now > value.resetTime) store.delete(key);
  }
}, 60000);
