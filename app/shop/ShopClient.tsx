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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bengali font-bold mb-3 sm:mb-4" style={{ color: 'var(--rose)' }}>আমাদের কালেকশন</h1>
        <p className="text-sm sm:text-base font-bengali" style={{ color: 'var(--text-muted)' }}>সুন্দর গহনা ও ঘড়ি — আপনার পছন্দের পণ্য বাছুন</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium font-bengali transition-all"
              style={{
                background: category === cat ? 'var(--rose)' : 'var(--bg-card)',
                color: category === cat ? '#FEFAF5' : 'var(--text-primary)',
                border: category === cat ? 'none' : '1px solid var(--border)',
              }}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="input-field w-full sm:w-auto text-sm"
        >
          <option value="default">সাজান</option>
          <option value="price-asc">দাম: কম থেকে বেশি</option>
          <option value="price-desc">দাম: বেশি থেকে কম</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center py-16 font-bengali text-sm sm:text-base" style={{ color: 'var(--text-muted)' }}>এই ক্যাটাগরিতে কোনো পণ্য নেই।</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {filtered.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
        </div>
      )}
    </div>
  );
}
