'use client';

import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
      style={{
        background: theme === 'dark' ? 'linear-gradient(135deg, #F5ECD4, #B8860B)' : 'linear-gradient(135deg, #2D1B22, #6B1F35)',
        boxShadow: theme === 'dark' ? '0 4px 20px rgba(184,134,11,0.3)' : '0 4px 20px rgba(107,31,53,0.3)',
      }}
      aria-label={theme === 'dark' ? 'লাইট মোড' : 'ডার্ক মোড'}
    >
      {theme === 'dark' ? (
        <svg className="w-5 h-5 text-deep-rose" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      ) : (
        <svg className="w-5 h-5 text-gold-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
      )}
    </button>
  );
}
