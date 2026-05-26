const cache = new Map<string, { data: unknown; timestamp: number; revalidating: boolean }>();
const pendingFetches = new Map<string, Promise<unknown>>();

const DEFAULT_TTL = 60_000;
const STALE_TTL = 300_000;

export function getCached<T>(key: string): { data: T; stale: boolean } | null {
  const entry = cache.get(key);
  if (!entry) return null;
  const age = Date.now() - entry.timestamp;
  if (age > STALE_TTL) { cache.delete(key); return null; }
  return { data: entry.data as T, stale: age > DEFAULT_TTL };
}

export function setCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now(), revalidating: false });
}

export function invalidateCache(key: string): void {
  cache.delete(key);
}

export function invalidateAllCache(): void {
  cache.clear();
}

export async function cachedFetch<T>(key: string, fetcher: () => Promise<T>, ttl = DEFAULT_TTL): Promise<T> {
  const cached = getCached<T>(key);
  if (cached && !cached.stale) return cached.data;

  if (cached?.stale) {
    const entry = cache.get(key);
    if (entry && !entry.revalidating) {
      entry.revalidating = true;
      fetcher().then(data => setCache(key, data)).catch(() => {}).finally(() => { if (entry) entry.revalidating = false; });
    }
    return cached.data;
  }

  const existing = pendingFetches.get(key) as Promise<T> | undefined;
  if (existing) return existing;

  const promise = fetcher().then(data => { setCache(key, data); pendingFetches.delete(key); return data; }).catch(err => { pendingFetches.delete(key); throw err; });
  pendingFetches.set(key, promise);
  return promise;
}

let writeQueue: Promise<void> = Promise.resolve();

export function queueWrite(fn: () => Promise<void>): Promise<void> {
  writeQueue = writeQueue.then(fn).catch(fn);
  return writeQueue;
}

let requestCount = { reads: 0, writes: 0, cacheHits: 0, cacheMisses: 0 };

export function getRequestCount() { return { ...requestCount }; }
export function resetRequestCount() { requestCount = { reads: 0, writes: 0, cacheHits: 0, cacheMisses: 0 }; }
export function incrementRead() { requestCount.reads++; }
export function incrementWrite() { requestCount.writes++; }
export function incrementCacheHit() { requestCount.cacheHits++; }
export function incrementCacheMiss() { requestCount.cacheMisses++; }
