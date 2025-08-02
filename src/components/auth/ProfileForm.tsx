'use client';

import { useState } from 'react';

import { useSession } from 'next-auth/react';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock, Mail, Save, Shield, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';
import { GlassFormField } from '@/components/ui/form/GlassFormField';

import { type UpdateProfileFormData, updateProfileSchema } from '@/lib/validations/auth';

interface ProfileUser {
  id: string;
  name: string;
  email: string;
  role: string;
  newsletter: boolean;
  emailVerified: Date | null;
  createdAt: Date;
}

interface ProfileFormProps {
  user: ProfileUser;
  onUpdate?: (user: ProfileUser) => void;
}

export function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const { data: _session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [_message, _setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
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

      // Note: Session update will happen on next page refresh/reload
      // NextAuth.js will automatically pick up the updated user data

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <GlassCard className="p-8">
        {/* Header */}
        <motion.div
          className="flex items-center mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Informacionet personale</h2>
            <p className="text-gray-600 text-sm">Menaxho të dhënat e profilit tuaj</p>
          </div>
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
            icon={<User className="h-5 w-5" />}
            error={errors.name?.message}
            {...register('name')}
          />

          <GlassFormField
            label="Email"
            type="email"
            value={user.email}
            disabled
            icon={<Mail className="h-5 w-5" />}
            helperText="Email-i nuk mund të ndryshohet"
          />

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
            <label
              htmlFor="newsletter"
              className="text-sm text-gray-800 cursor-pointer select-none"
            >
              Dëshiroj të marr newsletter-in dhe ofertat speciale
            </label>
          </motion.div>

          <motion.div
            className="flex justify-end"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 30 }}
          >
            <LiquidButton
              type="submit"
              loading={isLoading}
              disabled={!isDirty || isLoading}
              variant="albanian"
              size="lg"
              className="min-w-[180px]"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Duke ruajtur...' : 'Ruaj ndryshimet'}
            </LiquidButton>
          </motion.div>
        </motion.form>

        {/* Account Information */}
        <motion.div
          className="mt-8 pt-6 border-t border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 300, damping: 30 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-red-600" />
            Informacionet e llogarisë
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-800">Krijuar më</span>
              </div>
              <p className="text-sm text-gray-700">
                {new Date(user.createdAt).toLocaleDateString('sq-AL')}
              </p>
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-800">Roli</span>
              </div>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'ADMIN'
                    ? 'bg-red-100/80 text-red-800'
                    : 'bg-green-100/80 text-green-800'
                }`}
              >
                {user.role === 'ADMIN' ? '👑 Administrator' : '👤 Përdorues'}
              </span>
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-800">Email verifikuar</span>
              </div>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  user.emailVerified
                    ? 'bg-green-100/80 text-green-800'
                    : 'bg-yellow-100/80 text-yellow-800'
                }`}
              >
                {user.emailVerified ? (
                  <>
                    <CheckCircle className="h-4 w-4 inline mr-1" /> Po
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 inline mr-1" /> Jo
                  </>
                )}
              </span>
            </div>
          </div>
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}
