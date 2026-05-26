'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        success: {
          style: {
            background: 'var(--rose)',
            color: 'var(--text-inverse)',
            borderLeft: '4px solid var(--gold)',
            borderRadius: '12px',
            fontFamily: 'var(--font-bengali)',
          },
        },
        error: {
          style: {
            background: 'var(--bg-card)',
            color: 'var(--error)',
            borderLeft: '4px solid var(--error)',
            borderRadius: '12px',
            fontFamily: 'var(--font-bengali)',
            border: '1px solid var(--border)',
          },
        },
      }}
    />
  );
}
