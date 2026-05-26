'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import type { SiteSettings } from '@/lib/schemas';

function getRawUrl(path: string): string {
  if (!path || path.startsWith('http')) return path || '';
  const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER || '';
  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || '';
  const branch = process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main';
  if (owner && repo) return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
  return path;
}

export default function Navbar({ settings }: { settings: SiteSettings }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const pathname = usePathname();
  const { itemCount } = useCart();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  useEffect(() => {
    if (sessionStorage.getItem('announcement-dismissed')) setShowAnnouncement(false);
  }, []);

  const links = [
    { href: '/', label: 'হোম' },
    { href: '/shop', label: 'শপ' },
    { href: '/cart', label: 'কার্ট' },
  ];

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      {/* Announcement Bar */}
      {settings.announcementBar && showAnnouncement && (
        <div className="fixed left-0 right-0 top-0 z-[60] h-9 flex items-center justify-center text-cream text-[13px] font-bengali" style={{ background: 'linear-gradient(90deg, #6B1F35, #A0384F, #6B1F35)' }}>
          <span className="px-8">🌸 {settings.announcementBar} 🌸</span>
          <button onClick={() => { setShowAnnouncement(false); sessionStorage.setItem('announcement-dismissed', 'true'); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/70 hover:text-cream" aria-label="বন্ধ">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {/* Navbar */}
      <nav className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-sakura-50/96 shadow-[0_2px_20px_rgba(160,56,79,0.08)]' : 'bg-sakura-50/85'
      } backdrop-blur-xl`} style={{ top: showAnnouncement && settings.announcementBar ? '36px' : '0', borderBottom: '1px solid rgba(212,116,141,0.15)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-1.5">
              {settings.logoUrl ? (
                <Image src={getRawUrl(settings.logoUrl)} alt={settings.siteName} width={150} height={45} className="h-10 w-auto" priority unoptimized />
              ) : (
                <span className="text-2xl font-bengali font-semibold text-deep-rose">
                  <span className="text-gold-primary">✦</span> {settings.siteName}
                </span>
              )}
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {links.map(link => (
                <Link key={link.href} href={link.href} className={`relative text-sm font-bengali transition-colors ${isActive(link.href) ? 'text-sakura-600 font-medium' : 'text-ink hover:text-sakura-600'}`}>
                  {link.label}
                  {isActive(link.href) && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-sakura-200 rounded-full" />}
                </Link>
              ))}
              <Link href="/cart" className="relative p-2 text-ink hover:text-sakura-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-deep-rose text-cream text-[10px] w-4.5 h-4.5 min-w-[18px] rounded-full flex items-center justify-center font-bold">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <Link href="/cart" className="relative p-2 text-ink">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                {itemCount > 0 && <span className="absolute -top-1 -right-1 bg-deep-rose text-cream text-[10px] w-4.5 h-4.5 min-w-[18px] rounded-full flex items-center justify-center font-bold">{itemCount > 9 ? '9+' : itemCount}</span>}
              </Link>
              <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-ink" aria-label="মেনু">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[55] md:hidden">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-sakura-50 shadow-xl animate-slide-in">
            <div className="p-6 pt-20 space-y-2">
              {links.map(link => (
                <Link key={link.href} href={link.href} className={`block py-3 px-4 rounded-xl font-bengali transition-colors ${isActive(link.href) ? 'bg-sakura-100 text-sakura-600 font-medium' : 'text-ink hover:bg-sakura-100/50'}`}>
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-sakura-200/40 pt-4 mt-4 space-y-3">
                {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2 text-sm text-ink/70 hover:text-sakura-600 font-bengali">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </a>}
                {settings.messengerUrl && <a href={settings.messengerUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2 text-sm text-ink/70 hover:text-sakura-600 font-bengali">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.936 1.525 5.54 3.89 7.124v3.893l3.574-1.956C10.47 20.68 11.22 20.8 12 20.8c5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.09 12.426l-2.55-2.727-4.99 2.727 5.47-5.81 2.61 2.727 4.93-2.727-5.47 5.81z"/></svg>
                  Messenger
                </a>}
                {settings.tiktokUrl && <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2 text-sm text-ink/70 hover:text-sakura-600 font-bengali">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13a8.28 8.28 0 005.58 2.16V11.7a4.83 4.83 0 01-3.77-1.24V6.69h3.77z"/></svg>
                  TikTok
                </a>}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ height: showAnnouncement && settings.announcementBar ? 'calc(4rem + 36px)' : '4rem' }} />
    </>
  );
}
