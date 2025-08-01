import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

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
  interface JWT extends DefaultJWT {
    role: string;
    language: string;
    currency: string;
  }
}

export type UserRole = 'USER' | 'ADMIN';
export type UserLanguage = 'SQ' | 'EN';
export type UserCurrency = 'ALL' | 'EUR';