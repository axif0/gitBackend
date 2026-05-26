'use client';

import { useState, useMemo } from 'react';
import { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';

const categories = ['all', 'necklace', 'ring', 'bracelet', 'earring', 'watch', 'other'] as const;
const categoryLabels: Record<string, string> = {
  all: 'সব', necklace: 'নেকলেস', ring: 'রিং', bracelet: 'ব্রেসলেট', earring: 'ইয়াররিং', watch: 'ঘড়ি', other: 'অন্যান্য',
};

export default function ShopClient({ initialProducts }: { initialProducts: Product[] }) {
  const [category, setCategory] = useState<string>('all');
  const [sort, setSort] = useState<string>('default');

  const filtered = useMemo(() => {
    let result = category === 'all' ? initialProducts : initialProducts.filter(p => p.category === category);
    if (sort === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [initialProducts, category, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 font-bangla">আমাদের কালেকশন</h1>
        <p className="text-gray-500">সুন্দর গহনা ও ঘড়ি — আপনার পছন্দের পণ্য বাছুন</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat ? 'bg-gold-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gold-50 border'}`}>
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} className="input-field w-auto">
          <option value="default">সাজান</option>
          <option value="price-asc">দাম: কম থেকে বেশি</option>
          <option value="price-desc">দাম: বেশি থেকে কম</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-16">এই ক্যাটাগরিতে কোনো পণ্য নেই।</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}
