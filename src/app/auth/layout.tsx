import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { SessionProvider } from '@/components/providers/SessionProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';

import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Brënda Librave',
    default: 'Autentifikim | Brënda Librave',
  },
  description: 'Hyni ose regjistrohuni në Brënda Librave për të aksesuar librat tuaj.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider>
          <main className="min-h-screen">{children}</main>
          <ToastProvider />
        </SessionProvider>
      </body>
    </html>
  );
}
