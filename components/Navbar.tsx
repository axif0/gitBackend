'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-serif font-bold text-gold-700">
            Luxe Jewels
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gold-600 transition-colors">
              Home
            </Link>
            <Link href="/shop" className="text-gray-700 hover:text-gold-600 transition-colors">
              Shop
            </Link>
            <Link href="/sales" className="text-gray-700 hover:text-gold-600 transition-colors">
              Sales
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-gold-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gold-50" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link href="/shop" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gold-50" onClick={() => setIsOpen(false)}>
              Shop
            </Link>
            <Link href="/sales" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gold-50" onClick={() => setIsOpen(false)}>
              Sales
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
