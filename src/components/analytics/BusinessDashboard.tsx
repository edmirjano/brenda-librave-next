'use client';

import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import {
  BarChart3,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Users,
  BookOpen,
  ShoppingCart,
  Target,
  AlertTriangle,
  Zap,
} from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PriceDisplay } from '@/components/ui/PriceDisplay';

import type { BusinessMetrics } from '@/lib/analytics/business-intelligence';

export function BusinessDashboard() {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/analytics/business-metrics?range=${timeRange}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch metrics');
        }

        setMetrics(data.data);
      } catch (error) {
        console.error('Error fetching business metrics:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch metrics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [timeRange]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-700">Duke ngarkuar analizat e biznesit...</span>
      </div>
    );
  }

  if (error) {
    return (
      <GlassCard className="p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Gabim në ngarkim</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
        >
          Provo përsëri
        </button>
      </GlassCard>
    );
  }

  if (!metrics) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-gray-600">Nuk ka të dhëna të disponueshme</p>
      </GlassCard>
    );
  }

  const kpiCards = [
    {
      title: 'Të Ardhurat Totale',
      value: metrics.revenue.total,
      growth: metrics.revenue.growth,
      icon: DollarSign,
      color: 'green',
      isPrice: true,
    },
    {
      title: 'Klientë Aktivë',
      value: metrics.customers.total,
      growth: ((metrics.customers.new / metrics.customers.total) * 100),
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Shkalla e Konvertimit',
      value: metrics.performance.conversion_rate,
      growth: 5.2,
      icon: Target,
      color: 'purple',
      isPercentage: true,
    },
    {
      title: 'Vlera Mesatare e Porosisë',
      value: metrics.performance.avg_order_value,
      growth: 8.1,
      icon: ShoppingCart,
      color: 'orange',
      isPrice: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Intelligence</h1>
          <p className="text-gray-600 mt-1">Analizë e thellë e performancës së biznesit</p>
        </div>

        <div className="flex space-x-2">
          {[
            { value: '7d', label: '7 ditë' },
            { value: '30d', label: '30 ditë' },
            { value: '90d', label: '3 muaj' },
            { value: '1y', label: '1 vit' },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                timeRange === range.value
                  ? 'bg-red-500 text-white'
                  : 'bg-white/50 text-gray-700 hover:bg-white/70'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <GlassCard className="p-6 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r from-${kpi.color}-500 to-${kpi.color}-600 rounded-xl flex items-center justify-center`}>
                  <kpi.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 ${kpi.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.growth >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {kpi.growth >= 0 ? '+' : ''}{kpi.growth.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
                <div className="text-2xl font-bold text-gray-900">
                  {kpi.isPrice ? (
                    <PriceDisplay priceALL={kpi.value} size="lg" />
                  ) : kpi.isPercentage ? (
                    `${kpi.value.toFixed(1)}%`
                  ) : (
                    kpi.value.toLocaleString()
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Të Ardhurat sipas Kategorive</h2>
          <div className="space-y-4">
            {metrics.revenue.byCategory.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.bookCount} libra</p>
                  </div>
                </div>
                <div className="text-right">
                  <PriceDisplay priceALL={category.revenue} size="sm" />
                  <div className="text-xs text-gray-500">
                    {((category.revenue / metrics.revenue.total) * 100).toFixed(1)}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Performanca e Faqes</h2>
          <div className="space-y-6">
            {[
              {
                label: 'Shkalla e Konvertimit',
                value: `${metrics.performance.conversion_rate.toFixed(2)}%`,
                target: '3.5%',
                progress: (metrics.performance.conversion_rate / 3.5) * 100,
              },
              {
                label: 'Braktisja e Shportës',
                value: `${metrics.performance.cart_abandonment.toFixed(1)}%`,
                target: '65%',
                progress: 100 - (metrics.performance.cart_abandonment / 65) * 100,
              },
              {
                label: 'Shpejtësia e Ngarkimit',
                value: `${metrics.performance.page_load_speed.toFixed(1)}s`,
                target: '2.0s',
                progress: (2.0 / metrics.performance.page_load_speed) * 100,
              },
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                  <span className="text-sm text-gray-900">{metric.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      metric.progress >= 80 ? 'bg-green-500' : 
                      metric.progress >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(metric.progress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Target: {metric.target}</span>
                  <span>{metric.progress.toFixed(0)}% of target</span>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Inventory Intelligence */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Inteligjenca e Inventarit</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bestsellers */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Bestsellers
            </h3>
            <div className="space-y-3">
              {metrics.inventory.bestsellers.slice(0, 5).map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-green-50/50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{book.title}</h4>
                    <p className="text-sm text-gray-600 truncate">{book.author}</p>
                  </div>
                  <div className="text-right">
                    <PriceDisplay priceALL={book.priceALL || 0} size="sm" />
                    <div className="text-xs text-green-600">
                      {book.salesCount} shitur
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Slow Movers */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
              Libra me Shitje të Ulëta
            </h3>
            <div className="space-y-3">
              {metrics.inventory.slow_movers.slice(0, 5).map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-yellow-50/50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{book.title}</h4>
                    <p className="text-sm text-gray-600 truncate">{book.author}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-yellow-600">
                      Stok: {book.inventory}
                    </div>
                    <div className="text-xs text-gray-500">
                      {book.daysSinceLastSale} ditë pa shitje
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Klientë të Rinj</h3>
              <p className="text-sm text-gray-600">Këtë periudhë</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {metrics.customers.new.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            Rritje nga periudha e kaluar
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Retention Rate</h3>
              <p className="text-sm text-gray-600">Klientë që kthehen</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {metrics.customers.retention.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">
            Mesatarja e industrisë: 65%
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Customer LTV</h3>
              <p className="text-sm text-gray-600">Vlera e jetës</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-600 mb-2">
            <PriceDisplay priceALL={metrics.customers.lifetime_value} size="lg" />
          </div>
          <div className="text-sm text-gray-600">
            Mesatare për klient
          </div>
        </GlassCard>
      </div>

      {/* Forecast Section */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2 text-red-600" />
            Parashikimi i Shitjeve
          </h2>
          <div className="text-sm text-gray-600">
            Bazuar në të dhënat historike
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50/50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              <PriceDisplay priceALL={metrics.revenue.forecast} size="lg" />
            </div>
            <div className="text-sm text-gray-600">Parashikim për muajin e ardhshëm</div>
          </div>

          <div className="text-center p-4 bg-green-50/50 rounded-xl">
            <div className="text-2xl font-bold text-green-600 mb-2">
              +{((metrics.revenue.forecast / metrics.revenue.total - 1) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Rritje e parashikuar</div>
          </div>

          <div className="text-center p-4 bg-purple-50/50 rounded-xl">
            <div className="text-2xl font-bold text-purple-600 mb-2">85%</div>
            <div className="text-sm text-gray-600">Saktësia e modelit</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}