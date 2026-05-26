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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link href={`/product/${product.slug || product.id}`} className="group block">
        <div className="relative rounded-2xl overflow-hidden transition-all duration-500 group-hover:-translate-y-2" style={{ background: '#FEFAF5', border: '1px solid rgba(212,116,141,0.12)', boxShadow: '0 4px 20px rgba(160,56,79,0.05)' }}>
          {/* Gold glow on hover */}
          <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(184,134,11,0.15), transparent, rgba(184,134,11,0.15))' }} />

          {/* Image container */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #FAE8F1, #F5ECD4)' }} />
            {product.images[0] ? (
              <Image
                src={getImageUrl(product.images[0])}
                alt={`${product.name} - পাঁচমিশালি`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sakura-400/30">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            )}

            {/* Shine sweep */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)', transform: 'translateX(-100%)', animation: 'none' }} />
            <div className="absolute inset-0 shine-sweep opacity-0 group-hover:opacity-100 pointer-events-none" />

            {/* Discount badge */}
            {hasDiscount && (
              <div className="absolute top-0 left-0 px-3 py-1.5 rounded-br-xl text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #6B1F35, #A0384F)' }}>
                {product.discountPercent}% OFF
              </div>
            )}

            {/* Out of stock overlay */}
            {outOfStock && (
              <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm" style={{ background: 'rgba(45,27,34,0.7)' }}>
                <span className="px-5 py-2 rounded-full text-sm font-semibold font-bengali text-white" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>স্টক শেষ</span>
              </div>
            )}

            {/* Hover overlay with buttons */}
            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out p-4">
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className="w-full py-3 rounded-xl font-bengali font-semibold text-sm text-white backdrop-blur-md transition-all duration-300 disabled:opacity-50"
                style={{ background: 'rgba(107,31,53,0.9)', border: '1px solid rgba(184,134,11,0.3)' }}
              >
                কার্টে যোগ করুন
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 relative">
            <p className="text-[10px] tracking-[2px] uppercase mb-1.5 font-bengali" style={{ color: '#D4748D' }}>{product.category}</p>
            <h3 className="font-display text-[15px] font-medium text-ink mb-2 line-clamp-1 group-hover:text-sakura-600 transition-colors duration-300">{product.name}</h3>

            <div className="flex items-center gap-2.5">
              <span className="font-display text-xl font-bold" style={{ color: '#B8860B' }}>৳{finalPrice.toFixed(0)}</span>
              {hasDiscount && <span className="text-sm line-through" style={{ color: '#D4748D' }}>৳{product.price}</span>}
            </div>

            <div className="mt-2.5 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${outOfStock ? 'bg-red-400' : 'bg-green-400'}`} />
              <span className={`text-[11px] font-bengali ${outOfStock ? 'text-red-400' : 'text-green-500'}`}>
                {outOfStock ? 'স্টক শেষ' : 'স্টক আছে'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default React.memo(ProductCard);
