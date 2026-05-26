import { getProducts } from '@/lib/github';
import { getSettings } from '@/lib/settings';
import { getFinalPrice } from '@/types/product';
import ProductDetailClient from './ProductDetailClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 30;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.filter(p => p.isPublished !== false).map(p => ({ id: p.slug || p.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  const product = products.find(p => p.id === params.id || p.slug === params.id);
  if (!product) return { title: 'পণ্য পাওয়া যায়নি' };

  const finalPrice = getFinalPrice(product);
  const title = `${product.name} | ${settings.siteName}`;
  const description = product.description.slice(0, 160);

  return {
    title, description,
    openGraph: { title, description, images: product.images[0] ? [{ url: product.images[0] }] : [], type: 'website', locale: 'bn_BD' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `/product/${product.slug || product.id}` },
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  const product = products.find(p => p.id === params.id || p.slug === params.id);
  if (!product || product.isPublished === false) return notFound();

  const finalPrice = getFinalPrice(product);

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Product',
    name: product.name, description: product.description, image: product.images[0] || '',
    sku: product.id,
    brand: { '@type': 'Brand', name: settings.siteName },
    offers: {
      '@type': 'Offer', priceCurrency: 'BDT', price: finalPrice,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: settings.siteName },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetailClient product={product} settings={settings} />
    </>
  );
}
