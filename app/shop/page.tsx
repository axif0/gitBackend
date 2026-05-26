import { getProducts } from '@/lib/github';
import { getSettings } from '@/lib/settings';
import type { Metadata } from 'next';
import ShopClient from './ShopClient';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = `সব পণ্য | ${settings.siteName}`;
  return {
    title, description: `সব গহনা ও ঘড়ি দেখুন — ${settings.siteName}। কম দামে ভালো মানের পণ্য।`,
    openGraph: { title, type: 'website', locale: 'bn_BD' },
    alternates: { canonical: '/shop' },
  };
}

export default async function ShopPage() {
  const products = await getProducts();
  const published = products.filter(p => p.isPublished !== false);
  return <ShopClient initialProducts={published} />;
}
