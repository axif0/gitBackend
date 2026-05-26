'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import LogoSVG from '@/components/LogoSVG';
import type { SiteSettings } from '@/lib/schemas';

function getRawUrl(path: string): string {
  if (!path || path.startsWith('http')) return path || '';
  const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER || '';
  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || '';
  const branch = process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'master';
  if (owner && repo) return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
  return path;
}

export default function Navbar({ settings }: { settings: SiteSettings }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { theme } = useTheme();

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
        <motion.div
          initial={{ y: -36 }}
          animate={{ y: 0 }}
          className="fixed left-0 right-0 top-0 z-[60] h-9 flex items-center justify-center text-white/90 text-[13px] font-bengali"
          style={{ background: 'linear-gradient(90deg, #6B1F35, #A0384F, #6B1F35)' }}
        >
          <span className="px-8">{settings.announcementBar}</span>
          <button onClick={() => { setShowAnnouncement(false); sessionStorage.setItem('announcement-dismissed', 'true'); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white" aria-label="বন্ধ">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </motion.div>
      )}

      {/* Navbar */}
      <nav
        className="fixed left-0 right-0 z-50 transition-all duration-500"
        style={{
          top: showAnnouncement && settings.announcementBar ? '36px' : '0',
          height: '64px',
        }}
      >
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-full items-center">
            <Link href="/" className="flex items-center">
              {settings.logoUrl ? (
                <Image src={getRawUrl(settings.logoUrl)} alt={settings.siteName} width={150} height={45} className="h-10 w-auto" priority unoptimized />
              ) : (
                <LogoSVG className="h-12 w-auto" />
              )}
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {links.map(link => (
                <Link key={link.href} href={link.href} className={`relative text-sm font-bengali transition-colors duration-300 ${isActive(link.href) ? (theme === 'dark' ? 'text-gold-primary font-semibold' : 'text-sakura-600 font-semibold') : (theme === 'dark' ? 'text-[#F5ECD4]/70 hover:text-gold-primary' : 'text-ink/70 hover:text-sakura-600')}`}>
                  {link.label}
                  {isActive(link.href) && <motion.div layoutId="nav-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, #B8860B, #D4748D)' }} />}
                </Link>
              ))}
              <Link href="/cart" className={`relative p-2 transition-colors ${theme === 'dark' ? 'text-[#F5ECD4]/70 hover:text-gold-primary' : 'text-ink/70 hover:text-sakura-600'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                {itemCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold text-white" style={{ background: 'linear-gradient(135deg, #6B1F35, #A0384F)' }}>
                    {itemCount > 9 ? '9+' : itemCount}
                  </motion.span>
                )}
              </Link>
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <Link href="/cart" className={`relative p-2 ${theme === 'dark' ? 'text-[#F5ECD4]/70' : 'text-ink/70'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                {itemCount > 0 && <span className="absolute -top-1 -right-1 text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold text-white" style={{ background: '#6B1F35' }}>{itemCount > 9 ? '9+' : itemCount}</span>}
              </Link>
              <button onClick={() => setIsOpen(!isOpen)} className={`p-2 ${theme === 'dark' ? 'text-[#F5ECD4]/70' : 'text-ink/70'}`} aria-label="মেনু">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[55] md:hidden" onClick={() => setIsOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed right-0 top-0 h-full w-72 z-[56] md:hidden" style={{ background: theme === 'dark' ? 'rgba(26,10,16,0.98)' : 'rgba(253,246,249,0.98)', backdropFilter: 'blur(20px)' }}>
              <div className="p-6 pt-20 space-y-2">
                {links.map(link => (
                  <Link key={link.href} href={link.href} className={`block py-3 px-4 rounded-xl font-bengali transition-all duration-300 ${isActive(link.href) ? (theme === 'dark' ? 'text-gold-primary font-semibold' : 'text-sakura-600 font-semibold') : (theme === 'dark' ? 'text-[#F5ECD4]/70 hover:text-gold-primary' : 'text-ink/70 hover:text-sakura-600')}`} style={isActive(link.href) ? { background: theme === 'dark' ? 'rgba(184,134,11,0.1)' : 'rgba(212,116,141,0.1)' } : {}}>
                    {link.label}
                  </Link>
                ))}
                <div className="border-t pt-4 mt-4 space-y-3" style={{ borderColor: theme === 'dark' ? 'rgba(74,45,74,0.3)' : 'rgba(212,116,141,0.2)' }}>
                  {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 px-4 py-2 text-sm font-bengali transition-colors ${theme === 'dark' ? 'text-[#F5ECD4]/50 hover:text-gold-primary' : 'text-ink/50 hover:text-sakura-600'}`}>Facebook</a>}
                  {settings.messengerUrl && <a href={settings.messengerUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 px-4 py-2 text-sm font-bengali transition-colors ${theme === 'dark' ? 'text-[#F5ECD4]/50 hover:text-gold-primary' : 'text-ink/50 hover:text-sakura-600'}`}>Messenger</a>}
                  {settings.tiktokUrl && <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 px-4 py-2 text-sm font-bengali transition-colors ${theme === 'dark' ? 'text-[#F5ECD4]/50 hover:text-gold-primary' : 'text-ink/50 hover:text-sakura-600'}`}>TikTok</a>}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div style={{ height: showAnnouncement && settings.announcementBar ? 'calc(4rem + 36px)' : '4rem' }} />
    </>
  );
}
