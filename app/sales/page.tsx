import { getProducts } from '@/lib/github';
import { getFinalPrice } from '@/types/product';

export const revalidate = 60;

export default async function SalesPage() {
  const products = await getProducts();
  const sorted = [...products].sort((a, b) => a.category.localeCompare(b.category));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold mb-4">Sales Tracker</h1>
        <p className="text-gray-500">Complete overview of all products, prices, and discounts</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Original Price</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Discount</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Final Price</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No products available yet.
                  </td>
                </tr>
              ) : (
                sorted.map((p) => {
                  const finalPrice = getFinalPrice(p);
                  const savings = p.price - finalPrice;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize text-sm">{p.category}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        ৳{p.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {p.discountPercent > 0 ? (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                            {p.discountPercent}% OFF
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gold-700">
                        ৳{finalPrice.toFixed(0)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-green-600">
                        {savings > 0 ? `৳${savings.toFixed(0)}` : '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {sorted.length > 0 && (
        <div className="mt-6 text-right text-sm text-gray-500">
          Total products: {sorted.length} | On sale: {sorted.filter((p) => p.discountPercent > 0).length}
        </div>
      )}
    </div>
  );
}
