import { NextAuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcryptjs';

import { prisma } from '@/lib/db/prisma';
import { logError, logInfo, logSecurity } from '@/lib/logging/logger';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          logSecurity('Failed login attempt - missing credentials', {
            email: credentials?.email,
            timestamp: new Date().toISOString(),
          });
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase(),
            },
          });

          if (!user || !user.password) {
            logSecurity('Failed login attempt - user not found or no password', {
              email: credentials.email,
              timestamp: new Date().toISOString(),
            });
            return null;
          }

          const isPasswordValid = await compare(credentials.password, user.password);

          if (!isPasswordValid) {
            logSecurity('Failed login attempt - invalid password', {
              email: credentials.email,
              userId: user.id,
              timestamp: new Date().toISOString(),
            });
            return null;
          }

          logInfo('Successful login', {
            userId: user.id,
            email: user.email,
            role: user.role,
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            language: user.language,
            currency: user.currency,
            image: user.image,
          };
        } catch (error) {
          logError('Login error', error, {
            email: credentials.email,
          });
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.language = user.language;
        token.currency = user.currency;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.language = token.language as string;
        session.user.currency = token.currency as string;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      logInfo('User signed in', {
        userId: user.id,
        email: user.email,
        provider: account?.provider,
        isNewUser,
      });
    },
    async signOut({ token }) {
      logInfo('User signed out', {
        userId: token?.sub,
      });
    },
  },
  debug: process.env.NODE_ENV === 'development',
};
