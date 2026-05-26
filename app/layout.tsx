import type { Metadata } from 'next';
import { Hind_Siliguri, Playfair_Display, Cormorant_Garamond } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';
import '@/styles/premium-theme.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SakuraBackground from '@/components/SakuraBackground';
import { CartProvider } from '@/contexts/CartContext';
import { getSettings } from '@/lib/settings';

const ToastProvider = dynamic(() => import('@/components/ToastProvider'), { ssr: false });

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-bengali',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: { default: `${settings.siteName} | ${settings.siteNameEn}`, template: `%s | ${settings.siteName}` },
    description: settings.metaDescription,
    keywords: ['পাঁচমিশালি', 'Pachmishali', 'jewellery', 'watches', 'Nilphamari', 'Bangladesh'],
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://pachmishali.com'),
    openGraph: { type: 'website', locale: 'bn_BD', siteName: settings.siteName },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <html lang="bn" className={`${playfair.variable} ${hindSiliguri.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <head suppressHydrationWarning>
        {settings.faviconUrl && <link rel="icon" href={settings.faviconUrl} />}
      </head>
      <body className="font-bengali bg-sakura-50 text-ink antialiased">
        <SakuraBackground />
        <CartProvider>
          <Navbar settings={settings} />
          <main className="min-h-screen animate-fade-in-up">{children}</main>
          <Footer settings={settings} />
          <ToastProvider />
        </CartProvider>
      </body>
    </html>
  );
}
