'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Product, getFinalPrice } from '@/types/product';
import type { Order } from '@/types/order';
import dynamic from 'next/dynamic';
import toast, { Toaster } from 'react-hot-toast';

const ProductForm = dynamic(() => import('@/components/ProductForm'), { loading: () => <div className="h-96 skeleton rounded-2xl" />, ssr: false });
const ConfirmModal = dynamic(() => import('@/components/ConfirmModal'), { ssr: false });

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; ids: string[] }>({ show: false, ids: [] });
  const [csrfToken, setCsrfToken] = useState('');
  const perPage = 10;

  const fetchData = useCallback(async () => {
    try {
      const [pRes, oRes] = await Promise.all([fetch('/api/admin/products'), fetch('/api/orders')]);
      if (pRes.ok) setProducts(await pRes.json());
      if (oRes.ok) setOrders(await oRes.json());
    } catch { toast.error('ডাটা লোড ব্যর্থ'); } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchData();
    fetch('/api/admin/csrf').then(r => r.json()).then(d => { if (d.csrfToken) setCsrfToken(d.csrfToken); }).catch(() => {});
  }, [fetchData]);

  const analytics = useMemo(() => ({
    totalProducts: products.length,
    totalRevenue: orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.grandTotal, 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    outOfStock: products.filter(p => p.stock === 0).length,
  }), [products, orders]);

  const filtered = useMemo(() => products.filter(p => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (search) { const q = search.toLowerCase(); return p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q); }
    return true;
  }), [products, categoryFilter, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleUploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const res = await fetch('/api/admin/upload', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken }, body: JSON.stringify({ filename: `${Date.now()}-${file.name}`, data: reader.result }) });
          if (res.ok) { const { path } = await res.json(); resolve(path); } else reject(new Error('Upload failed'));
        } catch (err) { reject(err); }
      };
      reader.onerror = reject; reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (product: Product, imageFile?: File | null, isEdit?: boolean) => {
    try {
      let images = product.images;
      if (imageFile) { const path = await handleUploadImage(imageFile); images = [path]; }
      const payload = { ...product, images };
      const editMode = isEdit ?? editing !== null;
      setProducts(editMode ? products.map(p => p.id === product.id ? payload : p) : [...products, payload]);
      setShowForm(false); setEditing(null);
      const res = await fetch('/api/admin/products', { method: editMode ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      toast.success(editMode ? 'পণ্য আপডেট হয়েছে!' : 'পণ্য যোগ হয়েছে!');
    } catch (err) { toast.error(err instanceof Error ? err.message : 'সংরক্ষণ ব্যর্থ'); fetchData(); }
  };

  const confirmDelete = async () => {
    const ids = deleteModal.ids; const prev = products;
    setProducts(products.filter(p => !ids.includes(p.id))); setSelectedIds([]); setDeleteModal({ show: false, ids: [] });
    try {
      const res = await fetch('/api/admin/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken }, body: JSON.stringify({ ids }) });
      if (!res.ok) throw new Error('Delete failed');
      toast.success(`${ids.length}টি পণ্য মুছে ফেলা হয়েছে`);
    } catch { setProducts(prev); toast.error('মুছে ফেলা ব্যর্থ'); }
  };

  const handleDuplicate = async (product: Product) => {
    await handleSubmit({ ...product, id: `${product.id}-copy-${Date.now()}`, slug: `${product.slug}-copy`, name: `কপি - ${product.name}`, createdAt: new Date().toISOString() }, null, false);
  };

  const togglePublished = async (product: Product) => {
    const updated = { ...product, isPublished: !product.isPublished };
    setProducts(products.map(p => p.id === product.id ? updated : p));
    try {
      const res = await fetch('/api/admin/products', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken }, body: JSON.stringify(updated) });
      if (!res.ok) throw new Error('Update failed');
      toast.success(updated.isPublished ? 'প্রকাশিত' : 'অপ্রকাশিত');
    } catch { setProducts(products); toast.error('আপডেট ব্যর্থ'); }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-bengali" style={{ color: 'var(--text-primary)' }}>ড্যাশবোর্ড</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); }} className="btn-primary">+ পণ্য যোগ</button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-5"><p className="text-sm font-bengali" style={{ color: 'var(--text-muted)' }}>মোট পণ্য</p><p className="text-2xl font-bold" style={{ color: 'var(--gold)' }}>{analytics.totalProducts}</p></div>
        <div className="card p-5"><p className="text-sm font-bengali" style={{ color: 'var(--text-muted)' }}>মোট আয়</p><p className="text-2xl font-bold text-green-500">৳{analytics.totalRevenue.toLocaleString()}</p></div>
        <div className="card p-5"><p className="text-sm font-bengali" style={{ color: 'var(--text-muted)' }}>পেন্ডিং অর্ডার</p><p className="text-2xl font-bold text-yellow-500">{analytics.pendingOrders}</p></div>
        <div className="card p-5"><p className="text-sm font-bengali" style={{ color: 'var(--text-muted)' }}>স্টক শেষ</p><p className="text-2xl font-bold text-red-500">{analytics.outOfStock}</p></div>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 font-bengali" style={{ color: 'var(--text-primary)' }}>{editing ? 'পণ্য আপডেট' : 'নতুন পণ্য'}</h2>
          <ProductForm product={editing || undefined} onSubmit={handleSubmit} onCancel={() => { setShowForm(false); setEditing(null); }} />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="পণ্য খুঁজুন..." className="input-field flex-1" />
        <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }} className="input-field w-auto">
          <option value="all">সব ক্যাটাগরি</option>
          <option value="necklace">নেকলেস</option><option value="ring">রিং</option><option value="bracelet">ব্রেসলেট</option>
          <option value="earring">ইয়াররিং</option><option value="watch">ঘড়ি</option><option value="other">অন্যান্য</option>
        </select>
        {selectedIds.length > 0 && <button onClick={() => setDeleteModal({ show: true, ids: selectedIds })} className="btn-danger">নির্বাচিত মুছুন ({selectedIds.length})</button>}
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: 'var(--bg-secondary)' }}>
              <tr>
                <th className="px-4 py-3"><input type="checkbox" checked={selectedIds.length === paginated.length && paginated.length > 0} onChange={() => setSelectedIds(selectedIds.length === paginated.length ? [] : paginated.map(p => p.id))} className="rounded" /></th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: 'var(--text-muted)' }}>পণ্য</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: 'var(--text-muted)' }}>ক্যাটাগরি</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: 'var(--text-muted)' }}>মূল্য</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase" style={{ color: 'var(--text-muted)' }}>স্টক</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase" style={{ color: 'var(--text-muted)' }}>প্রকাশিত</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: 'var(--text-muted)' }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {loading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-4 py-4"><div className="h-4 skeleton rounded" /></td>)}</tr>
              )) : paginated.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center font-bengali" style={{ color: 'var(--text-muted)' }}>কোনো পণ্য নেই</td></tr>
              ) : paginated.map(p => (
                <tr key={p.id} className="hover:opacity-80 transition-opacity">
                  <td className="px-4 py-4"><input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => setSelectedIds(prev => prev.includes(p.id) ? prev.filter(i => i !== p.id) : [...prev, p.id])} className="rounded" /></td>
                  <td className="px-4 py-4"><p className="font-medium font-bengali" style={{ color: 'var(--text-primary)' }}>{p.name}</p><p className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.slug || p.id}</p></td>
                  <td className="px-4 py-4 text-sm capitalize" style={{ color: 'var(--text-secondary)' }}>{p.category}</td>
                  <td className="px-4 py-4 text-sm">
                    <div style={{ color: 'var(--gold)' }} className="font-medium">৳{getFinalPrice(p).toFixed(0)}</div>
                    {p.discountPercent > 0 && <span className="text-xs line-through" style={{ color: 'var(--text-muted)' }}>৳{p.price}</span>}
                  </td>
                  <td className="px-4 py-4 text-center"><span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${p.stock > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>{p.stock > 0 ? p.stock : 'শেষ'}</span></td>
                  <td className="px-4 py-4 text-center"><button onClick={() => togglePublished(p)} className={`relative w-11 h-6 rounded-full transition-colors ${p.isPublished ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}><span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${p.isPublished ? 'translate-x-5' : ''}`} /></button></td>
                  <td className="px-4 py-4"><div className="flex gap-1 flex-wrap">
                    <button onClick={() => { setEditing(p); setShowForm(true); }} className="text-xs font-medium px-2 py-1 rounded hover:opacity-80" style={{ color: 'var(--gold)' }}>এডিট</button>
                    <button onClick={() => handleDuplicate(p)} className="text-xs font-medium px-2 py-1 rounded hover:opacity-80 text-blue-500">কপি</button>
                    <button onClick={() => setDeleteModal({ show: true, ids: [p.id] })} className="text-xs font-medium px-2 py-1 rounded hover:opacity-80 text-red-500">মুছুন</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className="px-3 py-1 rounded transition-colors" style={{ background: page === i + 1 ? 'var(--gold)' : 'var(--bg-card)', color: page === i + 1 ? 'white' : 'var(--text-primary)', border: page === i + 1 ? 'none' : '1px solid var(--border)' }}>{i + 1}</button>
          ))}
        </div>
      )}

      {deleteModal.show && <ConfirmModal title="পণ্য মুছে ফেলুন" message={`${deleteModal.ids.length}টি পণ্য মুছে ফেলতে চান?`} onConfirm={confirmDelete} onCancel={() => setDeleteModal({ show: false, ids: [] })} />}
    </div>
  );
}
