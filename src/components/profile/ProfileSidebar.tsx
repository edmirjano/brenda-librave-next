'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { motion } from 'framer-motion';
import {
  BookOpen,
  Heart,
  Lock,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  User,
} from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';

const navigationItems = [
  {
    name: 'Profili im',
    href: '/profile',
    icon: User,
  },
  {
    name: 'Porositë e mia',
    href: '/profile/orders',
    icon: ShoppingCart,
  },
  {
    name: 'Lista e dëshirave',
    href: '/wishlist',
    icon: Heart,
  },
  {
    name: 'Ndryshimi i fjalëkalimit',
    href: '/profile/change-password',
    icon: Lock,
  },
  {
    name: 'Cilësimet',
    href: '/profile/settings',
    icon: Settings,
  },
];

export function ProfileSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/profile') {
      return pathname === '/profile';
    }
    return pathname.startsWith(href);
  };

  return (
    <motion.div
      className="fixed left-0 top-0 h-full w-64 z-40"
      initial={{ x: -256 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <GlassCard className="h-full rounded-none rounded-r-2xl p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                Profili im
              </h1>
              <p className="text-sm text-gray-600">Brënda Librave</p>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white/50 rounded-xl p-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {session?.user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session?.user?.name || 'Përdorues'}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {session?.user?.email || ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-white/50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="space-y-3">
            <Link
              href="/"
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Package className="h-4 w-4" />
              <span className="text-sm">Kthehu në faqen kryesore</span>
            </Link>

            <button
              onClick={() => signOut()}
              className="w-full flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Dil nga llogaria</span>
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}