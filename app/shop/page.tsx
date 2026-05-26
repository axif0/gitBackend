'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/Skeleton';

const categories = ['all', 'necklace', 'ring', 'bracelet', 'earring'] as const;

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('all');
  const [sort, setSort] = useState<string>('default');

  useEffect(() => {
    fetch('/api/admin/products')
      .then((res) => res.json())
      .then((data) => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  let filtered = category === 'all'
    ? products
    : products.filter((p) => p.category === category);

  if (sort === 'price-asc') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold mb-4">Our Collection</h1>
        <p className="text-gray-500">Browse our exquisite jewelry pieces</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-gold-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gold-50 border'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input-field w-auto"
        >
          <option value="default">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <ProductGridSkeleton />
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-16">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
