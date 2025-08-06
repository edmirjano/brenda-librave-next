'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  BookOpen, 
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';

interface SubscriptionInfo {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: 'ALL' | 'EUR';
  duration: number;
  maxConcurrent: number;
  includesEbooks: boolean;
  includesHardcopy: boolean;
  unlimitedReads: boolean;
  prioritySupport: boolean;
  bookCount: number;
  isActive: boolean;
  featured: boolean;
}

interface SubscriptionStats {
  subscriptions: {
    total: number;
    active: number;
  };
  users: {
    total: number;
    active: number;
  };
  books: number;
  totalReads: number;
}

interface SubscriptionManagementProps {
  subscriptions: SubscriptionInfo[];
  stats: SubscriptionStats;
}

export function SubscriptionManagement({ 
  subscriptions, 
  stats 
}: SubscriptionManagementProps) {
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('sq-AL', {
      style: 'currency',
      currency: currency === 'ALL' ? 'ALL' : 'EUR'
    }).format(amount);
  };

  const getDurationText = (days: number) => {
    if (days === 30) return '30 ditë';
    if (days === 90) return '3 muaj';
    if (days === 365) return '1 vit';
    return `${days} ditë`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Planet Aktive</p>
                <p className="text-2xl font-bold text-gray-900">{stats.subscriptions.active}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Përdorues Aktive</p>
                <p className="text-2xl font-bold text-gray-900">{stats.users.active}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Librat në Koleksion</p>
                <p className="text-2xl font-bold text-gray-900">{stats.books}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Lexime Totale</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReads}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Subscription Plans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Planet e Abonimit</h2>
              <p className="text-gray-600">Menaxhoni planet e disponueshëm</p>
            </div>
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Shto Plan të Ri
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((subscription, index) => (
              <motion.div
                key={subscription.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <GlassCard className={`p-6 relative ${
                  subscription.featured ? 'ring-2 ring-yellow-400 bg-yellow-50/50' : ''
                }`}>
                  {subscription.featured && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                      Më Popullor
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {subscription.name}
                    </h3>
                    {subscription.description && (
                      <p className="text-sm text-gray-600 mb-3">
                        {subscription.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Çmimi:</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(subscription.price, subscription.currency)}/muaj
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Kohëzgjatja:</span>
                      <span className="font-medium text-gray-900">
                        {getDurationText(subscription.duration)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Librat njëkohësisht:</span>
                      <span className="font-medium text-gray-900">
                        {subscription.maxConcurrent}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Librat në koleksion:</span>
                      <span className="font-medium text-gray-900">
                        {subscription.bookCount}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        subscription.includesEbooks ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <span className="text-sm text-gray-700">Librat digitale</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        subscription.includesHardcopy ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <span className="text-sm text-gray-700">Librat fizike</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        subscription.unlimitedReads ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <span className="text-sm text-gray-700">Lexime të pakufizuara</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        subscription.prioritySupport ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <span className="text-sm text-gray-700">Mbështetje prioritare</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edito
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      Shiko
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Fshi
                    </Button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Statusi:</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        subscription.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscription.isActive ? 'Aktiv' : 'Jo aktiv'}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Veprime të Shpejta</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <Users className="w-4 h-4 mr-2" />
              Menaxho Përdoruesit
            </Button>
            <Button variant="outline" className="justify-start">
              <BookOpen className="w-4 h-4 mr-2" />
              Shto Libra në Koleksion
            </Button>
            <Button variant="outline" className="justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              Shiko Statistikat
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
} 