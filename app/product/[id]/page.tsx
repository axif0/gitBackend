import { getProducts } from '@/lib/github';
import { getFinalPrice } from '@/types/product';
import ProductDetailClient from './ProductDetailClient';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const products = await getProducts();
  const product = products.find((p) => p.id === params.id);

  if (!product) return notFound();

  return <ProductDetailClient product={product} />;
}
