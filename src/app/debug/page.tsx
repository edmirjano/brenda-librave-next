import { Metadata } from 'next';
import { getServerSession } from 'next-auth';

import {
  CheckCircle,
  Key,
  Lock,
  Mail,
  MapPin,
  Rocket,
  Settings,
  Sparkles,
  User,
  XCircle,
  Zap,
} from 'lucide-react';

import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db/prisma';
import { getTranslations } from 'next-intl/server';
import { DebugPageClient } from '@/components/pages/DebugPageClient';

export const metadata: Metadata = {
  title: 'Debug Info | Brënda Librave',
  description: 'Debug information for development',
  robots: {
    index: false,
    follow: false,
  },
};

// Helper function to safely show environment variables
function getSafeEnvVars() {
  const envVars = [
    { name: 'NODE_ENV', value: process.env.NODE_ENV || 'undefined', safe: true },
    { name: 'NEXTAUTH_URL', value: process.env.NEXTAUTH_URL || 'undefined', safe: true },
    {
      name: 'DATABASE_URL',
      value: process.env.DATABASE_URL ? '✓ Set' : '✗ Not set',
      safe: true,
    },
    {
      name: 'NEXTAUTH_SECRET',
      value: process.env.NEXTAUTH_SECRET ? '✓ Set' : '✗ Not set',
      safe: true,
    },
    {
      name: 'GOOGLE_CLIENT_ID',
      value: process.env.GOOGLE_CLIENT_ID ? '✓ Set' : '✗ Not set',
      safe: true,
    },
    {
      name: 'GOOGLE_CLIENT_SECRET',
      value: process.env.GOOGLE_CLIENT_SECRET ? '✓ Set' : '✗ Not set',
      safe: true,
    },
    {
      name: 'SENTRY_DSN',
      value: process.env.SENTRY_DSN ? '✓ Set' : '✗ Not set',
      safe: true,
    },
  ];

  return envVars.filter((env) => env.safe);
}

// Helper function to check database status
async function getDatabaseStatus() {
  try {
    const userCount = await prisma.user.count();
    const bookCount = await prisma.book.count();
    const orderCount = await prisma.order.count();

    return {
      status: 'Connected',
      userCount,
      bookCount,
      orderCount,
      error: null,
    };
  } catch (error) {
    return {
      status: 'Error',
      userCount: 0,
      bookCount: 0,
      orderCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Helper function to get demo users
async function getDemoUsers() {
  try {
    const users = await prisma.user.findMany({
      take: 5,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users;
  } catch (error) {
    console.error('Error fetching demo users:', error);
    return [];
  }
}

export default async function DebugPage() {
  const t = await getTranslations('debug');
  const session = await getServerSession(authOptions);
  const envVars = getSafeEnvVars();
  const dbStatus = await getDatabaseStatus();
  const demoUsers = await getDemoUsers();

  const debugData = {
    envVars,
    dbStatus,
    demoUsers,
    session,
  };

  return <DebugPageClient translations={t} debugData={debugData} />;
}