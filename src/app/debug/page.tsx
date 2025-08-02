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
  const safeVars: Record<string, string | undefined> = {};
  const envVars = [
    'NODE_ENV',
    'NEXT_PUBLIC_APP_URL',
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'SENTRY_ENVIRONMENT',
    'VERCEL_ENV',
    'VERCEL_URL',
    'PORT',
  ];

  envVars.forEach((key) => {
    const value = process.env[key];
    if (value) {
      // Mask sensitive parts of URLs and connection strings
      if (key === 'DATABASE_URL' && value.includes('://')) {
        const url = new URL(value);
        safeVars[key] =
          `${url.protocol}//${url.username ? '***:***@' : ''}${url.host}${url.pathname}`;
      } else if (key === 'NEXTAUTH_SECRET') {
        safeVars[key] = value ? '***' : 'Not set';
      } else {
        safeVars[key] = value;
      }
    } else {
      safeVars[key] = 'Not set';
    }
  });

  return safeVars;
}

// Get database status and demo users
async function getDatabaseStatus() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const userCount = await prisma.user.count();
    return {
      status: 'Connected',
      userCount,
      error: null,
    };
  } catch (error) {
    return {
      status: 'Error',
      userCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Get demo users for testing
async function getDemoUsers() {
  try {
    const demoUsers = await prisma.user.findMany({
      where: {
        email: {
          in: [
            'admin@brendalibrave.com',
            'user@brendalibrave.com',
            'test@brendalibrave.com',
            'demo@brendalibrave.com',
          ],
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        role: 'desc', // ADMIN first, then USER
      },
    });

    return demoUsers;
  } catch (error) {
    return [];
  }
}

// Current phase routes
const phaseRoutes = {
  'Phase 1': ['/ (Homepage)', '/api/health (Health check)'],
  'Phase 2 (Current)': [
    '/auth/login (Login page)',
    '/auth/register (Registration page)',
    '/auth/error (Auth error page)',
    '/profile (User profile)',
    '/api/auth/[...nextauth] (NextAuth endpoints)',
    '/api/auth/register (User registration)',
    '/api/user/profile (Profile management)',
    '/api/user/change-password (Password change)',
    '/api/exchange-rate (Exchange rate)',
    '/debug (This page)',
  ],
  'Phase 3 (Future)': [
    '/books (Book catalog - Not implemented)',
    '/books/[slug] (Book details - Not implemented)',
    '/api/books (Books API - Not implemented)',
    '/api/categories (Categories API - Not implemented)',
  ],
  'Phase 4+ (Future)': [
    '/admin (Admin dashboard - Not implemented)',
    '/admin/books (Book management - Not implemented)',
    '/cart (Shopping cart - Not implemented)',
    '/checkout (Checkout - Not implemented)',
  ],
};

export default async function DebugPage() {
  const session = await getServerSession(authOptions);
  const envVars = getSafeEnvVars();
  const dbStatus = await getDatabaseStatus();
  const demoUsers = await getDemoUsers();

  const systemInfo = {
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform,
    uptime: Math.floor(process.uptime()),
    memoryUsage: process.memoryUsage(),
    currentPhase: 'Phase 2: Authentication System',
    buildTimestamp: process.env.BUILD_TIME || 'Unknown',
  };

  // Demo user credentials for testing
  const demoCredentials = [
    {
      email: 'admin@brendalibrave.com',
      password: 'Admin123!',
      role: 'ADMIN',
      name: 'Admin User',
      description: 'Full admin access to all features',
    },
    {
      email: 'user@brendalibrave.com',
      password: 'User123!',
      role: 'USER',
      name: 'Regular User',
      description: 'Standard user with basic access',
    },
    {
      email: 'test@brendalibrave.com',
      password: 'Test123!',
      role: 'USER',
      name: 'Test User',
      description: 'User for general testing purposes',
    },
    {
      email: 'demo@brendalibrave.com',
      password: 'Demo123!',
      role: 'USER',
      name: 'Demo User',
      description: 'Demo account for showcasing features',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-100/20 to-purple-100/20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-6 mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Settings className="h-10 w-10 text-red-600" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
                Debug Dashboard
              </span>
            </h1>
            <p className="text-lg text-gray-700">
              Development debugging dashboard for{' '}
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
                Brënda Librave
              </span>
            </p>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-100/80 border border-green-300/50 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-green-800 font-medium text-sm">
                Live Development Environment
              </span>
            </div>
          </div>
        </div>

        {/* Grid Layout for Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Current Phase Status */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Development Phase</h2>
            </div>
            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/50 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 text-lg">{systemInfo.currentPhase}</h3>
                  <p className="text-blue-700 text-sm mt-1">
                    Authentication system with user registration, login, profile management
                  </p>
                  <div className="mt-2 inline-flex items-center px-2 py-1 bg-green-100/80 rounded-full">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
                    <span className="text-green-800 text-xs font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Session Information */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Session Status</h2>
            </div>
            {session ? (
              <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 border border-green-200/50 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="font-bold text-green-900">Authenticated</h3>
                      <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium text-green-800">User:</span>{' '}
                        {session.user?.name || 'Unknown'}
                      </p>
                      <p>
                        <span className="font-medium text-green-800">Email:</span>{' '}
                        {session.user?.email || 'Unknown'}
                      </p>
                      <p>
                        <span className="font-medium text-green-800">Role:</span>{' '}
                        {(session.user as { role?: string })?.role || 'USER'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-red-50/80 to-rose-50/80 border border-red-200/50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-red-900">Not Authenticated</h3>
                    <p className="text-red-700 text-sm">Please log in to see session details</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Database Status */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-lg">🗄️</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Database Status</h2>
            </div>
            <div
              className={`rounded-xl p-4 border ${
                dbStatus.status === 'Connected'
                  ? 'bg-gradient-to-r from-green-50/80 to-emerald-50/80 border-green-200/50'
                  : 'bg-gradient-to-r from-red-50/80 to-rose-50/80 border-red-200/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    dbStatus.status === 'Connected'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                      : 'bg-gradient-to-r from-red-500 to-rose-600'
                  }`}
                >
                  {dbStatus.status === 'Connected' ? (
                    <CheckCircle className="h-6 w-6 text-white" />
                  ) : (
                    <XCircle className="h-6 w-6 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3
                      className={`font-bold text-lg ${
                        dbStatus.status === 'Connected' ? 'text-green-900' : 'text-red-900'
                      }`}
                    >
                      {dbStatus.status}
                    </h3>
                    {dbStatus.status === 'Connected' && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    {dbStatus.status === 'Connected' && (
                      <span className="inline-flex items-center px-3 py-1 bg-green-100/80 rounded-full text-sm font-medium text-green-800">
                        👥 {dbStatus.userCount} Users
                      </span>
                    )}
                    <span className="text-sm text-gray-600">SQLite Database</span>
                  </div>
                  {dbStatus.error && (
                    <p className="text-red-600 text-sm mt-2">
                      <strong>Error:</strong> {dbStatus.error}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Demo Users for Testing */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-xl p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-lg">👥</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Demo Users for Testing</h2>
            </div>
            <div className="space-y-6">
              {/* Available Demo Credentials */}
              <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/50 rounded-xl p-5">
                <div className="flex items-center mb-4">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-2">
                    <Key className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-bold text-blue-900 text-lg">Available Demo Credentials</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {demoCredentials.map((user, index) => (
                    <div
                      key={index}
                      className="backdrop-blur-sm bg-white/70 border border-white/50 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              user.role === 'ADMIN'
                                ? 'bg-gradient-to-r from-red-500 to-red-600'
                                : 'bg-gradient-to-r from-green-500 to-green-600'
                            }`}
                          >
                            <span className="text-white text-sm">
                              {user.role === 'ADMIN' ? '👑' : '👤'}
                            </span>
                          </div>
                          <span className="font-bold text-gray-900">{user.name}</span>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            user.role === 'ADMIN'
                              ? 'bg-red-100/80 text-red-800 border border-red-200'
                              : 'bg-green-100/80 text-green-800 border border-green-200'
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">
                            Email
                          </span>
                          <div className="font-mono bg-gray-100/80 p-2 rounded-lg text-xs mt-1 border border-gray-200/50">
                            {user.email}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">
                            Password
                          </span>
                          <div className="font-mono bg-gray-100/80 p-2 rounded-lg text-xs mt-1 border border-gray-200/50 font-bold">
                            {user.password}
                          </div>
                        </div>
                        <p className="text-gray-600 text-xs mt-2 italic">{user.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Users in Database */}
              <div className="bg-gradient-to-r from-gray-50/80 to-slate-50/80 border border-gray-200/50 rounded-xl p-5">
                <div className="flex items-center mb-4">
                  <div className="w-6 h-6 bg-gradient-to-r from-gray-500 to-slate-600 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-sm">🗄️</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Demo Users in Database</h3>
                </div>
                {demoUsers.length > 0 ? (
                  <div className="overflow-hidden">
                    <div className="space-y-3">
                      {demoUsers.map((user) => (
                        <div
                          key={user.id}
                          className="backdrop-blur-sm bg-white/70 border border-white/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  user.role === 'ADMIN'
                                    ? 'bg-gradient-to-r from-red-500 to-red-600'
                                    : 'bg-gradient-to-r from-green-500 to-green-600'
                                }`}
                              >
                                <span className="text-white text-sm">
                                  {user.role === 'ADMIN' ? '👑' : '👤'}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">{user.name}</h4>
                                <p className="font-mono text-xs text-gray-600">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span
                                className={`px-2 py-1 text-xs rounded-full font-medium ${
                                  user.role === 'ADMIN'
                                    ? 'bg-red-100/80 text-red-800 border border-red-200'
                                    : 'bg-green-100/80 text-green-800 border border-green-200'
                                }`}
                              >
                                {user.role}
                              </span>
                              <div className="flex space-x-2">
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl">😕</span>
                    </div>
                    <p className="text-gray-600 font-medium">No demo users found in database</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Use the credentials above to create demo accounts via registration
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Testing Actions */}
              <div className="bg-gradient-to-r from-amber-50/80 to-yellow-50/80 border border-amber-200/50 rounded-xl p-5">
                <div className="flex items-center mb-4">
                  <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mr-2">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-bold text-amber-900 text-lg">Quick Testing Actions</h3>
                </div>
                <div className="flex flex-wrap gap-3 mb-4">
                  <a
                    href="/auth/login"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <span className="mr-2">🔐</span>
                    Go to Login
                  </a>
                  <a
                    href="/auth/register"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Go to Register
                  </a>
                  {session && (
                    <a
                      href="/profile"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </a>
                  )}
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-sm rounded-xl font-mono">
                    <Mail className="h-4 w-4 mr-2" />
                    admin@brendalibrave.com
                  </div>
                </div>
                <div className="bg-amber-100/60 border border-amber-200/50 rounded-lg p-3">
                  <p className="text-amber-800 text-sm flex items-start">
                    <span className="mr-2 text-base">💡</span>
                    <span>
                      <strong>Tip:</strong> Copy credentials above and paste them into the login
                      form for quick testing. All demo users are ready to use!
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Environment Variables */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-lg">🌍</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Environment Variables</h2>
            </div>
            <div className="bg-gradient-to-r from-teal-50/80 to-cyan-50/80 border border-teal-200/50 rounded-xl p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {Object.entries(envVars).map(([key, value]) => (
                  <div
                    key={key}
                    className="backdrop-blur-sm bg-white/60 border border-white/40 rounded-lg p-3 flex justify-between items-center"
                  >
                    <span className="font-mono text-sm font-medium text-teal-800">{key}:</span>
                    <span className="font-mono text-xs text-gray-700 ml-2 break-all">
                      {value || <span className="text-gray-400 italic">Not set</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Information */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">⚙️ System Information</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Timestamp:</strong> {systemInfo.timestamp}
                  </p>
                  <p>
                    <strong>Node Version:</strong> {systemInfo.nodeVersion}
                  </p>
                  <p>
                    <strong>Platform:</strong> {systemInfo.platform}
                  </p>
                  <p>
                    <strong>Uptime:</strong> {systemInfo.uptime}s
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Memory Usage:</strong>
                  </p>
                  <ul className="text-sm text-gray-600 ml-4">
                    <li>RSS: {Math.round(systemInfo.memoryUsage.rss / 1024 / 1024)}MB</li>
                    <li>
                      Heap Used: {Math.round(systemInfo.memoryUsage.heapUsed / 1024 / 1024)}MB
                    </li>
                    <li>
                      Heap Total: {Math.round(systemInfo.memoryUsage.heapTotal / 1024 / 1024)}MB
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Available Routes by Phase */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              🛣️ Available Routes by Phase
            </h2>
            <div className="space-y-4">
              {Object.entries(phaseRoutes).map(([phase, routes]) => (
                <div key={phase} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {phase}
                    {phase.includes('Current') && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        Active
                      </span>
                    )}
                    {phase.includes('Future') && (
                      <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        Coming Soon
                      </span>
                    )}
                  </h3>
                  <ul className="space-y-1">
                    {routes.map((route, index) => (
                      <li key={index} className="text-sm font-mono text-gray-600">
                        {route}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Rocket className="h-5 w-5 text-red-600" />
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-3">
              <a
                href="/api/health"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Check Health API
              </a>
              <a
                href="/auth/login"
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
              >
                Go to Login
              </a>
              <a
                href="/profile"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
              >
                Go to Profile
              </a>
              <a
                href="/"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
              >
                Go to Homepage
              </a>
            </div>
          </section>
        </div>

        {/* Beautiful Footer */}
        <div className="mt-8 text-center">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-center mb-3">
              <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-sm">💎</span>
              </div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 font-bold text-lg">
                Brënda Librave
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              This debug dashboard is only available in development mode
            </p>
            <div className="mt-3 flex items-center justify-center space-x-2 text-xs text-gray-500">
              <span>🕒</span>
              <span>Generated at {new Date().toLocaleString()}</span>
              <span>•</span>
              <span>Phase 2: Authentication System</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}