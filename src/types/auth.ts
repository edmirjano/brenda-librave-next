import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
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
