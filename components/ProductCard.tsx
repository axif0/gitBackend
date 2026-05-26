'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product, getFinalPrice } from '@/types/product';

function getImageUrl(src: string): string {
  if (src.startsWith('http')) return src;
  const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER || '';
  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || '';
  if (owner && repo) {
    return `https://raw.githubusercontent.com/${owner}/${repo}/main/${src}`;
  }
  return `/${src}`;
}

export default function ProductCard({ product }: { product: Product }) {
  const finalPrice = getFinalPrice(product);
  const hasDiscount = product.discountPercent > 0;

  return (
    <Link href={`/product/${product.id}`} className="card group overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.images[0] ? (
          <Image
            src={getImageUrl(product.images[0])}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {hasDiscount && (
          <span className="badge-discount">{product.discountPercent}% OFF</span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gold-600 uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gold-700 transition-colors">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gold-700">৳{finalPrice.toFixed(0)}</span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">৳{product.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
