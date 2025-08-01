'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/form/FormField';

import { type RegisterFormData, registerSchema } from '@/lib/validations/auth';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      language: 'SQ',
      currency: 'ALL',
      newsletter: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      toast.success('Account created successfully! Please login.');
      router.push('/auth/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const password = watch('password');
  const passwordRequirements = [
    { label: 'Të paktën 8 karaktere', check: password?.length >= 8 },
    { label: 'Një shkronjë e madhe', check: /[A-Z]/.test(password || '') },
    { label: 'Një shkronjë e vogël', check: /[a-z]/.test(password || '') },
    { label: 'Një numër', check: /\d/.test(password || '') },
    { label: 'Një karakter special', check: /[!@#$%^&*(),.?":{}|<>]/.test(password || '') },
  ];

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Krijoni llogarinë tuaj</h1>
        <p className="text-gray-600">Bashkohuni me Brënda Librave sot</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          label="Emri i plotë"
          type="text"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />

        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="relative">
          <FormField
            label="Fjalëkalimi"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {password && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Kërkesat për fjalëkalimin:</h4>
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
            label="Konfirmoni fjalëkalimin"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <button
            type="button"
            className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gjuha</label>
            <select
              {...register('language')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="SQ">Shqip</option>
              <option value="EN">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Monedha</label>
            <select
              {...register('currency')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">Lek Shqiptar (ALL)</option>
              <option value="EUR">Euro (EUR)</option>
            </select>
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

        <Button type="submit" loading={isLoading} className="w-full" size="lg">
          <UserPlus className="w-5 h-5 mr-2" />
          Krijo llogarinë
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Keni një llogari?{' '}
          <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
            Hyni këtu
          </Link>
        </p>
      </div>
    </div>
  );
}
