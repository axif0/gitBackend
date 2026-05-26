'use client';

import Image from 'next/image';
import Link from 'next/link';
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

export default function ProductDetailClient({ product }: { product: Product }) {
  const finalPrice = getFinalPrice(product);
  const hasDiscount = product.discountPercent > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-gold-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-gold-600">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
          {product.images[0] ? (
            <Image
              src={getImageUrl(product.images[0])}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {hasDiscount && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        <div>
          <p className="text-sm text-gold-600 uppercase tracking-wider mb-2">
            {product.category}
          </p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-gold-700">৳{finalPrice.toFixed(0)}</span>
            {hasDiscount && (
              <>
                <span className="text-xl text-gray-400 line-through">৳{product.price}</span>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                  Save ৳{(product.price - finalPrice).toFixed(0)}
                </span>
              </>
            )}
          </div>

          <div className="mb-6">
            <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium ${
              product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {product.inStock ? '✓ In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className="prose prose-gray mb-8">
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
          </div>

          <button
            disabled={!product.inStock}
            className="btn-primary w-full sm:w-auto text-lg px-12 py-4"
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}
