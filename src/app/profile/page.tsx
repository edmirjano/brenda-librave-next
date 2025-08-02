import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm';
import { ProfileForm } from '@/components/auth/ProfileForm';

import { authOptions } from '@/lib/auth/config';

export const metadata: Metadata = {
  title: 'Profili im | Brënda Librave',
  description: 'Menaxho të dhënat e profilit tuaj dhe preferencat.',
  robots: {
    index: false,
    follow: true,
  },
};

// getUserProfile function removed - using session data directly for now

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  // For now, we'll use session data and let the client fetch the full profile
  const user = {
    id: session.user.id,
    name: session.user.name || '',
    email: session.user.email || '',
    role: session.user.role || 'USER',
    newsletter: false, // Default value
    emailVerified: null,
    createdAt: new Date(),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profili im</h1>
          <p className="mt-2 text-gray-600">
            Menaxho të dhënat e profilit tuaj dhe preferencat e llogarisë.
          </p>
        </div>

        <div className="space-y-8">
          <ProfileForm user={user} />
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
