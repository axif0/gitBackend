import Link from 'next/link';
import type { SiteSettings } from '@/lib/schemas';

export default function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer style={{ background: 'linear-gradient(135deg, #2D1B22, #1a0a10)' }}>
      <div className="h-1" style={{ background: 'linear-gradient(90deg, #B8860B, #D4748D, #B8860B)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-xl font-bengali font-bold mb-3" style={{ background: 'linear-gradient(135deg, #F5ECD4, #B8860B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {settings.siteName}
            </h3>
            <p className="font-serif-it text-sm leading-relaxed mb-4" style={{ color: '#D4748D' }}>{settings.tagline}</p>
            <div className="flex gap-3">
              {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ background: 'rgba(212,116,141,0.15)', color: '#D4748D' }} aria-label="Facebook"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>}
              {settings.messengerUrl && <a href={settings.messengerUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ background: 'rgba(212,116,141,0.15)', color: '#D4748D' }} aria-label="Messenger"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.936 1.525 5.54 3.89 7.124v3.893l3.574-1.956C10.47 20.68 11.22 20.8 12 20.8c5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.09 12.426l-2.55-2.727-4.99 2.727 5.47-5.81 2.61 2.727 4.93-2.727-5.47 5.81z"/></svg></a>}
              {settings.tiktokUrl && <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ background: 'rgba(212,116,141,0.15)', color: '#D4748D' }} aria-label="TikTok"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13a8.28 8.28 0 005.58 2.16V11.7a4.83 4.83 0 01-3.77-1.24V6.69h3.77z"/></svg></a>}
            </div>
          </div>

          <div>
            <h4 className="text-white/90 font-semibold mb-4 font-bengali">লিংক</h4>
            <ul className="space-y-2.5 text-sm font-bengali">
              <li><Link href="/" className="transition-colors hover:text-white" style={{ color: '#D4748D' }}>হোম</Link></li>
              <li><Link href="/shop" className="transition-colors hover:text-white" style={{ color: '#D4748D' }}>শপ</Link></li>
              <li><Link href="/cart" className="transition-colors hover:text-white" style={{ color: '#D4748D' }}>কার্ট</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white/90 font-semibold mb-4 font-bengali">যোগাযোগ</h4>
            <div className="space-y-2.5 text-[13px] font-bengali" style={{ color: '#D4748D' }}>
              <p>📍 {settings.address}</p>
              <p>🚚 ৪৮–৭২ ঘণ্টায় ডেলিভারি</p>
              {settings.phone && <p>📞 {settings.phone}</p>}
            </div>
          </div>

          <div>
            <h4 className="text-white/90 font-semibold mb-4 font-bengali">পেমেন্ট</h4>
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-white rounded-lg px-3 py-2">
                <svg viewBox="0 0 80 30" className="h-6 w-auto"><rect width="80" height="30" rx="4" fill="#E2136E" /><text x="40" y="20" textAnchor="middle" fill="white" fontWeight="bold" fontSize="16" fontFamily="Arial">bKash</text></svg>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'rgba(184,134,11,0.15)' }}>
                <span className="text-sm font-semibold font-bengali" style={{ color: '#B8860B' }}>Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t py-5 text-center" style={{ borderColor: 'rgba(212,116,141,0.1)' }}>
        <p className="text-xs font-bengali" style={{ color: '#D4748D' }}>
          © {new Date().getFullYear()} {settings.siteName} — {settings.tagline}
        </p>
      </div>
    </footer>
  );
}
