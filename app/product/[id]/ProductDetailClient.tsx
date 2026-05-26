'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product, getFinalPrice } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { getImageUrl } from '@/lib/image-url';
import type { SiteSettings } from '@/lib/schemas';

export default function ProductDetailClient({ product, settings }: { product: Product; settings: SiteSettings }) {
  const { addItem } = useCart();
  const finalPrice = getFinalPrice(product);
  const hasDiscount = product.discountPercent > 0;
  const outOfStock = !product.inStock || product.stock === 0;

  const handleAddToCart = () => {
    if (outOfStock) return;
    addItem({
      productId: product.id, productName: product.name, price: product.price,
      discountPercent: product.discountPercent, quantity: 1,
      image: product.images[0], category: product.category,
    });
  };

  return (
    <div style={{ background: 'var(--bg-primary)' }} className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Breadcrumb */}
        <nav className="text-xs sm:text-sm mb-4 sm:mb-8 font-bengali" style={{ color: 'var(--text-muted)' }}>
          <ol className="flex items-center gap-1.5 sm:gap-2">
            <li><Link href="/" className="hover:opacity-80 transition-colors">হোম</Link></li>
            <li>/</li>
            <li><Link href="/shop" className="hover:opacity-80 transition-colors">শপ</Link></li>
            <li>/</li>
            <li style={{ color: 'var(--text-primary)' }}>{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-[3/4] sm:aspect-square lg:aspect-[3/4] rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--bg-secondary), var(--gold-light))', boxShadow: 'var(--shadow-lg)' }}>
              {product.images[0] ? (
                <Image src={getImageUrl(product.images[0])} alt={`${product.name} - ${settings.siteName}`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--text-muted)', opacity: 0.3 }}>
                  <svg className="w-16 h-16 sm:w-24 sm:h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              )}
              {hasDiscount && (
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold text-white" style={{ background: 'var(--rose)' }}>
                  {product.discountPercent}% OFF
                </div>
              )}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <span className="text-xs sm:text-sm tracking-[2px] sm:tracking-[3px] uppercase font-serif-it mb-2 sm:mb-3" style={{ color: 'var(--sakura)' }}>{product.category}</span>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bengali font-bold mb-3 sm:mb-4 leading-tight" style={{ color: 'var(--rose)' }}>{product.name}</h1>

            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 flex-wrap">
              <span className="font-display text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: 'var(--gold)' }}>৳{finalPrice.toFixed(0)}</span>
              {hasDiscount && (
                <>
                  <span className="text-base sm:text-xl line-through" style={{ color: 'var(--text-muted)' }}>৳{product.price}</span>
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold font-bengali" style={{ background: 'rgba(45,106,79,0.1)', color: '#2D6A4F' }}>৳{(product.price - finalPrice).toFixed(0)} সাশ্রয়</span>
                </>
              )}
            </div>

            <div className="mb-4 sm:mb-6">
              <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bengali" style={{ background: outOfStock ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', color: outOfStock ? '#ef4444' : '#22c55e' }}>
                <span className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${outOfStock ? 'bg-red-400' : 'bg-green-400'}`} />
                {outOfStock ? 'স্টক শেষ' : `স্টকে আছে (${product.stock} টি)`}
              </span>
            </div>

            <div className="mb-6 sm:mb-8">
              <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-bengali" style={{ color: 'var(--text-secondary)' }}>
                {product.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className="group relative px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bengali font-bold text-white text-base sm:text-lg overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                style={{ background: 'var(--rose)', boxShadow: 'var(--shadow-lg)' }}
              >
                <span className="relative z-10">{outOfStock ? 'স্টক শেষ' : 'কার্টে যোগ করুন'}</span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </div>

            {settings.messengerUrl && (
              <a href={settings.messengerUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 sm:mt-4 text-xs sm:text-sm font-bengali transition-colors" style={{ color: 'var(--sakura-dark)' }}>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.936 1.525 5.54 3.89 7.124v3.893l3.574-1.956C10.47 20.68 11.22 20.8 12 20.8c5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.09 12.426l-2.55-2.727-4.99 2.727 5.47-5.81 2.61 2.727 4.93-2.727-5.47 5.81z"/></svg>
                পণ্য সম্পর্কে জানতে Messenger-এ যোগাযোগ
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
