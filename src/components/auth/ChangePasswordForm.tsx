'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Eye, EyeOff, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/form/FormField';

import { type ChangePasswordFormData, changePasswordSchema } from '@/lib/validations/auth';

export function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const newPassword = watch('newPassword');
  const passwordRequirements = [
    { label: 'Të paktën 8 karaktere', check: newPassword?.length >= 8 },
    { label: 'Një shkronjë e madhe', check: /[A-Z]/.test(newPassword || '') },
    { label: 'Një shkronjë e vogël', check: /[a-z]/.test(newPassword || '') },
    { label: 'Një numër', check: /\d/.test(newPassword || '') },
    { label: 'Një karakter special', check: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword || '') },
  ];

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Password change failed');
      }

      toast.success('Fjalëkalimi u ndryshua me sukses!');
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ndryshimi i fjalëkalimit dështoi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center mb-6">
        <Lock className="h-6 w-6 text-gray-400 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">Ndrysho fjalëkalimin</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="relative">
          <FormField
            label="Fjalëkalimi aktual"
            type={showCurrentPassword ? 'text' : 'password'}
            autoComplete="current-password"
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />
          <button
            type="button"
            className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <div className="relative">
          <FormField
            label="Fjalëkalimi i ri"
            type={showNewPassword ? 'text' : 'password'}
            autoComplete="new-password"
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />
          <button
            type="button"
            className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {newPassword && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Kërkesat për fjalëkalimin e ri:
            </h4>
            <ul className="space-y-1">
              {passwordRequirements.map((req, index) => (
                <li key={index} className="flex items-center text-sm">
                  <Check
                    className={`h-4 w-4 mr-2 ${req.check ? 'text-green-500' : 'text-gray-400'}`}
                  />
                  <span className={req.check ? 'text-green-700' : 'text-gray-600'}>
                    {req.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="relative">
          <FormField
            label="Konfirmo fjalëkalimin e ri"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            error={errors.confirmNewPassword?.message}
            {...register('confirmNewPassword')}
          />
          <button
            type="button"
            className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={isLoading} className="min-w-[160px]">
            Ndrysho fjalëkalimin
          </Button>
        </div>
      </form>
    </div>
  );
}
