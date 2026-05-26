import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/github';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://pachmishali.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const published = products.filter(p => p.isPublished !== false);

  const productEntries: MetadataRoute.Sitemap = published.map(p => ({
    url: `${BASE_URL}/product/${p.slug || p.id}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...productEntries,
  ];
}
