'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product, getFinalPrice } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { getImageUrl } from '@/lib/image-url';

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link href={`/product/${product.slug || product.id}`} className="group block">
        <div className="card-premium relative overflow-hidden">
          {/* Gold glow on hover */}
          <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(184,134,11,0.15), transparent, rgba(184,134,11,0.15))' }} />

          {/* Image container */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, var(--bg-secondary), var(--gold-light))' }} />
            {product.images[0] ? (
              <Image
                src={getImageUrl(product.images[0])}
                alt={`${product.name} - পাঁচমিশালি`}
                fill
                className="object-cover transition-transform duration-500 sm:duration-700 group-hover:scale-105 sm:group-hover:scale-110"
                sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--text-muted)', opacity: 0.3 }}>
                <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            )}

            {/* Discount badge */}
            {hasDiscount && (
              <div className="badge-discount text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 sm:py-1.5">
                {product.discountPercent}% OFF
              </div>
            )}

            {/* Out of stock overlay */}
            {outOfStock && (
              <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm" style={{ background: 'rgba(45,27,34,0.7)' }}>
                <span className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold font-bengali text-white" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>স্টক শেষ</span>
              </div>
            )}

            {/* Hover overlay with buttons - hidden on mobile, shown on hover */}
            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out p-3 sm:p-4 hidden sm:block">
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className="w-full py-2.5 sm:py-3 rounded-xl font-bengali font-semibold text-xs sm:text-sm text-white backdrop-blur-md transition-all duration-300 disabled:opacity-50"
                style={{ background: 'rgba(107,31,53,0.9)', border: '1px solid rgba(184,134,11,0.3)' }}
              >
                কার্টে যোগ করুন
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 relative">
            <p className="text-[9px] sm:text-[10px] tracking-[1.5px] sm:tracking-[2px] uppercase mb-1 sm:mb-1.5 font-bengali" style={{ color: 'var(--sakura)' }}>{product.category}</p>
            <h3 className="font-display text-[13px] sm:text-[15px] font-medium mb-1.5 sm:mb-2 line-clamp-1 group-hover:text-accent transition-colors duration-300" style={{ color: 'var(--text-primary)' }}>{product.name}</h3>

            <div className="flex items-center gap-2">
              <span className="font-display text-base sm:text-lg font-bold" style={{ color: 'var(--gold)' }}>৳{finalPrice.toFixed(0)}</span>
              {hasDiscount && <span className="text-xs sm:text-sm line-through" style={{ color: 'var(--text-muted)' }}>৳{product.price}</span>}
            </div>

            <div className="mt-1.5 sm:mt-2 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${outOfStock ? 'bg-red-400' : 'bg-green-400'}`} />
              <span className={`text-[10px] sm:text-[11px] font-bengali ${outOfStock ? 'text-red-400' : 'text-green-500'}`}>
                {outOfStock ? 'স্টক শেষ' : 'স্টক আছে'}
              </span>
            </div>

            {/* Mobile add to cart button */}
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="sm:hidden w-full mt-2.5 py-2 rounded-lg font-bengali font-semibold text-xs text-white transition-all duration-300 disabled:opacity-50"
              style={{ background: 'var(--rose)' }}
            >
              কার্টে যোগ করুন
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default React.memo(ProductCard);
