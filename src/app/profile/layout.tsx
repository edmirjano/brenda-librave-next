import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { ProfileSidebar } from '@/components/profile/ProfileSidebar';

import { authOptions } from '@/lib/auth/config';

export const metadata: Metadata = {
  title: {
    template: '%s | Profili | Brënda Librave',
    default: 'Profili im | Brënda Librave',
  },
  description: 'Menaxho të dhënat e profilit tuaj dhe preferencat.',
  robots: {
    index: false,
    follow: true,
  },
};

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated
  if (!session) {
    redirect('/auth/login?callbackUrl=/profile');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="flex">
        <ProfileSidebar />
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}