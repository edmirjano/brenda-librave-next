import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';

import { authOptions } from '@/lib/auth/config';

export const metadata: Metadata = {
  title: {
    template: '%s | Admin | Brënda Librave',
    default: 'Admin Dashboard | Brënda Librave',
  },
  description: 'Admin dashboard për menaxhimin e Brënda Librave.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated or not admin/transporter
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'TRANSPORTER')) {
    redirect('/auth/login?callbackUrl=/admin');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50/30 to-orange-50/30">
      <SessionProvider>
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 ml-64 p-8">
            {children}
          </main>
        </div>
        <ToastProvider />
      </SessionProvider>
    </div>
  );
}