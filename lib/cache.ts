const cache = new Map<string, { data: unknown; timestamp: number }>();
const pendingFetches = new Map<string, Promise<unknown>>();

const CACHE_TTL = 60_000;

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) { cache.delete(key); return null; }
  return entry.data as T;
}

export function setCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export function invalidateCache(key: string): void {
  cache.delete(key);
}

export function invalidateAllCache(): void {
  cache.clear();
}

export async function cachedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = getCached<T>(key);
  if (cached !== null) return cached;

  const existing = pendingFetches.get(key) as Promise<T> | undefined;
  if (existing) return existing;

  const promise = fetcher()
    .then(data => { setCache(key, data); return data; })
    .finally(() => { pendingFetches.delete(key); });

  pendingFetches.set(key, promise);
  return promise;
}

let writeQueue: Promise<void> = Promise.resolve();

export function queueWrite(fn: () => Promise<void>): Promise<void> {
  writeQueue = writeQueue.then(() => fn()).catch(() => fn());
  return writeQueue;
}
