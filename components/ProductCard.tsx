'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, getFinalPrice } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { getImageUrl } from '@/lib/image-url';

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const finalPrice = getFinalPrice(product);
  const hasDiscount = product.discountPercent > 0;
  const outOfStock = !product.inStock || product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (outOfStock) return;
    addItem({
      productId: product.id, productName: product.name, price: product.price,
      discountPercent: product.discountPercent, quantity: 1,
      image: product.images[0], category: product.category,
    });
  };

  return (
    <Link href={`/product/${product.slug || product.id}`} className="group block">
      <div className="card-premium overflow-hidden relative">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden" style={{ background: 'linear-gradient(135deg, #FAE8F1, #F5ECD4)' }}>
          {product.images[0] ? (
            <Image
              src={getImageUrl(product.images[0])}
              alt={`${product.name} - পাঁচমিশালি`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sakura-400/40">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
          )}

          {/* Discount badge */}
          {hasDiscount && <span className="badge-discount">{product.discountPercent}% OFF</span>}

          {/* Out of stock overlay */}
          {outOfStock && (
            <div className="absolute inset-0 bg-ink/60 flex items-center justify-center backdrop-blur-[2px]">
              <span className="bg-cream text-ink px-5 py-2 rounded-full font-semibold text-sm font-bengali">স্টক শেষ</span>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <div className="bg-deep-rose/92 backdrop-blur-sm p-4 space-y-2">
              <button onClick={handleAddToCart} disabled={outOfStock} className="w-full bg-cream text-deep-rose py-2.5 rounded-full font-semibold text-sm hover:bg-white transition-colors disabled:opacity-50 font-bengali">
                কার্টে যোগ করুন
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-[11px] text-sakura-400 uppercase tracking-wider mb-1 font-bengali">{product.category}</p>
          <h3 className="font-display text-[15px] font-medium text-ink mb-2 line-clamp-1 group-hover:text-sakura-600 transition-colors">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-gold-primary">৳{finalPrice.toFixed(0)}</span>
            {hasDiscount && <span className="text-sm text-sakura-400 line-through">৳{product.price}</span>}
          </div>
          <div className="mt-2">
            {outOfStock ? (
              <span className="text-[11px] text-red-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> স্টক শেষ
              </span>
            ) : (
              <span className="text-[11px] text-green-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> স্টক আছে
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default React.memo(ProductCard);
