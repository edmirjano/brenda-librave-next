import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ProfilePageClient } from '@/components/pages/ProfilePageClient';

import { authOptions } from '@/lib/auth/config';

export const metadata: Metadata = {
  title: 'Profili im | Brënda Librave',
  description: 'Menaxho të dhënat e profilit tuaj dhe preferencat.',
  robots: {
    index: false,
    follow: true,
  },
};

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

  const t = await getTranslations('profile');

  return <ProfilePageClient translations={t} user={user} />;
}
