import Link from 'next/link';
import { getProducts } from '@/lib/github';
import { getFinalPrice } from '@/types/product';
import ProductCard from '@/components/ProductCard';

export const revalidate = 60;

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.filter((p) => p.inStock).slice(0, 8);
  const onSale = products.filter((p) => p.discountPercent > 0 && p.inStock).slice(0, 4);

  return (
    <div>
      <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Timeless Elegance,{' '}
              <span className="text-gold-400">Modern Design</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Discover our handcrafted jewelry collection, designed to celebrate
              life&apos;s most precious moments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop" className="btn-primary text-center">
                Shop Collection
              </Link>
              <Link href="/sales" className="btn-secondary text-center border-white text-white hover:bg-white/10">
                View Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {onSale.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-serif font-bold">On Sale Now</h2>
              <p className="text-gray-500 mt-1">Limited time offers</p>
            </div>
            <Link href="/shop" className="text-gold-600 hover:text-gold-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {onSale.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4">Featured Collection</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Explore our curated selection of exquisite pieces, each crafted with precision and care.
            </p>
          </div>
          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">
              No products yet. Check back soon!
            </p>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Free Shipping</h3>
            <p className="text-sm text-gray-500">On all orders over ৳5,000</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Authenticity Guaranteed</h3>
            <p className="text-sm text-gray-500">100% genuine materials</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Easy Returns</h3>
            <p className="text-sm text-gray-500">7-day return policy</p>
          </div>
        </div>
      </section>
    </div>
  );
}
