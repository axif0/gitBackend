import { Octokit } from '@octokit/rest';
import { cachedFetch, queueWrite, invalidateCache } from './cache';
import type { SiteSettings } from '@/lib/schemas';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = process.env.GITHUB_OWNER!;
const repo = process.env.GITHUB_REPO!;
const branch = process.env.GITHUB_BRANCH || 'main';
const SETTINGS_PATH = 'data/settings.json';
const RAW_BASE = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}`;

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'পাঁচমিশালি',
  siteNameEn: 'Pachmishali',
  tagline: 'সকলের জন্য কম দামে ভালো মানের পণ্য দেয়ার প্রতিজ্ঞায়',
  logoUrl: '',
  faviconUrl: '',
  bkashNumber: '',
  phone: '',
  address: 'জীবন বিমা সংলগ্ন, বড় মাঠ গেট, Nilphamari - 5300',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61568737816148',
  messengerUrl: 'https://www.facebook.com/messages/t/61568737816148/',
  tiktokUrl: 'https://tiktok.com/@pachmishali_100',
  deliveryCharge: 120,
  freeDeliveryThreshold: 1500,
  metaDescription: 'সকলের জন্য কম দামে ভালো মানের পণ্য — পাঁচমিশালি',
  announcementBar: '🚚 সারা বাংলাদেশে Cash on Delivery | 48–72 ঘণ্টায় ডেলিভারি',
  ogImageUrl: '',
};

async function getFileSha(path: string): Promise<string | undefined> {
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path, ref: branch });
    if ('sha' in data) return data.sha;
    return undefined;
  } catch {
    return undefined;
  }
}

export async function getSettings(): Promise<SiteSettings> {
  return cachedFetch('settings', async () => {
    try {
      const url = `${RAW_BASE}/${SETTINGS_PATH}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
      clearTimeout(timeout);
      if (res.ok) return { ...DEFAULT_SETTINGS, ...await res.json() };
    } catch {}
    try {
      const { data } = await octokit.repos.getContent({ owner, repo, path: SETTINGS_PATH, ref: branch });
      if ('content' in data) return { ...DEFAULT_SETTINGS, ...JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8')) };
    } catch {}
    return DEFAULT_SETTINGS;
  });
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  await queueWrite(async () => {
    const sha = await getFileSha(SETTINGS_PATH);
    const content = Buffer.from(JSON.stringify(settings, null, 2)).toString('base64');
    await octokit.repos.createOrUpdateFileContents({
      owner, repo, path: SETTINGS_PATH,
      message: `Update settings - ${new Date().toISOString()}`,
      content, sha, branch,
    });
    invalidateCache('settings');
  });
}
