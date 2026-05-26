'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Order, OrderStatus } from '@/types/order';
import toast, { Toaster } from 'react-hot-toast';

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };
const STATUS_LABELS: Record<string, string> = { pending: 'পেন্ডিং', confirmed: 'কনফার্মড', shipped: 'শিপড', delivered: 'ডেলিভারড', cancelled: 'বাতিল' };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [csrfToken, setCsrfToken] = useState('');
  const perPage = 20;

  const fetchOrders = useCallback(async () => {
    try { const res = await fetch('/api/orders'); if (res.ok) setOrders(await res.json()); } catch { toast.error('লোড ব্যর্থ'); } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetch('/api/admin/csrf').then(r => r.json()).then(d => { if (d.csrfToken) setCsrfToken(d.csrfToken); }).catch(() => {});
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const prev = orders;
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken }, body: JSON.stringify({ status: newStatus }) });
      if (!res.ok) throw new Error('Update failed');
      toast.success('স্ট্যাটাস আপডেট হয়েছে');
    } catch { setOrders(prev); toast.error('আপডেট ব্যর্থ'); }
  };

  const filtered = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search) { const q = search.toLowerCase(); return o.customer.fullName.toLowerCase().includes(q) || o.customer.phone.includes(q) || o.bkashTxId.toLowerCase().includes(q) || o.id.toLowerCase().includes(q); }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="max-w-7xl mx-auto">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-8 font-bangla">অর্ডার ম্যানেজমেন্ট</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="নাম, ফোন, TxID দিয়ে খুঁজুন..." className="input-field flex-1" />
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input-field w-auto">
          <option value="all">সব স্ট্যাটাস</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">অর্ডার আইডি</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">কাস্টমার</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ফোন</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">জেলা</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">পণ্য</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">মোট</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">bKash TxID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">স্ট্যাটাস</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">তারিখ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? Array.from({ length: 5 }).map((_, i) => <tr key={i}>{Array.from({ length: 9 }).map((_, j) => <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td>)}</tr>) :
              paginated.length === 0 ? <tr><td colSpan={9} className="px-4 py-12 text-center text-gray-500 font-bangla">কোনো অর্ডার নেই</td></tr> :
              paginated.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-mono text-xs">{order.id}</td>
                  <td className="px-4 py-4 text-sm font-bangla">{order.customer.fullName}</td>
                  <td className="px-4 py-4 text-sm">{order.customer.phone}</td>
                  <td className="px-4 py-4 text-sm font-bangla">{order.customer.district}</td>
                  <td className="px-4 py-4 text-sm text-center">{order.items.length}</td>
                  <td className="px-4 py-4 text-sm text-right font-medium">৳{order.grandTotal.toFixed(0)}</td>
                  <td className="px-4 py-4 text-xs font-mono">{order.bkashTxId}</td>
                  <td className="px-4 py-4">
                    <select value={order.status} onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)} className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${STATUS_COLORS[order.status]}`}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('bn-BD')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-gold-600 text-white' : 'bg-white border hover:bg-gray-50'}`}>{i + 1}</button>)}
        </div>
      )}
    </div>
  );
}
