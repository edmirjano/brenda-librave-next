import { hashPassword, validatePasswordStrength, verifyPassword } from '@/lib/auth/password';

describe('Password utilities', () => {
  describe('validatePasswordStrength', () => {
    it('should validate strong passwords', () => {
      const strongPassword = 'StrongPass123!';
      const result = validatePasswordStrength(strongPassword);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject passwords that are too short', () => {
      const shortPassword = 'Short1!';
      const result = validatePasswordStrength(shortPassword);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should reject passwords without uppercase letters', () => {
      const noUppercase = 'lowercase123!';
      const result = validatePasswordStrength(noUppercase);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject passwords without lowercase letters', () => {
      const noLowercase = 'UPPERCASE123!';
      const result = validatePasswordStrength(noLowercase);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject passwords without numbers', () => {
      const noNumbers = 'NoNumbers!';
      const result = validatePasswordStrength(noNumbers);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should reject passwords without special characters', () => {
      const noSpecial = 'NoSpecial123';
      const result = validatePasswordStrength(noSpecial);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });

    it('should reject common passwords', () => {
      const commonPassword = 'password';
      const result = validatePasswordStrength(commonPassword);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password is too common');
    });

    it('should reject passwords that are too long', () => {
      const tooLong = 'a'.repeat(129) + 'A1!';
      const result = validatePasswordStrength(tooLong);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be less than 128 characters');
    });
  });

  describe('hashPassword', () => {
    it('should hash passwords successfully', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(50); // bcrypt hashes are long
    });

    it('should produce different hashes for the same password', async () => {
      const password = 'TestPassword123!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2); // Salt should make them different
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct passwords', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await hashPassword(password);
      const isValid = await verifyPassword(password, hashedPassword);

      expect(isValid).toBe(true);
    });

    it('should reject incorrect passwords', async () => {
      const password = 'TestPassword123!';
      const wrongPassword = 'WrongPassword123!';
      const hashedPassword = await hashPassword(password);
      const isValid = await verifyPassword(wrongPassword, hashedPassword);

      expect(isValid).toBe(false);
    });

    it('should handle invalid hashes gracefully', async () => {
      const password = 'TestPassword123!';
      const invalidHash = 'invalid-hash';
      const isValid = await verifyPassword(password, invalidHash);

      expect(isValid).toBe(false);
    });
  });
});