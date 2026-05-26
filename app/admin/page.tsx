'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product, getFinalPrice } from '@/types/product';
import ProductForm from '@/components/ProductForm';
import { TableRowSkeleton } from '@/components/Skeleton';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        setProducts(await res.json());
      }
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleUploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const res = await fetch('/api/admin/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: `${Date.now()}-${file.name}`,
              data: reader.result,
            }),
          });
          if (res.ok) {
            const { filename } = await res.json();
            resolve(`public/images/${filename}`);
          } else {
            reject(new Error('Upload failed'));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (product: Product, imageFile?: File | null, isEdit?: boolean) => {
    try {
      let images = product.images;
      if (imageFile) {
        const path = await handleUploadImage(imageFile);
        images = [path];
      }

      const payload = { ...product, images };
      const editMode = isEdit ?? editing !== null;
      const optimistic = editMode
        ? products.map((p) => (p.id === product.id ? payload : p))
        : [...products, payload];

      setProducts(optimistic);
      setShowForm(false);
      setEditing(null);

      const res = await fetch('/api/admin/products', {
        method: editMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Save failed');
      }

      toast.success(editMode ? 'Product updated!' : 'Product added!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save product');
      fetchProducts();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const prev = products;
    setProducts(products.filter((p) => p.id !== id));
    toast.success('Product deleted');

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
    } catch {
      toast.error('Failed to delete');
      setProducts(prev);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold">Admin Dashboard</h1>
        <button
          onClick={() => { setShowForm(true); setEditing(null); }}
          className="btn-primary"
        >
          + Add Product
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">
            {editing ? 'Edit Product' : 'Add New Product'}
          </h2>
          <ProductForm
            product={editing || undefined}
            onSubmit={handleSubmit}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Final</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    No products yet. Add your first product!
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm capitalize">{p.category}</td>
                    <td className="px-4 py-4 text-sm">৳{p.price}</td>
                    <td className="px-4 py-4 text-sm">
                      {p.discountPercent > 0 ? (
                        <span className="text-red-600">{p.discountPercent}%</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">৳{getFinalPrice(p).toFixed(0)}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${p.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.inStock ? 'In Stock' : 'Out'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditing(p); setShowForm(true); }}
                          className="text-gold-600 hover:text-gold-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
