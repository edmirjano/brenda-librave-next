import { Metadata } from 'next';

import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm';

export const metadata: Metadata = {
  title: 'Ndrysho fjalëkalimin',
  description: 'Ndryshoni fjalëkalimin e llogarisë suaj.',
};

export default function ChangePasswordPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ndrysho fjalëkalimin</h1>
        <p className="mt-2 text-gray-600">
          Për sigurinë e llogarisë tuaj, zgjidhni një fjalëkalim të fortë.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <ChangePasswordForm />
      </div>
    </div>
  );
}