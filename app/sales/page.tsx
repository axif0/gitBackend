import { getOrders } from '@/lib/github';
import { getFinalPrice } from '@/types/product';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'সেলস রিপোর্ট | পাঁচমিশালি',
  description: 'অর্ডার ও বিক্রয়ের সারসংক্ষেপ',
};

export default async function SalesPage() {
  const orders = await getOrders();
  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => o.status !== 'cancelled');
  const totalRevenue = activeOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / activeOrders.length || 0 : 0;
  const confirmedRate = totalOrders > 0 ? (orders.filter(o => ['confirmed', 'shipped', 'delivered'].includes(o.status)).length / totalOrders * 100) : 0;

  const topProducts: Record<string, { name: string; quantity: number; revenue: number }> = {};
  for (const order of activeOrders) {
    for (const item of order.items) {
      if (!topProducts[item.productId]) topProducts[item.productId] = { name: item.productName, quantity: 0, revenue: 0 };
      topProducts[item.productId].quantity += item.quantity;
      topProducts[item.productId].revenue += getFinalPrice(item) * item.quantity;
    }
  }
  const top5 = Object.values(topProducts).sort((a, b) => b.quantity - a.quantity).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 font-bangla">সেলস রিপোর্ট</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-5"><p className="text-sm text-gray-500 font-bangla">মোট অর্ডার</p><p className="text-2xl font-bold text-gold-700">{totalOrders}</p></div>
        <div className="card p-5"><p className="text-sm text-gray-500 font-bangla">মোট আয়</p><p className="text-2xl font-bold text-green-700">৳{totalRevenue.toLocaleString()}</p></div>
        <div className="card p-5"><p className="text-sm text-gray-500 font-bangla">গড় অর্ডার মূল্য</p><p className="text-2xl font-bold text-blue-700">৳{avgOrderValue.toFixed(0)}</p></div>
        <div className="card p-5"><p className="text-sm text-gray-500 font-bangla">কনফার্ম রেট</p><p className="text-2xl font-bold text-purple-700">{confirmedRate.toFixed(1)}%</p></div>
      </div>

      {top5.length > 0 && (
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 font-bangla">টপ ৫ সেলিং পণ্য</h2>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">পণ্য</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">বিক্রি</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">আয়</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {top5.map((p, i) => (
                <tr key={i}><td className="px-4 py-3 text-sm">{i + 1}</td><td className="px-4 py-3 text-sm font-bangla">{p.name}</td><td className="px-4 py-3 text-sm text-right">{p.quantity}টি</td><td className="px-4 py-3 text-sm text-right font-medium">৳{p.revenue.toFixed(0)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">তারিখ</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">অর্ডার আইডি</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">কাস্টমার</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">মোট</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-bangla">কোনো অর্ডার নেই</td></tr>
              ) : orders.slice().reverse().map(o => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{new Date(o.createdAt).toLocaleDateString('bn-BD')}</td>
                  <td className="px-6 py-4 text-xs font-mono">{o.id}</td>
                  <td className="px-6 py-4 text-sm font-bangla">{o.customer.fullName}</td>
                  <td className="px-6 py-4 text-sm text-right font-medium">৳{o.grandTotal.toFixed(0)}</td>
                  <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${o.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : o.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : o.status === 'shipped' ? 'bg-purple-100 text-purple-700' : o.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
