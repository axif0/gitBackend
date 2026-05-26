'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

interface Review {
  name: string;
  text: string;
  rating: number;
  location: string;
}

const reviews: Review[] = [
  { name: 'স্বাক্ষর প্রামানিক', text: 'Best in the business. Keep it up. খুব সুন্দর পণ্য পেয়েছি!', rating: 5, location: 'ঢাকা' },
  { name: 'ফাতেমা আক্তার', text: 'অসাধারণ মান! দামের তুলনায় অনেক ভালো। আবারও কিনব।', rating: 5, location: 'চট্টগ্রাম' },
  { name: 'নুসরাত জাহান', text: 'প্যাকেজিং খুব সুন্দর ছিল। ডেলিভারিও দ্রুত হয়েছে।', rating: 5, location: 'সিলেট' },
  { name: 'তাসনিম রহমান', text: 'Really premium quality jewelry at affordable prices. Highly recommended!', rating: 5, location: 'রাজশাহী' },
  { name: 'সাবরিনা ইসলাম', text: 'বিয়েতে পরার জন্য নিয়েছিলাম। সবাই প্রশংসা করেছে!', rating: 5, location: 'খুলনা' },
];

export default function ReviewCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent(prev => (prev + 1) % reviews.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 150 : -150, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -150 : 150, opacity: 0 }),
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="text-xs sm:text-sm tracking-[2px] sm:tracking-[3px] uppercase font-serif-it" style={{ color: 'var(--gold)' }}>Testimonials</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bengali font-bold mt-2 sm:mt-3" style={{ color: 'var(--rose)' }}>কাস্টমার রিভিউ</h2>
        </motion.div>

        <div className="relative h-[260px] sm:h-[240px]">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <div className="card p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl text-center">
                <div className="absolute top-3 left-4 sm:top-4 sm:left-6 text-4xl sm:text-6xl font-serif leading-none" style={{ color: 'var(--gold)', opacity: 0.15 }}>&ldquo;</div>

                <div className="flex justify-center gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                  {[...Array(reviews[current].rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5" fill="var(--gold)" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>

                <p className="text-sm sm:text-lg md:text-xl mb-4 sm:mb-6 leading-relaxed font-bengali relative z-10" style={{ color: 'var(--text-secondary)' }}>
                  {reviews[current].text}
                </p>

                <div>
                  <p className="font-bengali font-semibold text-sm sm:text-base" style={{ color: 'var(--rose)' }}>{reviews[current].name}</p>
                  <p className="text-xs sm:text-sm font-bengali" style={{ color: 'var(--text-muted)' }}>📍 {reviews[current].location}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === current ? '1.5rem' : '0.5rem',
                background: i === current ? 'var(--gold)' : 'var(--border)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
