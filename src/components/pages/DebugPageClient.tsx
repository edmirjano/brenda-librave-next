'use client';

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

import { GlassCard } from '@/components/ui/GlassCard';

interface DebugPageClientProps {
  translations: any;
  debugData: any;
}

export function DebugPageClient({ translations, debugData }: DebugPageClientProps) {
  const { envVars, dbStatus, demoUsers, session } = debugData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900">
            {translations('title')}
          </h1>
          <p className="text-lg text-gray-600">
            {translations('description')}
          </p>
        </div>

        {/* Environment Variables */}
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Settings className="h-6 w-6 mr-2 text-blue-600" />
            {translations('environment.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-gray-600">{key}</span>
                  <span className="text-sm font-medium text-gray-900">{value as string}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Database Status */}
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Key className="h-6 w-6 mr-2 text-green-600" />
            {translations('database.title')}
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {dbStatus.status === 'Connected' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="text-lg font-medium">
                {translations('database.status')}: {dbStatus.status}
              </span>
            </div>
            <div className="text-gray-600">
              {translations('database.userCount')}: {dbStatus.userCount}
            </div>
            {dbStatus.error && (
              <div className="text-red-600 bg-red-50 p-4 rounded-lg">
                {translations('database.error')}: {dbStatus.error}
              </div>
            )}
          </div>
        </GlassCard>

        {/* Session Info */}
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <User className="h-6 w-6 mr-2 text-purple-600" />
            {translations('session.title')}
          </h2>
          {session ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">{translations('session.email')}</span>
                  <p className="text-gray-900">{session.user.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">{translations('session.role')}</span>
                  <p className="text-gray-900">{session.user.role}</p>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">{translations('session.id')}</span>
                <p className="font-mono text-sm text-gray-900">{session.user.id}</p>
              </div>
            </div>
          ) : (
            <div className="text-gray-600">
              {translations('session.notAuthenticated')}
            </div>
          )}
        </GlassCard>

        {/* Demo Users */}
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-yellow-600" />
            {translations('demoUsers.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoUsers.map((user: any) => (
              <div key={user.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-900">{user.email}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {translations('demoUsers.role')}: {user.role}
                </div>
                <div className="text-sm text-gray-600">
                  {translations('demoUsers.id')}: {user.id}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Footer */}
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
              {translations('footer.description')}
            </p>
            <div className="mt-3 flex items-center justify-center space-x-2 text-xs text-gray-500">
              <span>🕒</span>
              <span>{translations('footer.generatedAt')} {new Date().toLocaleString()}</span>
              <span>•</span>
              <span>{translations('footer.phase')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 