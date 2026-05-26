'use client';

import { useState, useRef, useEffect } from 'react';
import { Product, slugify } from '@/types/product';

interface Props {
  product?: Product;
  onSubmit: (product: Product, imageFile?: File | null, isEdit?: boolean) => Promise<void>;
  onCancel: () => void;
}

const defaultProduct: Product = {
  id: '', slug: '', name: '', nameEn: '', description: '', descriptionEn: '',
  price: 0, discountPercent: 0, category: 'necklace', images: [],
  inStock: true, stock: 1, isPublished: true, createdAt: new Date().toISOString(),
};

export default function ProductForm({ product, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<Product>(product || defaultProduct);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.images[0] || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [slugEdited, setSlugEdited] = useState(!!product?.slug);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!slugEdited && form.name && !product) {
      setForm(prev => ({ ...prev, slug: slugify(form.name), id: slugify(form.name) }));
    }
  }, [form.name, slugEdited, product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setForm(prev => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : type === 'number' ? Number(value) : value,
    }));
    if (name === 'slug') setSlugEdited(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('ছবির সাইজ ৫ MB এর কম হতে হবে'); return; }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await onSubmit(form, imageFile, !!product); } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">পণ্যের নাম *</label>
          <input name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="সোনার নেকলেস" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
          <input name="slug" value={form.slug} onChange={handleChange} className="input-field" placeholder="sonar-necklace" required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">পণ্য ID</label>
          <input name="id" value={form.id} onChange={handleChange} disabled={!!product} className="input-field disabled:bg-gray-100" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ক্যাটাগরি</label>
          <select name="category" value={form.category} onChange={handleChange} className="input-field">
            <option value="necklace">নেকলেস</option>
            <option value="ring">রিং</option>
            <option value="bracelet">ব্রেসলেট</option>
            <option value="earring">ইয়াররিং</option>
            <option value="watch">ঘড়ি</option>
            <option value="other">অন্যান্য</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">বিবরণ *</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="input-field font-bengali" placeholder="পণ্যের বিস্তারিত বিবরণ লিখুন..." required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">মূল্য (৳) *</label>
          <input name="price" type="number" min="0" value={form.price} onChange={handleChange} className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ডিসকাউন্ট (%)</label>
          <input name="discountPercent" type="number" min="0" max="100" value={form.discountPercent} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">স্টক পরিমাণ *</label>
          <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className="input-field" required />
        </div>
        <div className="flex items-end gap-4">
          <label className="flex items-center gap-2">
            <input name="inStock" type="checkbox" checked={form.inStock} onChange={handleChange} className="h-4 w-4 text-gold-primary rounded" />
            <span className="text-sm text-gray-700">স্টকে আছে</span>
          </label>
          <label className="flex items-center gap-2">
            <input name="isPublished" type="checkbox" checked={form.isPublished} onChange={handleChange} className="h-4 w-4 text-gold-primary rounded" />
            <span className="text-sm text-gray-700">প্রকাশিত</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">পণ্যের ছবি (সর্বোচ্চ ৫ MB)</label>
        <div className="flex items-center gap-4">
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
          <button type="button" onClick={() => fileRef.current?.click()} className="btn-secondary text-sm">ছবি বাছুন</button>
          {imageFile && <span className="text-sm text-gray-500">{imageFile.name}</span>}
        </div>
        {imagePreview && (
          <div className="mt-4 relative w-40 h-40 rounded-lg overflow-hidden border">
            <img src={imagePreview} alt="প্রিভিউ" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'সংরক্ষণ হচ্ছে...' : product ? 'আপডেট করুন' : 'যোগ করুন'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">বাতিল</button>
      </div>
    </form>
  );
}
