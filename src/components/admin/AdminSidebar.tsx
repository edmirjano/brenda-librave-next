'use client';

import { useState } from 'react';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { motion } from 'framer-motion';
import {
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Grid3X3,
  Home,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  Users,
} from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: Home,
  },
  {
    name: 'Libra',
    icon: BookOpen,
    children: [
      { name: 'Të gjithë librat', href: '/admin/books' },
      { name: 'Shto libër të ri', href: '/admin/books/new' },
      { name: 'Kategoritë', href: '/admin/categories' },
      { name: 'Etiketat', href: '/admin/tags' },
    ],
  },
  {
    name: 'Porositë',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    name: 'Përdoruesit',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Kuponat',
    href: '/admin/coupons',
    icon: CreditCard,
  },
  {
    name: 'Statistikat',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    name: 'Cilësimet',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Libra']);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const isChildActive = (children: any[]) => {
    return children.some(child => pathname.startsWith(child.href));
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
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
                Admin Panel
              </h1>
              <p className="text-sm text-gray-600">Brënda Librave</p>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white/50 rounded-xl p-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {session?.user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session?.user?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-600">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-200 ${
                      isChildActive(item.children)
                        ? 'bg-red-100/80 text-red-700'
                        : 'text-gray-700 hover:bg-white/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {expandedItems.includes(item.name) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>

                  {expandedItems.includes(item.name) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-6 mt-2 space-y-1"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            isActive(child.href)
                              ? 'bg-red-500 text-white'
                              : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-red-500 text-white'
                      : 'text-gray-700 hover:bg-white/50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )}
            </div>
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
              <span className="text-sm">Shiko faqen</span>
            </Link>

            <button
              onClick={() => signOut()}
              className="w-full flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Dil nga paneli</span>
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}