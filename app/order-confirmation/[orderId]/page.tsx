import { getOrders } from '@/lib/github';
import { getSettings } from '@/lib/settings';
import { getFinalPrice } from '@/types/product';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function OrderConfirmationPage({ params }: { params: { orderId: string } }) {
  const [orders, settings] = await Promise.all([getOrders(), getSettings()]);
  const order = orders.find(o => o.id === params.orderId);
  if (!order) return notFound();

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
  };
  const statusLabels: Record<string, string> = {
    pending: '⏳ পেন্ডিং', confirmed: '✅ কনফার্মড', shipped: '🚚 শিপড', delivered: '📦 ডেলিভারড', cancelled: '❌ বাতিল',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="text-3xl font-bold mb-2 font-bangla">অর্ডার সম্পন্ন!</h1>
        <p className="text-gray-500 font-bangla">ধন্যবাদ! শীঘ্রই ফোনে কনফার্ম করা হবে।</p>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-500">অর্ডার আইডি</p>
            <p className="font-mono font-bold">{order.id}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
        </div>
        <div className="border-t pt-4 mb-4">
          <h2 className="font-semibold mb-2 font-bangla">পণ্যসমূহ</h2>
          {order.items.map((item, i) => {
            const fp = getFinalPrice(item);
            return (
              <div key={i} className="flex justify-between py-2 text-sm">
                <span className="font-bangla">{item.productName} ×{item.quantity}</span>
                <span>৳{(fp * item.quantity).toFixed(0)}</span>
              </div>
            );
          })}
        </div>
        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">সাবটোটাল</span><span>৳{order.subtotal.toFixed(0)}</span></div>
          {order.promoDiscount && order.promoDiscount > 0 && <div className="flex justify-between text-green-600"><span>প্রোমো</span><span>−৳{(order.subtotal * order.promoDiscount / 100).toFixed(0)}</span></div>}
          <div className="flex justify-between"><span className="text-gray-500">ডেলিভারি</span><span>{order.deliveryCharge === 0 ? 'ফ্রি' : `৳${order.deliveryCharge}`}</span></div>
          <div className="border-t pt-2 flex justify-between font-bold text-lg"><span>সর্বমোট</span><span className="text-gold-700">৳{order.grandTotal.toFixed(0)}</span></div>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="font-semibold mb-3 font-bangla">ডেলিভারি তথ্য</h2>
        <div className="text-sm space-y-1 font-bangla">
          <p><span className="text-gray-500">নাম:</span> {order.customer.fullName}</p>
          <p><span className="text-gray-500">ফোন:</span> {order.customer.phone}</p>
          <p><span className="text-gray-500">ঠিকানা:</span> {order.customer.address}, {order.customer.district}, {order.customer.division}</p>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="font-semibold mb-3 font-bangla">পেমেন্ট</h2>
        <div className="text-sm space-y-1">
          <p><span className="text-gray-500">মাধ্যম:</span> bKash</p>
          <p><span className="text-gray-500">Transaction ID:</span> {order.bkashTxId}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/shop" className="btn-primary text-center">আরো কেনাকাটা করুন</Link>
        {settings.messengerUrl && (
          <a href={settings.messengerUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-center">
            💬 কোনো সমস্যা? Messenger-এ যোগাযোগ
          </a>
        )}
      </div>
    </div>
  );
}
