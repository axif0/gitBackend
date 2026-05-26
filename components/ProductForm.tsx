'use client';

import { useState, useRef } from 'react';
import { Product } from '@/types/product';

interface Props {
  product?: Product;
  onSubmit: (product: Product, imageFile?: File | null, isEdit?: boolean) => Promise<void>;
  onCancel: () => void;
}

const defaultProduct: Product = {
  id: '',
  name: '',
  description: '',
  price: 0,
  discountPercent: 0,
  category: 'necklace',
  images: [],
  inStock: true,
  createdAt: new Date().toISOString(),
};

export default function ProductForm({ product, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<Product>(product || defaultProduct);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.images[0] || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setForm((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : type === 'number' ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form, imageFile, !!product);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product ID (slug)</label>
          <input
            name="id"
            value={form.id}
            onChange={handleChange}
            disabled={!!product}
            className="input-field disabled:bg-gray-100"
            placeholder="gold-pendant-necklace"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input-field"
            placeholder="Gold Pendant Necklace"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="input-field"
          placeholder="Beautiful handcrafted gold pendant..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (৳)</label>
          <input
            name="price"
            type="number"
            min="0"
            value={form.price}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
          <input
            name="discountPercent"
            type="number"
            min="0"
            max="100"
            value={form.discountPercent}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="input-field">
            <option value="necklace">Necklace</option>
            <option value="ring">Ring</option>
            <option value="bracelet">Bracelet</option>
            <option value="earring">Earring</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
        <div className="flex items-center gap-4">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="btn-secondary text-sm"
          >
            Choose Image
          </button>
          {imageFile && <span className="text-sm text-gray-500">{imageFile.name}</span>}
        </div>
        {imagePreview && (
          <div className="mt-4 relative w-40 h-40 rounded-lg overflow-hidden border">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          name="inStock"
          type="checkbox"
          checked={form.inStock}
          onChange={handleChange}
          className="h-4 w-4 text-gold-600 rounded"
        />
        <label className="text-sm text-gray-700">In Stock</label>
      </div>

      <div className="flex gap-4 pt-4">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
