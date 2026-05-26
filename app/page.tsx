import Link from 'next/link';
import { getProducts } from '@/lib/github';
import { getSettings } from '@/lib/settings';
import ProductCard from '@/components/ProductCard';
import SakuraDivider from '@/components/SakuraDivider';
import type { Metadata } from 'next';

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

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #FDF6F9 0%, #FAE8F1 50%, #F5ECD4 100%)' }}>
        {/* Falling petals */}
        <div className="hero-petals" aria-hidden="true">
          {[
            { left: '8%', delay: '0s', dur: '10s', size: '10px', color: '#D4748D' },
            { left: '22%', delay: '1.5s', dur: '12s', size: '8px', color: '#F2C4D8' },
            { left: '35%', delay: '3s', dur: '9s', size: '12px', color: '#D4748D' },
            { left: '50%', delay: '4.5s', dur: '11s', size: '9px', color: '#F2C4D8' },
            { left: '65%', delay: '6s', dur: '13s', size: '11px', color: '#D4748D' },
            { left: '78%', delay: '7.5s', dur: '10s', size: '8px', color: '#F2C4D8' },
            { left: '88%', delay: '2s', dur: '12s', size: '10px', color: '#D4748D' },
            { left: '45%', delay: '8.5s', dur: '14s', size: '7px', color: '#F2C4D8' },
          ].map((p, i) => (
            <div key={i} className="petal" style={{ left: p.left, animationDelay: p.delay, animationDuration: p.dur, width: p.size, height: p.size, background: p.color }} />
          ))}
        </div>

        {/* Decorative branch (sumi-e style) */}
        <svg className="hero-branch" viewBox="0 0 600 800" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M600,800 Q500,700 450,600 Q400,500 380,400 Q360,300 400,200 Q420,100 500,0" stroke="#A0384F" strokeWidth="3" opacity="0.08" fill="none" />
          <path d="M450,600 Q380,580 320,550" stroke="#A0384F" strokeWidth="2" opacity="0.06" fill="none" />
          <path d="M400,400 Q340,380 280,350" stroke="#A0384F" strokeWidth="2" opacity="0.06" fill="none" />
          <path d="M400,200 Q350,180 300,160" stroke="#A0384F" strokeWidth="1.5" opacity="0.05" fill="none" />
          {/* Blossoms */}
          <g transform="translate(320,550)" opacity="0.10" fill="#D4748D">
            <g transform="rotate(0)"><path d="M0,-22 C6,-16 11,-6 0,0 C-11,-6 -6,-16 0,-22 Z" /></g>
            <g transform="rotate(72)"><path d="M0,-22 C6,-16 11,-6 0,0 C-11,-6 -6,-16 0,-22 Z" /></g>
            <g transform="rotate(144)"><path d="M0,-22 C6,-16 11,-6 0,0 C-11,-6 -6,-16 0,-22 Z" /></g>
            <g transform="rotate(216)"><path d="M0,-22 C6,-16 11,-6 0,0 C-11,-6 -6,-16 0,-22 Z" /></g>
            <g transform="rotate(288)"><path d="M0,-22 C6,-16 11,-6 0,0 C-11,-6 -6,-16 0,-22 Z" /></g>
            <circle r="3.5" fill="#B8860B" opacity="0.2" />
          </g>
          <g transform="translate(280,350)" opacity="0.08" fill="#D4748D">
            <g transform="rotate(0)"><path d="M0,-18 C5,-13 9,-5 0,0 C-9,-5 -5,-13 0,-18 Z" /></g>
            <g transform="rotate(72)"><path d="M0,-18 C5,-13 9,-5 0,0 C-9,-5 -5,-13 0,-18 Z" /></g>
            <g transform="rotate(144)"><path d="M0,-18 C5,-13 9,-5 0,0 C-9,-5 -5,-13 0,-18 Z" /></g>
            <g transform="rotate(216)"><path d="M0,-18 C5,-13 9,-5 0,0 C-9,-5 -5,-13 0,-18 Z" /></g>
            <g transform="rotate(288)"><path d="M0,-18 C5,-13 9,-5 0,0 C-9,-5 -5,-13 0,-18 Z" /></g>
            <circle r="3" fill="#B8860B" opacity="0.2" />
          </g>
          <g transform="translate(300,160)" opacity="0.07" fill="#D4748D">
            <g transform="rotate(0)"><path d="M0,-14 C4,-10 7,-4 0,0 C-7,-4 -4,-10 0,-14 Z" /></g>
            <g transform="rotate(72)"><path d="M0,-14 C4,-10 7,-4 0,0 C-7,-4 -4,-10 0,-14 Z" /></g>
            <g transform="rotate(144)"><path d="M0,-14 C4,-10 7,-4 0,0 C-7,-4 -4,-10 0,-14 Z" /></g>
            <g transform="rotate(216)"><path d="M0,-14 C4,-10 7,-4 0,0 C-7,-4 -4,-10 0,-14 Z" /></g>
            <g transform="rotate(288)"><path d="M0,-14 C4,-10 7,-4 0,0 C-7,-4 -4,-10 0,-14 Z" /></g>
          </g>
          <g transform="translate(500,100)" opacity="0.06" fill="#D4748D">
            <g transform="rotate(0)"><path d="M0,-12 C3.5,-9 6,-3 0,0 C-6,-3 -3.5,-9 0,-12 Z" /></g>
            <g transform="rotate(72)"><path d="M0,-12 C3.5,-9 6,-3 0,0 C-6,-3 -3.5,-9 0,-12 Z" /></g>
            <g transform="rotate(144)"><path d="M0,-12 C3.5,-9 6,-3 0,0 C-6,-3 -3.5,-9 0,-12 Z" /></g>
            <g transform="rotate(216)"><path d="M0,-12 C3.5,-9 6,-3 0,0 C-6,-3 -3.5,-9 0,-12 Z" /></g>
            <g transform="rotate(288)"><path d="M0,-12 C3.5,-9 6,-3 0,0 C-6,-3 -3.5,-9 0,-12 Z" /></g>
          </g>
        </svg>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-xl">
            <p className="font-serif-it text-[13px] text-gold-primary tracking-[3px] uppercase mb-4">
              ✦ Nilphamari, Bangladesh
            </p>

            <h1 className="font-bengali font-semibold text-deep-rose leading-[1.1] mb-4" style={{ fontSize: 'clamp(52px, 8vw, 96px)' }}>
              {settings.siteName}
            </h1>

            <p className="font-serif-it text-sakura-600 mb-6 leading-relaxed" style={{ fontSize: 'clamp(16px, 2.5vw, 22px)' }}>
              {settings.tagline}
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-bengali mb-8" style={{ background: 'rgba(184,134,11,0.12)', border: '1px solid #B8860B', color: '#B8860B' }}>
              🚚 48–72 ঘণ্টায় সারা বাংলাদেশে ডেলিভারি
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop" className="inline-flex items-center justify-center bg-deep-rose text-cream rounded-full px-9 py-3.5 font-bengali font-semibold hover:bg-sakura-600 transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]">
                শপ করুন
              </Link>
              {settings.messengerUrl && (
                <a href={settings.messengerUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-transparent border-[1.5px] border-sakura-400 text-sakura-600 rounded-full px-9 py-3.5 font-bengali font-semibold hover:bg-sakura-100 transition-all duration-200 active:scale-[0.97]">
                  Messenger-এ যোগাযোগ
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <svg className="w-5 h-5 text-sakura-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF ═══ */}
      <section className="bg-cream py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-3">
            {[1,2,3,4,5].map(i => <svg key={i} className="w-4 h-4 text-gold-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
          </div>
          <blockquote className="font-serif-it text-lg text-ink/80 mb-2">&ldquo;Best in the business. Keep it up.&rdquo;</blockquote>
          <p className="text-sm text-sakura-400 font-bengali">— স্বাক্ষর প্রামানিক</p>
          <div className="flex flex-wrap justify-center gap-6 mt-5 text-[13px] text-ink/60 font-bengali">
            <span>📍 Nilphamari, Bangladesh</span>
            <span>🚚 48–72 ঘণ্টায় সারা বাংলাদেশে ডেলিভারি</span>
            {settings.tiktokUrl && <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-sakura-600 hover:underline">TikTok — @pachmishali_100</a>}
          </div>
        </div>
      </section>

      <SakuraDivider />

      {/* ═══ ON SALE ═══ */}
      {onSale.length > 0 && (
        <section className="bg-sakura-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bengali font-semibold text-deep-rose">অফার পণ্য</h2>
                <p className="text-sakura-400 mt-1 font-bengali text-sm">সীমিত সময়ের অফার</p>
              </div>
              <Link href="/shop" className="text-sakura-600 hover:text-sakura-400 font-medium text-sm font-bengali transition-colors">সব দেখুন →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {onSale.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </section>
      )}

      <SakuraDivider />

      {/* ═══ FEATURED ═══ */}
      <section className="bg-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bengali font-semibold text-deep-rose mb-3">আমাদের কালেকশন</h2>
            <p className="text-sakura-400 max-w-lg mx-auto font-bengali text-sm">সুন্দর ও মানসম্পন্ন গহনা — প্রতিটি পণ্য যত্নসহ তৈরি</p>
          </div>
          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featured.map((product, i) => <div key={product.id} style={{ animationDelay: `${i * 0.08}s` }} className="animate-fade-in-up"><ProductCard product={product} /></div>)}
            </div>
          ) : (
            <p className="text-center text-sakura-400 py-12 font-bengali">শীঘ্রই নতুন পণ্য আসছে!</p>
          )}
        </div>
      </section>

      <SakuraDivider />

      {/* ═══ FEATURES ═══ */}
      <section className="bg-gold-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', title: 'Cash on Delivery', desc: 'সারা বাংলাদেশে ৪৮–৭২ ঘণ্টায় ডেলিভারি' },
              { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: '১০০% আসল পণ্য', desc: 'মানসম্পন্ন ও প্রকৃত পণ্যের নিশ্চয়তা' },
              { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', title: 'সহজে রিটার্ন', desc: '৭ দিনের রিটার্ন পলিসি' },
            ].map((f, i) => (
              <div key={i} className="p-6">
                <div className="w-14 h-14 bg-sakura-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-sakura-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} /></svg>
                </div>
                <h3 className="font-bengali font-semibold text-ink mb-2">{f.title}</h3>
                <p className="text-sm text-sakura-400 font-bengali">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
