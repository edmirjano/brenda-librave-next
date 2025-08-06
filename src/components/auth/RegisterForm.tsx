'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Check, Eye, EyeOff, Lock, Mail, Sparkles, User, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { LiquidButton } from '@/components/ui/LiquidButton';
import { GlassFormField } from '@/components/ui/form/GlassFormField';
import { SocialAuthButtons } from './SocialAuthButtons';

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
    <motion.div
      className="w-full max-w-md mx-auto p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header with Albanian branding */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="mb-4">
          <motion.div
            className="w-16 h-16 mx-auto bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Krijoni llogarinë tuaj</h1>
        <p className="text-gray-700">
          Bashkohuni me{' '}
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
            Brënda Librave
          </span>{' '}
          sot
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <GlassFormField
          label="Emri i plotë"
          type="text"
          placeholder="Shkruani emrin tuaj të plotë"
          autoComplete="name"
          icon={<User className="h-5 w-5" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <GlassFormField
          label="Email"
          type="email"
          placeholder="Shkruani email-in tuaj"
          autoComplete="email"
          icon={<Mail className="h-5 w-5" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="relative">
          <GlassFormField
            label="Fjalëkalimi"
            type={showPassword ? 'text' : 'password'}
            placeholder="Krijoni një fjalëkalim të fortë"
            autoComplete="new-password"
            icon={<Lock className="h-5 w-5" />}
            error={errors.password?.message}
            {...register('password')}
          />
          <motion.button
            type="button"
            className="absolute right-4 top-12 text-gray-500 hover:text-gray-700 z-20"
            onClick={() => setShowPassword(!showPassword)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </motion.button>
        </div>

        {password && (
          <motion.div
            className="backdrop-blur-xl bg-green-50/30 border border-green-200/30 rounded-2xl p-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <h4 className="text-sm font-medium text-gray-800 mb-3">Kërkesat për fjalëkalimin:</h4>
            <ul className="space-y-2">
              {passwordRequirements.map((req, index) => (
                <motion.li
                  key={index}
                  className="flex items-center text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Check
                    className={`h-4 w-4 mr-2 transition-colors duration-200 ${req.check ? 'text-green-600' : 'text-gray-400'}`}
                  />
                  <span
                    className={`transition-colors duration-200 ${req.check ? 'text-green-700' : 'text-gray-600'}`}
                  >
                    {req.label}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        <div className="relative">
          <GlassFormField
            label="Konfirmoni fjalëkalimin"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Përsëritni fjalëkalimin tuaj"
            autoComplete="new-password"
            icon={<Lock className="h-5 w-5" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <motion.button
            type="button"
            className="absolute right-4 top-12 text-gray-500 hover:text-gray-700 z-20"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </motion.button>
        </div>

        <motion.div
          className="flex items-center space-x-3 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 30 }}
        >
          <input
            id="newsletter"
            type="checkbox"
            {...register('newsletter')}
            className="h-5 w-5 text-red-600 border-white/30 rounded-lg focus:ring-red-500/50 bg-white/20 backdrop-blur-xl"
          />
          <label htmlFor="newsletter" className="text-sm text-gray-800 cursor-pointer select-none">
            Dëshiroj të marr newsletter-in dhe ofertat speciale
          </label>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 30 }}
        >
          <LiquidButton
            type="submit"
            loading={isLoading}
            disabled={isLoading}
            variant="albanian"
            size="lg"
            className="w-full"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            {isLoading ? 'Duke krijuar llogarinë...' : 'Krijo llogarinë'}
          </LiquidButton>
        </motion.div>
      </motion.form>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
      >
        <SocialAuthButtons mode="register" />
      </motion.div>

      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.3 }}
      >
        <p className="text-sm text-gray-700">
          Keni një llogari?{' '}
          <Link
            href="/auth/login"
            className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-all duration-200"
          >
            Hyni këtu
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
