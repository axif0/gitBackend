'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { SiteSettings } from '@/lib/schemas';

export default function HeroBanner({ settings }: { settings: SiteSettings }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src="/images/hero-banner.png"
          alt="পাঁচমিশালি - Premium Jewelry"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(42,10,20,0.7) 0%, rgba(42,10,20,0.4) 50%, rgba(42,10,20,0.6) 100%)' }} />
      </motion.div>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] tracking-[3px] uppercase" style={{ color: '#e8c84a', border: '1px solid rgba(232,200,74,0.3)', background: 'rgba(232,200,74,0.08)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#e8c84a' }} />
              Nilphamari, Bangladesh
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-bengali font-bold text-white mt-6 mb-6 leading-[1.05]"
            style={{ fontSize: 'clamp(48px, 8vw, 96px)', textShadow: '0 0 60px rgba(232,200,74,0.3)' }}
          >
            <span className="block" style={{ color: '#e8c84a' }}>
              {settings.siteName}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-xl mb-8 leading-relaxed font-bengali"
            style={{ color: '#f0d080' }}
          >
            {settings.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm mb-10 font-bengali"
            style={{ background: 'rgba(232,200,74,0.1)', border: '1px solid rgba(232,200,74,0.25)', color: '#f0d080' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
            ৪৮–৭২ ঘণ্টায় সারা বাংলাদেশে ডেলিভারি
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/shop" className="group relative inline-flex items-center justify-center px-10 py-4 rounded-full font-bengali font-semibold text-white overflow-hidden" style={{ background: 'linear-gradient(135deg, #b8860b, #9A7009)' }}>
              <span className="relative z-10">শপ করুন</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
            {settings.messengerUrl && (
              <a href={settings.messengerUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-bengali font-semibold transition-all duration-300 hover:bg-white/10" style={{ border: '1px solid rgba(232,200,74,0.4)', color: '#f0d080' }}>
                Messenger-এ যোগাযোগ
              </a>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 flex justify-center pt-2"
          style={{ borderColor: 'rgba(232,200,74,0.3)' }}
        >
          <motion.div className="w-1 h-2 rounded-full" style={{ background: '#e8c84a' }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
