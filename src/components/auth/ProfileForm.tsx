'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { Save, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { updateProfileSchema, type UpdateProfileFormData } from '@/lib/validations/auth';
import { FormField } from '@/components/ui/form/FormField';
import { Button } from '@/components/ui/Button';

interface ProfileUser {
  id: string;
  name: string;
  email: string;
  role: string;
  language: string;
  currency: string;
  newsletter: boolean;
  emailVerified: Date | null;
  createdAt: Date;
}

interface ProfileFormProps {
  user: ProfileUser;
  onUpdate?: (user: ProfileUser) => void;
}

export function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { update } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      language: user.language as 'SQ' | 'EN',
      currency: user.currency as 'ALL' | 'EUR',
      newsletter: user.newsletter,
    },
  });

  const onSubmit = async (data: UpdateProfileFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Update failed');
      }

      toast.success('Profili u përditësua me sukses!');
      
      // Update session data
      await update({
        name: data.name,
        language: data.language,
        currency: data.currency,
      });

      // Call onUpdate callback if provided
      if (onUpdate) {
        onUpdate(result.user);
      }

      // Reset form dirty state
      reset(data);

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Përditësimi dështoi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center mb-6">
        <User className="h-6 w-6 text-gray-400 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">
          Informacionet personale
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          label="Emri i plotë"
          type="text"
          error={errors.name?.message}
          {...register('name')}
        />

        <FormField
          label="Email"
          type="email"
          value={user.email}
          disabled
          helperText="Email-i nuk mund të ndryshohet"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gjuha e preferuar
            </label>
            <select
              {...register('language')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="SQ">Shqip</option>
              <option value="EN">English</option>
            </select>
            {errors.language && (
              <p className="text-sm text-red-600 mt-1">{errors.language.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monedha e preferuar
            </label>
            <select
              {...register('currency')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">Lek Shqiptar (ALL)</option>
              <option value="EUR">Euro (EUR)</option>
            </select>
            {errors.currency && (
              <p className="text-sm text-red-600 mt-1">{errors.currency.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="newsletter"
            type="checkbox"
            {...register('newsletter')}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="newsletter" className="ml-2 text-sm text-gray-700">
            Dëshiroj të marr newsletter-in dhe ofertat speciale
          </label>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            loading={isLoading}
            disabled={!isDirty}
            className="min-w-[120px]"
          >
            <Save className="w-4 h-4 mr-2" />
            Ruaj ndryshimet
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-500 space-y-1">
          <p>Llogaria u krijua: {new Date(user.createdAt).toLocaleDateString('sq-AL')}</p>
          <p>Roli: {user.role === 'ADMIN' ? 'Administrator' : 'Përdorues'}</p>
          <p>Email i verifikuar: {user.emailVerified ? 'Po' : 'Jo'}</p>
        </div>
      </div>
    </div>
  );
}