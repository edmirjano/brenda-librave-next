import { Suspense } from 'react';

import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { LoginForm } from '@/components/auth/LoginForm';
import { GlassCard } from '@/components/ui/GlassCard';

import { authOptions } from '@/lib/auth/config';

export const metadata: Metadata = {
  title: 'Hyrje | Brënda Librave',
  description: 'Hyni në llogarinë tuaj në Brënda Librave për të aksesuar librat tuaj dhe më shumë.',
  robots: {
    index: false,
    follow: true,
  },
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  // Redirect if already logged in
  if (session) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-100/20 to-purple-100/20"></div>
      </div>

      <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <GlassCard hover={false} className="p-2">
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                <span className="ml-3 text-gray-700">Duke ngarkuar...</span>
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </GlassCard>
      </div>
    </div>
  );
}
