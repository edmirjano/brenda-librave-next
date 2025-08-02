import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from '@/lib/validations/auth';

describe('Auth validation schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'ValidPassword123!',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
        expect(result.data.password).toBe('ValidPassword123!');
      }
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'ValidPassword123!',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'short',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should trim and lowercase email', () => {
      const data = {
        email: '  TEST@EXAMPLE.COM  ',
        password: 'ValidPassword123!',
      };

      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
      }
    });
  });

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'StrongPassword123!',
        confirmPassword: 'StrongPassword123!',
        newsletter: true,
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject mismatched passwords', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'StrongPassword123!',
        confirmPassword: 'DifferentPassword123!',
        newsletter: false,
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid names', () => {
      const invalidData = {
        name: 'A', // Too short
        email: 'john@example.com',
        password: 'StrongPassword123!',
        confirmPassword: 'StrongPassword123!',
        newsletter: false,
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject names with invalid characters', () => {
      const invalidData = {
        name: 'John123!', // Numbers and special chars not allowed
        email: 'john@example.com',
        password: 'StrongPassword123!',
        confirmPassword: 'StrongPassword123!',
        newsletter: false,
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept Albanian characters in names', () => {
      const validData = {
        name: 'Agim Çela',
        email: 'agim@example.com',
        password: 'StrongPassword123!',
        confirmPassword: 'StrongPassword123!',
        newsletter: false,
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should default newsletter to false', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'StrongPassword123!',
        confirmPassword: 'StrongPassword123!',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.newsletter).toBe(false);
      }
    });
  });

  describe('updateProfileSchema', () => {
    it('should validate profile updates', () => {
      const validData = {
        name: 'Updated Name',
        newsletter: true,
      };

      const result = updateProfileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid names', () => {
      const invalidData = {
        name: 'A',
        newsletter: true,
      };

      const result = updateProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should trim names', () => {
      const data = {
        name: '  Trimmed Name  ',
        newsletter: false,
      };

      const result = updateProfileSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Trimmed Name');
      }
    });
  });

  describe('changePasswordSchema', () => {
    it('should validate password change', () => {
      const validData = {
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
        confirmNewPassword: 'NewPassword123!',
      };

      const result = changePasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject mismatched new passwords', () => {
      const invalidData = {
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
        confirmNewPassword: 'DifferentPassword123!',
      };

      const result = changePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should require all fields', () => {
      const invalidData = {
        currentPassword: '',
        newPassword: 'NewPassword123!',
        confirmNewPassword: 'NewPassword123!',
      };

      const result = changePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});