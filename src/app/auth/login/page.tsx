import { Suspense } from 'react';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth/config';
import { LoginForm } from '@/components/auth/LoginForm';

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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Suspense fallback={<div>Duke ngarkuar...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}