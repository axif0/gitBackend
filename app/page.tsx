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

      {/* ═══ HERO ═══ */}
      <HeroBanner settings={settings} />

      {/* ═══ FEATURES STRIP ═══ */}
      <section className="py-6" style={{ background: 'linear-gradient(90deg, #6B1F35, #A0384F, #6B1F35)' }}>
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 sm:gap-16 text-white/90 text-sm font-bengali">
          <span className="flex items-center gap-2">🚚 ৪৮–৭২ ঘণ্টায় ডেলিভারি</span>
          <span className="flex items-center gap-2">💰 Cash on Delivery</span>
          <span className="flex items-center gap-2">✅ ১০০% আসল পণ্য</span>
          <span className="flex items-center gap-2">🔄 ৭ দিন রিটার্ন</span>
        </div>
      </section>

      {/* ═══ ON SALE ═══ */}
      {onSale.length > 0 && (
        <section className="py-20" style={{ background: 'linear-gradient(180deg, #FDF6F9 0%, #FEFAF5 100%)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="text-sm tracking-[3px] uppercase font-serif-it" style={{ color: '#B8860B' }}>Limited Offer</span>
                <h2 className="text-3xl sm:text-4xl font-bengali font-bold text-deep-rose mt-2">অফার পণ্য</h2>
              </div>
              <Link href="/shop" className="text-sm font-bengali text-sakura-600 hover:text-sakura-400 transition-colors">সব দেখুন →</Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {onSale.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
            </div>
          </div>
        </section>
      )}

      <SakuraDivider />

      {/* ═══ EARRINGS SHOWCASE ═══ */}
      {earrings.length > 0 && (
        <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2D1B22 0%, #1a0a10 50%, #2D1B22 100%)' }}>
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #B8860B, transparent)', filter: 'blur(100px)' }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #D4748D, transparent)', filter: 'blur(80px)' }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <span className="text-sm tracking-[3px] uppercase font-serif-it" style={{ color: '#B8860B' }}>Earring Collection</span>
              <h2 className="text-3xl sm:text-4xl font-bengali font-bold text-white mt-3">ইয়াররিং কালেকশন</h2>
              <p className="text-sm mt-3 font-bengali" style={{ color: '#D4748D' }}>আপনার সৌন্দর্যে নতুন রূপ দিন</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {earrings.map((product, i) => (
                <div key={product.id} className={i === 0 ? 'lg:row-span-2 lg:col-span-1' : ''}>
                  <ProductCard product={product} index={i} />
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bengali font-semibold text-white transition-all duration-300 hover:scale-105" style={{ background: 'linear-gradient(135deg, #B8860B, #9A7009)', boxShadow: '0 4px 20px rgba(184,134,11,0.3)' }}>
                সব ইয়াররিং দেখুন
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══ FEATURED ═══ */}
      <section className="py-20" style={{ background: '#FEFAF5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm tracking-[3px] uppercase font-serif-it" style={{ color: '#B8860B' }}>Our Collection</span>
            <h2 className="text-3xl sm:text-4xl font-bengali font-bold text-deep-rose mt-3">আমাদের কালেকশন</h2>
            <p className="text-sm mt-3 font-bengali text-sakura-400">সুন্দর ও মানসম্পন্ন গহনা</p>
          </div>
          {featured.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {featured.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
            </div>
          ) : (
            <p className="text-center text-sakura-400 py-12 font-bengali">শীঘ্রই নতুন পণ্য আসছে!</p>
          )}
        </div>
      </section>

      <SakuraDivider />

      {/* ═══ REVIEWS ═══ */}
      <ReviewCarousel />

      {/* ═══ CTA SECTION ═══ */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #6B1F35, #A0384F, #6B1F35)' }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bengali font-bold text-white mb-4">আজই অর্ডার করুন</h2>
          <p className="text-lg font-bengali mb-8" style={{ color: '#F2C4D8' }}>সারা বাংলাদেশে Cash on Delivery — ৪৮–৭২ ঘণ্টায় ডেলিভারি</p>
          <Link href="/shop" className="inline-flex items-center justify-center px-10 py-4 rounded-full font-bengali font-bold text-deep-rose bg-white hover:bg-gold-light transition-all duration-300 hover:scale-105 shadow-lg">
            শপ করুন
          </Link>
        </div>
      </section>
    </div>
  );
}
