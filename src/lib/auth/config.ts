import { NextAuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import AppleProvider from 'next-auth/providers/apple';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcryptjs';

import { prisma } from '@/lib/db/prisma';
import { logError, logInfo, logSecurity } from '@/lib/logging/logger';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID!,
      clientSecret: process.env.APPLE_SECRET!,
    }),
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
    async signIn({ user, account, profile }) {
      // Allow credentials sign in
      if (account?.provider === 'credentials') {
        return true;
      }

      // Handle social sign in - ensure user has USER role
      if (account?.provider && ['google', 'facebook', 'apple'].includes(account.provider)) {
        try {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            // User will be created by the adapter, but we need to ensure the role is set
            // The adapter will handle user creation, we'll update the role in the jwt callback
            return true;
          }

          return true;
        } catch (error) {
          logError('Social sign in error', error, {
            provider: account.provider,
            email: user.email,
          });
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        
        // For new social auth users, ensure they have USER role
        if (account?.provider && ['google', 'facebook', 'apple'].includes(account.provider) && !user.role) {
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: { role: 'USER' },
            });
            token.role = 'USER';
          } catch (error) {
            logError('Failed to set USER role for social auth user', error, {
              userId: user.id,
              provider: account.provider,
            });
            token.role = 'USER'; // Default fallback
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
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
