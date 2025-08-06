'use client';

import { usePathname } from 'next/navigation';

import { Footer } from './Footer';
import { Navigation } from './Navigation';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/auth');
  const isAdminRoute = pathname?.startsWith('/admin');
  const isProfileRoute = pathname?.startsWith('/profile');

  // Routes that should not have header/footer
  if (isAuthRoute || isAdminRoute || isProfileRoute) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Navigation />
      <main className="pt-16">{children}</main>
      <Footer />
    </>
  );
}