import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Footer } from '@/components/layout/Footer';
import { Navigation } from '@/components/layout/Navigation';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Brënda Librave',
    default: 'Brënda Librave - Libraria Juaj Shqiptare Online',
  },
  description:
    'Zbuloni libra shqiptarë dhe ndërkombëtarë në librarinë tonë online. Porositni libra fizikë dhe dixhitalë me çmime të favorshme.',
  keywords: [
    'libra shqiptarë',
    'librari online',
    'libra dixhitalë',
    'literatura shqiptare',
    'Albanian books',
  ],
  authors: [{ name: 'Brënda Librave' }],
  creator: 'Brënda Librave',
  publisher: 'Brënda Librave',
  metadataBase: new URL('https://brendalibrave.netlify.app'),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#dc2626' },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
    languages: {
      sq: '/sq',
      en: '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'sq_AL',
    url: 'https://brendalibrave.netlify.app',
    title: 'Brënda Librave - Libraria Juaj Shqiptare Online',
    description: 'Zbuloni libra shqiptarë dhe ndërkombëtarë në librarinë tonë online.',
    siteName: 'Brënda Librave',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brënda Librave - Libraria Juaj Shqiptare Online',
    description: 'Zbuloni libra shqiptarë dhe ndërkombëtarë në librarinë tonë online.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider>
          <Navigation />
          <main className="pt-16">{children}</main>
          <Footer />
          <ToastProvider />
        </SessionProvider>
      </body>
    </html>
  );
}
