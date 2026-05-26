import { getProducts } from '@/lib/github';
import { getSettings } from '@/lib/settings';
import type { Metadata } from 'next';
import HeroBanner from '@/components/HeroBanner';
import ReviewCarousel from '@/components/ReviewCarousel';
import SakuraDivider from '@/components/SakuraDivider';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: `${settings.siteName} | ${settings.tagline}`,
    description: settings.metaDescription,
    openGraph: { title: settings.siteName, description: settings.metaDescription, type: 'website', locale: 'bn_BD' },
    alternates: { canonical: '/' },
  };
}

export default async function HomePage() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  const published = products.filter(p => p.isPublished !== false);
  const featured = published.filter(p => p.inStock).slice(0, 8);
  const onSale = published.filter(p => p.discountPercent > 0 && p.inStock).slice(0, 4);
  const earrings = published.filter(p => p.category === 'earring' && p.inStock).slice(0, 6);

  const localBusinessJsonLd = {
    '@context': 'https://schema.org', '@type': 'LocalBusiness',
    name: settings.siteName, description: settings.tagline,
    address: { '@type': 'PostalAddress', streetAddress: settings.address, addressLocality: 'Nilphamari', postalCode: '5300', addressCountry: 'BD' },
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://pachmishali.com',
    telephone: settings.phone || '',
    sameAs: [settings.facebookUrl, settings.tiktokUrl].filter(Boolean),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />

      {/* Hero */}
      <HeroBanner settings={settings} />

      {/* Features Strip */}
      <section className="py-4 sm:py-6" style={{ background: 'linear-gradient(90deg, var(--rose), var(--sakura-dark), var(--rose))' }}>
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-4 sm:gap-8 md:gap-16 text-white/90 text-xs sm:text-sm font-bengali">
          <span className="flex items-center gap-1.5 sm:gap-2">🚚 ৪৮–৭২ ঘণ্টায় ডেলিভারি</span>
          <span className="flex items-center gap-1.5 sm:gap-2">💰 Cash on Delivery</span>
          <span className="flex items-center gap-1.5 sm:gap-2">✅ ১০০% আসল পণ্য</span>
          <span className="flex items-center gap-1.5 sm:gap-2">🔄 ৭ দিন রিটার্ন</span>
        </div>
      </section>

      {/* On Sale */}
      {onSale.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-6 sm:mb-10">
              <div>
                <span className="text-xs sm:text-sm tracking-[2px] sm:tracking-[3px] uppercase font-serif-it" style={{ color: 'var(--gold)' }}>Limited Offer</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bengali font-bold mt-1 sm:mt-2" style={{ color: 'var(--rose)' }}>অফার পণ্য</h2>
              </div>
              <Link href="/shop" className="text-xs sm:text-sm font-bengali transition-colors" style={{ color: 'var(--sakura-dark)' }}>সব দেখুন →</Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {onSale.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
            </div>
          </div>
        </section>
      )}

      <SakuraDivider />

      {/* Earrings Showcase */}
      {earrings.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 relative overflow-hidden" style={{ background: 'var(--bg-footer)' }}>
          <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, var(--gold), transparent)', filter: 'blur(100px)' }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-8 sm:mb-12">
              <span className="text-xs sm:text-sm tracking-[2px] sm:tracking-[3px] uppercase font-serif-it" style={{ color: 'var(--gold)' }}>Earring Collection</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bengali font-bold text-white mt-2 sm:mt-3">ইয়াররিং কালেকশন</h2>
              <p className="text-xs sm:text-sm mt-2 sm:mt-3 font-bengali" style={{ color: 'var(--sakura)' }}>আপনার সৌন্দর্যে নতুন রূপ দিন</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {earrings.map((product, i) => (
                <div key={product.id} className={i === 0 ? 'lg:row-span-2 lg:col-span-1' : ''}>
                  <ProductCard product={product} index={i} />
                </div>
              ))}
            </div>

            <div className="text-center mt-8 sm:mt-10">
              <Link href="/shop" className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bengali font-semibold text-white text-sm sm:text-base transition-all duration-300 hover:scale-105" style={{ background: 'var(--gold)', boxShadow: 'var(--shadow-gold)' }}>
                সব ইয়াররিং দেখুন
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured */}
      <section className="py-12 sm:py-16 md:py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-xs sm:text-sm tracking-[2px] sm:tracking-[3px] uppercase font-serif-it" style={{ color: 'var(--gold)' }}>Our Collection</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bengali font-bold mt-2 sm:mt-3" style={{ color: 'var(--rose)' }}>আমাদের কালেকশন</h2>
            <p className="text-xs sm:text-sm mt-2 sm:mt-3 font-bengali" style={{ color: 'var(--text-muted)' }}>সুন্দর ও মানসম্পন্ন গহনা</p>
          </div>
          {featured.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {featured.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
            </div>
          ) : (
            <p className="text-center py-12 font-bengali" style={{ color: 'var(--text-muted)' }}>শীঘ্রই নতুন পণ্য আসছে!</p>
          )}
        </div>
      </section>

      <SakuraDivider />

      {/* Reviews */}
      <ReviewCarousel />

      {/* CTA */}
      <section className="py-12 sm:py-16 md:py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--rose), var(--sakura-dark), var(--rose))' }}>
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bengali font-bold text-white mb-3 sm:mb-4">আজই অর্ডার করুন</h2>
          <p className="text-sm sm:text-lg font-bengali mb-6 sm:mb-8" style={{ color: '#F2C4D8' }}>সারা বাংলাদেশে Cash on Delivery — ৪৮–৭২ ঘণ্টায় ডেলিভারি</p>
          <Link href="/shop" className="inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bengali font-bold transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base" style={{ background: 'white', color: 'var(--rose)' }}>
            শপ করুন
          </Link>
        </div>
      </section>
    </div>
  );
}
