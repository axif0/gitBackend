'use client';

import Image from 'next/image';
import Link from 'next/link';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 mb-8 font-bangla" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-gold-600">হোম</Link></li>
          <li>/</li>
          <li><Link href="/shop" className="hover:text-gold-600">শপ</Link></li>
          <li>/</li>
          <li className="text-gray-900">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
          {product.images[0] ? (
            <Image src={getImageUrl(product.images[0])} alt={`${product.name} - ${settings.siteName}`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
          )}
          {hasDiscount && <span className="absolute top-4 left-4 bg-gold-700 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-md">{product.discountPercent}% OFF</span>}
        </div>

        <div>
          <p className="text-sm text-gold-600 uppercase tracking-wider mb-2 font-medium">{product.category}</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-bangla">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-gold-700">৳{finalPrice.toFixed(0)}</span>
            {hasDiscount && (
              <>
                <span className="text-xl text-gray-400 line-through">৳{product.price}</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">৳{(product.price - finalPrice).toFixed(0)} সাশ্রয়</span>
              </>
            )}
          </div>

          <div className="mb-6">
            <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium ${outOfStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {outOfStock ? 'স্টক শেষ' : `স্টকে আছে (${product.stock} টি)`}
            </span>
          </div>

          <div className="prose prose-gray mb-8">
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap font-bangla">{product.description}</p>
          </div>

          <button onClick={handleAddToCart} disabled={outOfStock} className="btn-primary w-full sm:w-auto text-lg px-12 py-4">
            {outOfStock ? 'স্টক শেষ' : 'কার্টে যোগ করুন'}
          </button>

          {settings.messengerUrl && (
            <a href={settings.messengerUrl} target="_blank" rel="noopener noreferrer" className="block mt-4 text-sm text-blue-600 hover:underline">
              💬 পণ্য সম্পর্কে জানতে Messenger-এ যোগাযোগ করুন
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
