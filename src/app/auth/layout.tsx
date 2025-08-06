import type { Metadata } from 'next';

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
    <div className="min-h-screen">
      {children}
    </div>
  );
}
