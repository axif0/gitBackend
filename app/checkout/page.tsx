'use client';

import { Suspense } from 'react';
import CheckoutContent from './CheckoutContent';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-8"><div className="h-96 bg-sakura-100 rounded-2xl animate-pulse" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
