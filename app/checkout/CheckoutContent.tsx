'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { getFinalPrice } from '@/types/product';
import { DIVISIONS, DISTRICTS_BY_DIVISION } from '@/types/order';
import { getImageUrl } from '@/lib/image-url';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<{ bkashNumber?: string; deliveryCharge?: number; freeDeliveryThreshold?: number }>({});

  const promoCode = searchParams.get('promo') || '';
  const promoDiscount = Number(searchParams.get('discount')) || 0;

  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', division: '', district: '', address: '', deliveryNote: '', bkashTxId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const deliveryCharge = total >= (settings.freeDeliveryThreshold || 1500) ? 0 : (settings.deliveryCharge || 120);
  const discountAmount = total * promoDiscount / 100;
  const grandTotal = total - discountAmount + deliveryCharge;

  const districts = form.division ? DISTRICTS_BY_DIVISION[form.division] || [] : [];

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(setSettings).catch(() => {});
  }, []);

  useEffect(() => {
    if (state.items.length === 0 && !loading) router.push('/cart');
  }, [state.items.length, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value, ...(name === 'division' ? { district: '' } : {}) }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.fullName || form.fullName.length < 2) e.fullName = 'নাম দিন';
    if (!form.phone || !/^01[3-9]\d{8}$/.test(form.phone)) e.phone = 'সঠিক ফোন নম্বর দিন';
    if (!form.division) e.division = 'বিভাগ বাছুন';
    if (!form.district) e.district = 'জেলা বাছুন';
    if (!form.address || form.address.length < 5) e.address = 'সম্পূর্ণ ঠিকানা দিন';
    if (!form.bkashTxId || form.bkashTxId.length < 10) e.bkashTxId = 'Transaction ID দিন';
    if (form.bkashTxId && !/^[A-Z0-9]+$/.test(form.bkashTxId)) e.bkashTxId = 'শুধু বড় হাতের অক্ষর ও সংখ্যা';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { fullName: form.fullName, phone: form.phone, email: form.email || undefined, division: form.division, district: form.district, address: form.address, deliveryNote: form.deliveryNote || undefined },
          items: state.items.map(i => ({ productId: i.productId, productName: i.productName, price: i.price, discountPercent: i.discountPercent, quantity: i.quantity, image: i.image })),
          subtotal: total, discount: discountAmount, deliveryCharge, promoCode: promoCode || undefined, promoDiscount: promoDiscount || undefined, grandTotal, bkashTxId: form.bkashTxId.toUpperCase(),
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'অর্ডার ব্যর্থ'); }
      const { orderId } = await res.json();
      clearCart();
      toast.success('✅ অর্ডার সম্পন্ন! শীঘ্রই ফোনে কনফার্ম করা হবে।');
      router.push(`/order-confirmation/${orderId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'অর্ডার ব্যর্থ');
    } finally { setLoading(false); }
  };

  if (state.items.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bengali font-semibold text-deep-rose mb-8">চেকআউট</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-bengali font-semibold text-deep-rose mb-6">ডেলিভারি তথ্য</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1 font-bengali">পুরো নাম *</label>
                  <input name="fullName" value={form.fullName} onChange={handleChange} className={`input-field ${errors.fullName ? 'border-red-400' : ''}`} placeholder="আপনার নাম" />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1 font-bengali">মোবাইল নম্বর *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className={`input-field ${errors.phone ? 'border-red-400' : ''}`} placeholder="01XXXXXXXXX" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1 font-bengali">ইমেইল (ঐচ্ছিক)</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field" placeholder="your@email.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1 font-bengali">বিভাগ *</label>
                    <select name="division" value={form.division} onChange={handleChange} className={`input-field ${errors.division ? 'border-red-400' : ''}`}>
                      <option value="">বাছুন</option>
                      {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {errors.division && <p className="text-red-500 text-xs mt-1">{errors.division}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1 font-bengali">জেলা *</label>
                    <select name="district" value={form.district} onChange={handleChange} className={`input-field ${errors.district ? 'border-red-400' : ''}`} disabled={!form.division}>
                      <option value="">বাছুন</option>
                      {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1 font-bengali">সম্পূর্ণ ঠিকানা *</label>
                  <textarea name="address" value={form.address} onChange={handleChange} rows={3} className={`input-field ${errors.address ? 'border-red-400' : ''}`} placeholder="বাসা নং, রোড, এলাকা..." />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1 font-bengali">ডেলিভারি নোট (ঐচ্ছিক)</label>
                  <textarea name="deliveryNote" value={form.deliveryNote} onChange={handleChange} rows={2} className="input-field" placeholder="কোনো বিশেষ নির্দেশনা..." />
                </div>
              </div>
            </div>

            {/* bKash Card */}
            <div className="rounded-2xl p-6 text-white" style={{ backgroundColor: '#E2136E' }}>
              <div className="flex items-center gap-3 mb-4">
                <svg viewBox="0 0 80 30" className="h-7 w-auto"><rect width="80" height="30" rx="4" fill="white" /><text x="40" y="20" textAnchor="middle" fill="#E2136E" fontWeight="bold" fontSize="16" fontFamily="Arial">bKash</text></svg>
                <h2 className="text-xl font-bengali font-semibold">bKash পেমেন্ট</h2>
              </div>
              <div className="bg-white/20 rounded-xl p-4 mb-4">
                <p className="text-sm mb-1 font-bengali">পেমেন্ট পাঠান:</p>
                <p className="text-2xl font-bold">{settings.bkashNumber || '01XXXXXXXXX'}</p>
                <p className="text-xs mt-1 opacity-90 font-bengali">Send Money অথবা Payment করুন, তারপর Transaction ID দিন</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 font-bengali">bKash Transaction ID *</label>
                <input name="bkashTxId" value={form.bkashTxId} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl text-ink bg-white ${errors.bkashTxId ? 'border-2 border-red-300' : ''}`} placeholder="Transaction ID লিখুন" />
                {errors.bkashTxId && <p className="text-red-200 text-xs mt-1">{errors.bkashTxId}</p>}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bengali font-semibold text-deep-rose mb-4">অর্ডার সামারি</h2>
              <div className="space-y-3 mb-6">
                {state.items.map(item => {
                  const fp = getFinalPrice({ price: item.price, discountPercent: item.discountPercent });
                  return (
                    <div key={item.productId} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ background: 'linear-gradient(135deg, #FAE8F1, #F5ECD4)' }}>
                        {item.image ? <Image src={getImageUrl(item.image)} alt={item.productName} fill className="object-cover" sizes="64px" /> : (
                          <div className="w-full h-full flex items-center justify-center text-sakura-400/40"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate font-bengali text-ink">{item.productName}</p><p className="text-xs text-sakura-400">×{item.quantity}</p></div>
                      <span className="text-sm font-display font-bold text-gold-primary">৳{(fp * item.quantity).toFixed(0)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-sakura-200/40 pt-4 space-y-2 text-sm">
                <div className="flex justify-between font-bengali"><span className="text-sakura-400">সাবটোটাল</span><span className="text-ink">৳{total.toFixed(0)}</span></div>
                {promoDiscount > 0 && <div className="flex justify-between text-green-600 font-bengali"><span>প্রোমো ({promoCode})</span><span>−৳{discountAmount.toFixed(0)}</span></div>}
                <div className="flex justify-between font-bengali"><span className="text-sakura-400">ডেলিভারি</span><span className="text-ink">{deliveryCharge === 0 ? <span className="text-green-600">ফ্রি</span> : `৳${deliveryCharge}`}</span></div>
                <div className="border-t border-sakura-200/40 pt-2 flex justify-between font-bold text-lg"><span className="font-bengali text-ink">সর্বমোট</span><span className="font-display text-gold-primary">৳{grandTotal.toFixed(0)}</span></div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full mt-6 text-lg py-4">
                {loading ? 'অর্ডার হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}
              </button>
              <Link href="/cart" className="block text-center text-sm text-sakura-400 hover:text-sakura-600 mt-3 font-bengali transition-colors">← কার্টে ফিরে যান</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
