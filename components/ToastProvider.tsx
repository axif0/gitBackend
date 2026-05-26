'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        success: {
          style: {
            background: '#6B1F35',
            color: '#FEFAF5',
            borderLeft: '4px solid #B8860B',
            borderRadius: '12px',
            fontFamily: 'var(--font-bengali)',
          },
        },
        error: {
          style: {
            background: '#FAE8F1',
            color: '#6B1F35',
            borderLeft: '4px solid #A0384F',
            borderRadius: '12px',
            fontFamily: 'var(--font-bengali)',
          },
        },
      }}
    />
  );
}
