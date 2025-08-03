'use client';

import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import {
  Brain,
  BarChart3,
  Users,
  Zap,
  TrendingUp,
  Settings,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface AIMetrics {
  recommendations: {
    totalGenerated: number;
    clickThroughRate: number;
    conversionRate: number;
    userSatisfaction: number;
  };
  models: {
    contentModel: {
      accuracy: number;
      lastTrained: string;
      trainingDataSize: number;
    };
    collaborativeModel: {
      accuracy: number;
      lastTrained: string;
      trainingDataSize: number;
    };
  };
  performance: {
    avgResponseTime: number;
    successRate: number;
    errorRate: number;
  };
}

export function AIManagement() {
  const [metrics, setMetrics] = useState<AIMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetraining, setIsRetraining] = useState(false);

  useEffect(() => {
    const fetchAIMetrics = async () => {
      try {
        // Mock data for now - would fetch from actual AI metrics API
        const mockMetrics: AIMetrics = {
          recommendations: {
            totalGenerated: 15420,
            clickThroughRate: 18.5,
            conversionRate: 12.3,
            userSatisfaction: 4.2,
          },
          models: {
            contentModel: {
              accuracy: 87.5,
              lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              trainingDataSize: 2340,
            },
            collaborativeModel: {
              accuracy: 82.1,
              lastTrained: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              trainingDataSize: 1890,
            },
          },
          performance: {
            avgResponseTime: 185,
            successRate: 99.2,
            errorRate: 0.8,
          },
        };

        setMetrics(mockMetrics);
      } catch (error) {
        console.error('Error fetching AI metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const retrainModels = async () => {
    setIsRetraining(true);
    try {
      // Mock retraining process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Refresh metrics after retraining
      await fetchAIMetrics();
    } catch (error) {
      console.error('Error retraining models:', error);
    } finally {
      setIsRetraining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-700">Duke ngarkuar metrikat e AI...</span>
      </div>
    );
  }

  if (!metrics) {
    return (
      <GlassCard className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Gabim në ngarkim</h3>
        <p className="text-gray-600">Nuk mund të ngarkohen metrikat e AI</p>
      </GlassCard>
    );
  }

  const performanceCards = [
    {
      title: 'Rekomandime të Gjeneruara',
      value: metrics.recommendations.totalGenerated.toLocaleString(),
      subtitle: 'Këtë muaj',
      icon: Brain,
      color: 'purple',
    },
    {
      title: 'Click-Through Rate',
      value: `${metrics.recommendations.clickThroughRate}%`,
      subtitle: 'Nga rekomandimet',
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'Conversion Rate',
      value: `${metrics.recommendations.conversionRate}%`,
      subtitle: 'Nga klikime në blerje',
      icon: BarChart3,
      color: 'blue',
    },
    {
      title: 'Kënaqësia e Përdoruesve',
      value: `${metrics.recommendations.userSatisfaction}/5`,
      subtitle: 'Vlerësim mesatar',
      icon: Users,
      color: 'orange',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Management</h1>
          <p className="text-gray-600 mt-1">Menaxho sistemin e inteligjencës artificiale</p>
        </div>

        <LiquidButton
          variant="albanian"
          size="lg"
          onClick={retrainModels}
          loading={isRetraining}
          disabled={isRetraining}
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          {isRetraining ? 'Duke ritrainuar...' : 'Ritraino Modelet'}
        </LiquidButton>
      </div>

      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <GlassCard className="p-6 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r from-${card.color}-500 to-${card.color}-600 rounded-xl flex items-center justify-center`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                <p className="text-sm text-gray-500">{card.subtitle}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Model Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Brain className="h-6 w-6 mr-2 text-purple-600" />
            Statusi i Modeleve
          </h2>

          <div className="space-y-6">
            {/* Content Model */}
            <div className="p-4 bg-purple-50/50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Content-Based Model</h3>
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  metrics.models.contentModel.accuracy > 85 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {metrics.models.contentModel.accuracy}% saktësi
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Të dhëna trajnimi:</span>
                  <div className="font-medium">{metrics.models.contentModel.trainingDataSize.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Trainuar më:</span>
                  <div className="font-medium">
                    {new Date(metrics.models.contentModel.lastTrained).toLocaleDateString('sq-AL')}
                  </div>
                </div>
              </div>
            </div>

            {/* Collaborative Model */}
            <div className="p-4 bg-blue-50/50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Collaborative Filtering Model</h3>
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  metrics.models.collaborativeModel.accuracy > 80 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {metrics.models.collaborativeModel.accuracy}% saktësi
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Të dhëna trajnimi:</span>
                  <div className="font-medium">{metrics.models.collaborativeModel.trainingDataSize.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Trainuar më:</span>
                  <div className="font-medium">
                    {new Date(metrics.models.collaborativeModel.lastTrained).toLocaleDateString('sq-AL')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Zap className="h-6 w-6 mr-2 text-yellow-600" />
            Performanca e Sistemit
          </h2>

          <div className="space-y-6">
            {[
              {
                label: 'Koha Mesatare e Përgjigjes',
                value: `${metrics.performance.avgResponseTime}ms`,
                target: '200ms',
                progress: (200 / metrics.performance.avgResponseTime) * 100,
                color: metrics.performance.avgResponseTime <= 200 ? 'green' : 'yellow',
              },
              {
                label: 'Shkalla e Suksesit',
                value: `${metrics.performance.successRate}%`,
                target: '99%',
                progress: metrics.performance.successRate,
                color: metrics.performance.successRate >= 99 ? 'green' : 'yellow',
              },
              {
                label: 'Shkalla e Gabimeve',
                value: `${metrics.performance.errorRate}%`,
                target: '<1%',
                progress: 100 - metrics.performance.errorRate,
                color: metrics.performance.errorRate <= 1 ? 'green' : 'red',
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
                    className={`h-2 rounded-full transition-all duration-500 bg-${metric.color}-500`}
                    style={{ width: `${Math.min(metric.progress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Target: {metric.target}</span>
                  <span className={`text-${metric.color}-600`}>
                    {metric.progress >= 90 ? 'Excellent' : metric.progress >= 70 ? 'Good' : 'Needs Improvement'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* AI Configuration */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Settings className="h-6 w-6 mr-2 text-gray-600" />
          Konfigurimi i AI
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Retraining Frequency',
              description: 'Sa shpesh të ritrainohen modelet',
              value: 'Weekly',
              options: ['Daily', 'Weekly', 'Monthly'],
            },
            {
              title: 'Recommendation Limit',
              description: 'Numri maksimal i rekomandimeve',
              value: '10',
              options: ['5', '10', '15', '20'],
            },
            {
              title: 'Diversity Factor',
              description: 'Niveli i diversitetit në rekomandime',
              value: '0.3',
              options: ['0.1', '0.3', '0.5', '0.7'],
            },
          ].map((config, index) => (
            <motion.div
              key={config.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white/50 rounded-xl"
            >
              <h3 className="font-semibold text-gray-900 mb-2">{config.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{config.description}</p>
              <select
                value={config.value}
                onChange={(e) => {
                  // Handle configuration change
                  console.log(`${config.title} changed to:`, e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50"
              >
                {config.options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Recent AI Activity */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Aktiviteti i Fundit i AI</h2>
        
        <div className="space-y-4">
          {[
            {
              time: '2 minuta më parë',
              action: 'Generated 15 recommendations for user_123',
              type: 'recommendation',
              status: 'success',
            },
            {
              time: '5 minuta më parë',
              action: 'Content model prediction completed',
              type: 'prediction',
              status: 'success',
            },
            {
              time: '12 minuta më parë',
              action: 'Collaborative filtering updated',
              type: 'update',
              status: 'success',
            },
            {
              time: '1 orë më parë',
              action: 'Model retraining completed successfully',
              type: 'training',
              status: 'success',
            },
            {
              time: '2 orë më parë',
              action: 'User feedback processed (85 items)',
              type: 'feedback',
              status: 'success',
            },
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-3 bg-white/50 rounded-lg"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.status === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <div className={`w-3 h-3 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`} />
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>

              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                activity.type === 'recommendation' ? 'bg-purple-100 text-purple-800' :
                activity.type === 'prediction' ? 'bg-blue-100 text-blue-800' :
                activity.type === 'training' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {activity.type}
              </span>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}