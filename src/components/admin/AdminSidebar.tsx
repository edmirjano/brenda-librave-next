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
  FileText,
  Grid3X3,
  Home,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  Users,
  DollarSign,
  Headphones,
  Truck,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Play,
  Pause,
  Stop,
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
    name: 'Blog',
    icon: FileText,
    children: [
      { name: 'Të gjitha postimet', href: '/admin/blog' },
      { name: 'Shto postim të ri', href: '/admin/blog/new' },
      { name: 'Moderimi', href: '/admin/blog/moderation' },
      { name: 'Kategoritë e blogut', href: '/admin/blog/categories' },
    ],
  },
  {
    name: 'Porositë',
    icon: ShoppingCart,
    children: [
      { name: 'Të gjitha porositë', href: '/admin/orders' },
      { name: 'Porositë e reja', href: '/admin/orders/pending' },
      { name: 'Porositë në proces', href: '/admin/orders/processing' },
      { name: 'Porositë e dërguara', href: '/admin/orders/shipped' },
      { name: 'Porositë e përfunduara', href: '/admin/orders/delivered' },
      { name: 'Porositë e anuluara', href: '/admin/orders/cancelled' },
    ],
  },
  {
    name: 'Abonimet',
    icon: Calendar,
    children: [
      { name: 'Të gjitha abonimet', href: '/admin/subscriptions' },
      { name: 'Planet e abonimit', href: '/admin/subscriptions/plans' },
      { name: 'Përdoruesit e abonuar', href: '/admin/subscriptions/users' },
      { name: 'Statistikat e abonimit', href: '/admin/subscriptions/analytics' },
    ],
  },
  {
    name: 'Librat Audio',
    icon: Headphones,
    children: [
      { name: 'Të gjitha librat audio', href: '/admin/audio-books' },
      { name: 'Shto libër audio', href: '/admin/audio-books/new' },
      { name: 'Rentimet audio', href: '/admin/audio-books/rentals' },
      { name: 'Statistikat audio', href: '/admin/audio-books/analytics' },
    ],
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
    name: 'Monedhët',
    href: '/admin/currency',
    icon: DollarSign,
  },
  {
    name: 'Cilësimet',
    href: '/admin/settings',
    icon: Settings,
  },
];

// Transporter-specific navigation items
const transporterNavigationItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: Home,
  },
  {
    name: 'Porositë e Mia',
    icon: ShoppingCart,
    children: [
      { name: 'Porositë e sotme', href: '/admin/orders/today' },
      { name: 'Porositë e javës', href: '/admin/orders/week' },
      { name: 'Porositë në proces', href: '/admin/orders/processing' },
      { name: 'Porositë e dërguara', href: '/admin/orders/shipped' },
      { name: 'Historia e porosive', href: '/admin/orders/history' },
    ],
  },
  {
    name: 'Statusi i Porosive',
    icon: CheckCircle,
    children: [
      { name: 'Marr në dorë', href: '/admin/orders/pickup' },
      { name: 'Në dërgim', href: '/admin/orders/in-transit' },
      { name: 'E dërguar', href: '/admin/orders/delivered' },
      { name: 'E anuluar', href: '/admin/orders/cancelled' },
    ],
  },
  {
    name: 'Kalendari',
    href: '/admin/calendar',
    icon: Calendar,
  },
  {
    name: 'Raportet',
    href: '/admin/reports',
    icon: BarChart3,
  },
];

export function AdminSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Libra']);

  // Determine which navigation items to show based on user role
  const isTransporter = session?.user?.role === 'TRANSPORTER';
  const navigationItemsToShow = isTransporter ? transporterNavigationItems : navigationItems;

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

  const getUserRoleDisplay = () => {
    switch (session?.user?.role) {
      case 'TRANSPORTER':
        return 'Transportues';
      case 'ADMIN':
        return 'Administrator';
      default:
        return 'Përdorues';
    }
  };

  const getRoleIcon = () => {
    switch (session?.user?.role) {
      case 'TRANSPORTER':
        return Truck;
      case 'ADMIN':
        return Settings;
      default:
        return Users;
    }
  };

  const RoleIcon = getRoleIcon();

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
                {isTransporter ? 'Transport Panel' : 'Admin Panel'}
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
                <div className="flex items-center space-x-1">
                  <RoleIcon className="w-3 h-3 text-gray-500" />
                  <p className="text-xs text-gray-600">{getUserRoleDisplay()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItemsToShow.map((item) => (
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