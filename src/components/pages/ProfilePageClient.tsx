'use client';

import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm';
import { ProfileForm } from '@/components/auth/ProfileForm';

interface ProfilePageClientProps {
  translations: any;
  user: any;
}

export function ProfilePageClient({ translations, user }: ProfilePageClientProps) {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{translations('title')}</h1>
        <p className="mt-2 text-gray-600">
          {translations('subtitle')}
        </p>
      </div>

      <div className="space-y-8">
        <ProfileForm user={user} />
        <ChangePasswordForm />
      </div>
    </div>
  );
} 