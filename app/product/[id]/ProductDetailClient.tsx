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
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #FDF6F9 0%, #FEFAF5 50%, #F5ECD4 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-sakura-400 mb-8 font-bengali">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-sakura-600 transition-colors">হোম</Link></li>
            <li className="text-sakura-200">/</li>
            <li><Link href="/shop" className="hover:text-sakura-600 transition-colors">শপ</Link></li>
            <li className="text-sakura-200">/</li>
            <li className="text-ink">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #FAE8F1, #F5ECD4)', boxShadow: '0 20px 60px rgba(160,56,79,0.12)' }}>
              {product.images[0] ? (
                <Image src={getImageUrl(product.images[0])} alt={`${product.name} - ${settings.siteName}`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sakura-400/30">
                  <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              )}
              {hasDiscount && (
                <div className="absolute top-4 left-4 px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #6B1F35, #A0384F)' }}>
                  {product.discountPercent}% OFF
                </div>
              )}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <span className="text-sm tracking-[3px] uppercase font-serif-it mb-3" style={{ color: '#D4748D' }}>{product.category}</span>

            <h1 className="text-3xl sm:text-4xl font-bengali font-bold text-deep-rose mb-4 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="font-display text-4xl font-bold" style={{ color: '#B8860B' }}>৳{finalPrice.toFixed(0)}</span>
              {hasDiscount && (
                <>
                  <span className="text-xl line-through" style={{ color: '#D4748D' }}>৳{product.price}</span>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold font-bengali" style={{ background: 'rgba(45,106,79,0.1)', color: '#2D6A4F' }}>৳{(product.price - finalPrice).toFixed(0)} সাশ্রয়</span>
                </>
              )}
            </div>

            <div className="mb-6">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bengali ${outOfStock ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                <span className={`w-2 h-2 rounded-full ${outOfStock ? 'bg-red-400' : 'bg-green-400'}`} />
                {outOfStock ? 'স্টক শেষ' : `স্টকে আছে (${product.stock} টি)`}
              </span>
            </div>

            <div className="prose prose-gray mb-8">
              <p className="text-ink/70 leading-relaxed whitespace-pre-wrap font-bengali text-base">{product.description}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className="group relative px-10 py-4 rounded-full font-bengali font-bold text-white text-lg overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                style={{ background: 'linear-gradient(135deg, #6B1F35, #A0384F)', boxShadow: '0 8px 30px rgba(107,31,53,0.3)' }}
              >
                <span className="relative z-10">{outOfStock ? 'স্টক শেষ' : 'কার্টে যোগ করুন'}</span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </div>

            {settings.messengerUrl && (
              <a href={settings.messengerUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-sm font-bengali text-sakura-600 hover:text-sakura-400 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.936 1.525 5.54 3.89 7.124v3.893l3.574-1.956C10.47 20.68 11.22 20.8 12 20.8c5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.09 12.426l-2.55-2.727-4.99 2.727 5.47-5.81 2.61 2.727 4.93-2.727-5.47 5.81z"/></svg>
                পণ্য সম্পর্কে জানতে Messenger-এ যোগাযোগ
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
