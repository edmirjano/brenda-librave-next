import { z } from 'zod';

import { validatePasswordStrength } from '@/lib/auth/password';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .transform((email) => email.trim()),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name must be less than 50 characters')
      .regex(/^[a-zA-ZëÇçĞğŞşÖöÜüÄäÎîÏïÀàÔô\s-']+$/, 'Name contains invalid characters')
      .transform((name) => name.trim()),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address')
      .toLowerCase()
      .transform((email) => email.trim()),
    password: z
      .string()
      .min(1, 'Password is required')
      .refine(
        (password) => {
          const validation = validatePasswordStrength(password);
          return validation.isValid;
        },
        {
          message: 'Password does not meet security requirements',
        }
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    language: z.enum(['SQ', 'EN']).default('SQ'),
    currency: z.enum(['ALL', 'EUR']).default('ALL'),
    newsletter: z.boolean().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-ZëÇçĞğŞşÖöÜüÄäÎîÏïÀàÔô\s-']+$/, 'Name contains invalid characters')
    .transform((name) => name.trim()),
  language: z.enum(['SQ', 'EN']),
  currency: z.enum(['ALL', 'EUR']),
  newsletter: z.boolean(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(1, 'New password is required')
      .refine(
        (password) => {
          const validation = validatePasswordStrength(password);
          return validation.isValid;
        },
        {
          message: 'New password does not meet security requirements',
        }
      ),
    confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match',
    path: ['confirmNewPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
