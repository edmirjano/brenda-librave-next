import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      language: string;
      currency: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: string;
    language: string;
    currency: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    language?: string;
    currency?: string;
    sub?: string;
    name?: string;
    email?: string;
    picture?: string;
    iat?: number;
    exp?: number;
    jti?: string;
  }
}

export type UserRole = 'USER' | 'ADMIN';
export type UserLanguage = 'SQ' | 'EN';
export type UserCurrency = 'ALL' | 'EUR';
