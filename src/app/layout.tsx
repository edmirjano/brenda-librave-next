import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { SessionProvider } from '@/components/providers/SessionProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Brënda Librave',
    default: 'Brënda Librave - Libraria Juaj Shqiptare Online',
  },
  description: 'Zbuloni libra shqiptarë dhe ndërkombëtarë në librarinë tonë online. Porositni libra fizikë dhe dixhitalë me çmime të favorshme.',
  keywords: ['libra shqiptarë', 'librari online', 'libra dixhitalë', 'literatura shqiptare', 'Albanian books'],
  authors: [{ name: 'Brënda Librave' }],
  creator: 'Brënda Librave',
  publisher: 'Brënda Librave',
  metadataBase: new URL('https://brendalibrave.netlify.app'),
  alternates: {
    canonical: '/',
    languages: {
      'sq': '/sq',
      'en': '/en',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sq" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider>
          {children}
          <ToastProvider />
        </SessionProvider>
      </body>
    </html>
  );
} 