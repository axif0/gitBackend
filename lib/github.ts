import { Octokit } from '@octokit/rest';
import { cachedFetch, queueWrite, invalidateCache } from './cache';
import type { Product } from '@/types/product';
import type { Order } from '@/types/order';

const owner = process.env.GITHUB_OWNER || '';
const repo = process.env.GITHUB_REPO || '';
const branch = process.env.GITHUB_BRANCH || process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'master';

function getOctokit() {
  return new Octokit({ auth: process.env.GITHUB_TOKEN });
}

const PRODUCTS_PATH = 'data/products.json';
const ORDERS_PATH = 'data/orders.json';
const SETTINGS_PATH = 'data/settings.json';
const IMAGES_DIR = 'public/images';

const RAW_BASE = owner && repo ? `https://raw.githubusercontent.com/${owner}/${repo}/${branch}` : '';

async function fetchRaw<T>(path: string): Promise<T | null> {
  if (!RAW_BASE) return null;
  const url = `${RAW_BASE}/${path}`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    clearTimeout(timeout);
    if (!res.ok) return null;
    return await res.json() as T;
  } catch { return null; }
}

async function fetchWithRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  for (let i = 0; i <= retries; i++) {
    try { return await fn(); } catch (err) {
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
  throw new Error('Max retries exceeded');
}

async function getFileSha(path: string): Promise<string | undefined> {
  try {
    const { data } = await getOctokit().repos.getContent({ owner, repo, path, ref: branch });
    if ('sha' in data) return data.sha;
    return undefined;
  } catch { return undefined; }
}

export async function getProducts(): Promise<Product[]> {
  return cachedFetch('products', async () => {
    const raw = await fetchRaw<Product[]>(PRODUCTS_PATH);
    if (raw) return raw;
    try {
      const { data } = await getOctokit().repos.getContent({ owner, repo, path: PRODUCTS_PATH, ref: branch });
      if ('content' in data) return JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8')) as Product[];
    } catch {}
    return [];
  });
}

export async function saveProducts(products: Product[]): Promise<void> {
  await queueWrite(async () => {
    const sha = await getFileSha(PRODUCTS_PATH);
    const content = Buffer.from(JSON.stringify(products, null, 2)).toString('base64');
    await fetchWithRetry(() => getOctokit().repos.createOrUpdateFileContents({
      owner, repo, path: PRODUCTS_PATH, message: `Update products - ${new Date().toISOString()}`,
      content, sha, branch,
    }));
    invalidateCache('products');
  });
}

export async function getOrders(): Promise<Order[]> {
  return cachedFetch('orders', async () => {
    const raw = await fetchRaw<Order[]>(ORDERS_PATH);
    if (raw) return raw;
    try {
      const { data } = await getOctokit().repos.getContent({ owner, repo, path: ORDERS_PATH, ref: branch });
      if ('content' in data) return JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8')) as Order[];
    } catch {}
    return [];
  });
}

export async function saveOrders(orders: Order[]): Promise<void> {
  await queueWrite(async () => {
    const sha = await getFileSha(ORDERS_PATH);
    const content = Buffer.from(JSON.stringify(orders, null, 2)).toString('base64');
    await fetchWithRetry(() => getOctokit().repos.createOrUpdateFileContents({
      owner, repo, path: ORDERS_PATH, message: `Update orders - ${new Date().toISOString()}`,
      content, sha, branch,
    }));
    invalidateCache('orders');
  });
}

export async function uploadImage(filename: string, base64Data: string): Promise<string> {
  const path = `${IMAGES_DIR}/${filename}`;
  await queueWrite(async () => {
    const sha = await getFileSha(path);
    await fetchWithRetry(() => getOctokit().repos.createOrUpdateFileContents({
      owner, repo, path, message: `Upload image: ${filename}`,
      content: base64Data, sha, branch,
    }));
  });
  return `public/images/${filename}`;
}

export async function uploadFile(path: string, base64Data: string, message: string): Promise<string> {
  await queueWrite(async () => {
    const sha = await getFileSha(path);
    await fetchWithRetry(() => getOctokit().repos.createOrUpdateFileContents({
      owner, repo, path, message, content: base64Data, sha, branch,
    }));
  });
  return path;
}

export async function deleteImage(filename: string): Promise<void> {
  const path = `${IMAGES_DIR}/${filename}`;
  await queueWrite(async () => {
    try {
      const { data } = await getOctokit().repos.getContent({ owner, repo, path, ref: branch });
      if ('sha' in data) {
        await fetchWithRetry(() => getOctokit().repos.deleteFile({
          owner, repo, path, message: `Delete image: ${filename}`, sha: data.sha, branch,
        }));
      }
    } catch {}
  });
}

export function getRawImageUrl(path: string): string {
  if (!path || path.startsWith('http')) return path || '';
  return `${RAW_BASE}/${path}`;
}
