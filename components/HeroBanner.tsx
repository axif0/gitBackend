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
    <section className="relative min-h-[80vh] sm:min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src="/images/hero-banner.png"
          alt="পাঁচমিশালি - Premium Jewelry"
          fill
          className="object-cover object-center"
          priority
          quality={85}
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(42,10,20,0.6) 0%, rgba(42,10,20,0.4) 50%, rgba(42,10,20,0.7) 100%)' }} />
      </motion.div>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="max-w-xl sm:max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[12px] tracking-[2px] sm:tracking-[3px] uppercase" style={{ color: '#e8c84a', border: '1px solid rgba(232,200,74,0.3)', background: 'rgba(232,200,74,0.08)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#e8c84a' }} />
              Nilphamari, Bangladesh
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-bengali font-bold text-white mt-5 sm:mt-6 mb-4 sm:mb-6 leading-[1.1]"
            style={{ fontSize: 'clamp(40px, 10vw, 96px)', textShadow: '0 0 60px rgba(232,200,74,0.3)' }}
          >
            <span className="block" style={{ color: '#e8c84a' }}>
              {settings.siteName}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed font-bengali"
            style={{ color: '#f0d080' }}
          >
            {settings.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="inline-flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm mb-8 sm:mb-10 font-bengali"
            style={{ background: 'rgba(232,200,74,0.1)', border: '1px solid rgba(232,200,74,0.25)', color: '#f0d080' }}
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
            ৪৮–৭২ ঘণ্টায় ডেলিভারি
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <Link href="/shop" className="group relative inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bengali font-semibold text-white text-sm sm:text-base overflow-hidden" style={{ background: 'linear-gradient(135deg, #b8860b, #9A7009)' }}>
              <span className="relative z-10">শপ করুন</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
            {settings.messengerUrl && (
              <a href={settings.messengerUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bengali font-semibold text-sm sm:text-base transition-all duration-300 hover:bg-white/10" style={{ border: '1px solid rgba(232,200,74,0.4)', color: '#f0d080' }}>
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
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 hidden sm:block"
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
