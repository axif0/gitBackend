'use client';

import { useCart } from '@/contexts/CartContext';
import { getFinalPrice } from '@/types/product';
import { getImageUrl } from '@/lib/image-url';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

const PROMO_CODES: Record<string, number> = { 'PACHMISHALI10': 10, 'WELCOME15': 15 };

export default function CartPage() {
  const { state, removeItem, updateQuantity, total } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState('');

  const deliveryCharge = total >= 1500 ? 0 : 120;
  const discountAmount = total * promoDiscount / 100;
  const grandTotal = total - discountAmount + deliveryCharge;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setPromoDiscount(PROMO_CODES[code]);
      setAppliedPromo(code);
      toast.success(`প্রোমো কোড প্রয়োগ হয়েছে! ${PROMO_CODES[code]}% ছাড়`);
    } else {
      toast.error('ভুল প্রোমো কোড');
      setPromoDiscount(0);
      setAppliedPromo('');
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4 font-bangla">আপনার কার্ট খালি</h1>
        <p className="text-gray-500 mb-8 font-bangla">সুন্দর গহনা দিয়ে কার্ট ভরুন!</p>
        <Link href="/shop" className="btn-primary">শপ করুন</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-bangla">শপিং কার্ট</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {state.items.map(item => {
            const finalPrice = getFinalPrice({ price: item.price, discountPercent: item.discountPercent });
            return (
              <div key={item.productId} className="card p-4 flex gap-4">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {item.image ? <Image src={getImageUrl(item.image)} alt={item.productName} fill className="object-cover" sizes="96px" /> : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate font-bangla">{item.productName}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-gold-700">৳{finalPrice.toFixed(0)}</span>
                    {item.discountPercent > 0 && <span className="text-sm text-gray-400 line-through">৳{item.price}</span>}
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(item.productId)} className="text-gray-400 hover:text-red-500" aria-label="মুছুন">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100">−</button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100">+</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4 font-bangla">অর্ডার সামারি</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">সাবটোটাল</span><span>৳{total.toFixed(0)}</span></div>
              {promoDiscount > 0 && <div className="flex justify-between text-green-600"><span>প্রোমো ({appliedPromo})</span><span>−৳{discountAmount.toFixed(0)}</span></div>}
              <div className="flex justify-between"><span className="text-gray-500">ডেলিভারি</span><span>{deliveryCharge === 0 ? <span className="text-green-600">ফ্রি</span> : `৳${deliveryCharge}`}</span></div>
              {deliveryCharge > 0 && <p className="text-xs text-gray-400">৳১,৫০০+ অর্ডারে ফ্রি ডেলিভারি</p>}
              <div className="border-t pt-3 flex justify-between font-bold text-lg"><span>মোট</span><span className="text-gold-700">৳{grandTotal.toFixed(0)}</span></div>
            </div>
            <div className="mt-4 flex gap-2">
              <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="প্রোমো কোড" className="input-field text-sm flex-1" />
              <button onClick={handleApplyPromo} className="btn-secondary text-sm px-4">প্রয়োগ</button>
            </div>
            <Link href={`/checkout?promo=${appliedPromo}&discount=${promoDiscount}`} className="btn-primary w-full text-center mt-6 block">অর্ডার করুন</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
