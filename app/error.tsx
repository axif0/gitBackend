'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4" style={{ color: 'var(--error)' }}>!</h1>
        <h2 className="text-2xl font-bengali font-bold mb-4" style={{ color: 'var(--text-primary)' }}>কিছু সমস্যা হয়েছে</h2>
        <p className="mb-8 font-bengali" style={{ color: 'var(--text-muted)' }}>দুঃখিত, একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।</p>
        <div className="flex gap-4 justify-center">
          <button onClick={reset} className="btn-primary">আবার চেষ্টা করুন</button>
          <Link href="/" className="btn-secondary">হোমপেজে যান</Link>
        </div>
      </div>
    </div>
  );
}
