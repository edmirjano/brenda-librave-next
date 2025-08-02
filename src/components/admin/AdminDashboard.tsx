'use client';

import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import {
  BarChart3,
  BookOpen,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PriceDisplay } from '@/components/ui/PriceDisplay';

interface DashboardStats {
  totalBooks: number;
  activeBooks: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockBooks: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        if (response.ok) {
          const data = await response.json();
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-700">Duke ngarkuar dashboard...</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-gray-600">Gabim në ngarkimin e të dhënave</p>
      </GlassCard>
    );
  }

  const statCards = [
    {
      title: 'Libra Totalë',
      value: stats.totalBooks,
      subtitle: `${stats.activeBooks} aktivë`,
      icon: BookOpen,
      color: 'blue',
      trend: '+12%',
    },
    {
      title: 'Përdorues',
      value: stats.totalUsers,
      subtitle: 'Të regjistruar',
      icon: Users,
      color: 'green',
      trend: '+8%',
    },
    {
      title: 'Porositë',
      value: stats.totalOrders,
      subtitle: `${stats.pendingOrders} në pritje`,
      icon: ShoppingCart,
      color: 'purple',
      trend: '+15%',
    },
    {
      title: 'Të Ardhurat',
      value: stats.totalRevenue,
      subtitle: 'Këtë muaj',
      icon: DollarSign,
      color: 'red',
      trend: '+23%',
      isPrice: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Mirësevini në panelin e administrimit të Brënda Librave</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <GlassCard className="p-6 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-xl flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">{stat.trend}</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.isPrice ? (
                    <PriceDisplay priceALL={stat.value} size="lg" />
                  ) : (
                    stat.value.toLocaleString()
                  )}
                </div>
                <p className="text-sm text-gray-500">{stat.subtitle}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Porositë e Fundit</h2>
              <Link
                href="/admin/orders"
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Shiko të gjitha
              </Link>
            </div>

            <div className="space-y-4">
              {stats.recentOrders.slice(0, 5).map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <Package className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">{order.customerName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <PriceDisplay priceALL={order.totalAmount} size="sm" />
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'PAID' 
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Veprime të Shpejta</h2>

            <div className="space-y-4">
              {[
                {
                  title: 'Shto Libër të Ri',
                  description: 'Shtoni një libër të ri në katalog',
                  href: '/admin/books/new',
                  icon: BookOpen,
                  color: 'blue',
                },
                {
                  title: 'Shiko Porositë',
                  description: 'Menaxho porositë e reja',
                  href: '/admin/orders',
                  icon: ShoppingCart,
                  color: 'green',
                },
                {
                  title: 'Menaxho Përdoruesit',
                  description: 'Shiko dhe menaxho përdoruesit',
                  href: '/admin/users',
                  icon: Users,
                  color: 'purple',
                },
                {
                  title: 'Statistikat',
                  description: 'Shiko raportet dhe analizat',
                  href: '/admin/analytics',
                  icon: BarChart3,
                  color: 'red',
                },
              ].map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <Link
                    href={action.href}
                    className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-all duration-200 group"
                  >
                    <div className={`w-10 h-10 bg-gradient-to-r from-${action.color}-500 to-${action.color}-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStockBooks > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <GlassCard className="p-6 bg-gradient-to-r from-yellow-50/80 to-orange-50/80 border-yellow-200/50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-yellow-900">Paralajmërim Stoku</h3>
                <p className="text-yellow-800">
                  {stats.lowStockBooks} libra kanë stok të ulët dhe duhen rifurnizuar
                </p>
              </div>
              <Link
                href="/admin/books?filter=low-stock"
                className="px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors"
              >
                Shiko librat
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}