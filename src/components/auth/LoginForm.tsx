'use client';

import { useState } from 'react';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { BookOpen, Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { LiquidButton } from '@/components/ui/LiquidButton';
import { GlassFormField } from '@/components/ui/form/GlassFormField';
import { SocialAuthButtons } from './SocialAuthButtons';

import { type LoginFormData, loginSchema } from '@/lib/validations/auth';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid email or password');
      } else {
        toast.success('Welcome back!');
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            <BookOpen className="h-8 w-8 text-white" />
          </motion.div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mirësevini përsëri</h1>
        <p className="text-gray-700">
          Hyni në{' '}
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
            Brënda Librave
          </span>
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
            placeholder="Shkruani fjalëkalimin tuaj"
            autoComplete="current-password"
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

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
        >
          <LiquidButton
            type="submit"
            loading={isLoading}
            disabled={isLoading}
            variant="albanian"
            size="lg"
            className="w-full"
          >
            <LogIn className="w-5 h-5 mr-2" />
            {isLoading ? 'Duke u kyçur...' : 'Hyni në llogari'}
          </LiquidButton>
        </motion.div>
      </motion.form>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <SocialAuthButtons mode="login" />
      </motion.div>

      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <p className="text-sm text-gray-700">
          Nuk keni llogari?{' '}
          <Link
            href="/auth/register"
            className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-all duration-200"
          >
            Regjistrohuni këtu
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
