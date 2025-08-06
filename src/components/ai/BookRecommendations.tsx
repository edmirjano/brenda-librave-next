'use client';

import { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';

import { motion } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';

import { BookCard } from '@/components/books/BookCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

import type { BookRecommendation } from '@/lib/ai/recommendation-engine';

interface BookRecommendationsProps {
  limit?: number;
  showExplanations?: boolean;
  showModelSelector?: boolean;
  className?: string;
}

export function BookRecommendations({ 
  limit = 8, 
  showExplanations = true,
  showModelSelector = true,
  className = '',
}: BookRecommendationsProps) {
  const t = useTranslations('ai.recommendations');
  const { data: session } = useSession();
  const [recommendations, setRecommendations] = useState<BookRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<'hybrid' | 'content' | 'collaborative' | 'trending'>('hybrid');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams({
          userId: session.user.id,
          model: selectedModel,
          limit: limit.toString(),
          explanations: showExplanations.toString(),
        });

        const response = await fetch(`/api/ai/recommendations?${params.toString()}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch recommendations');
        }

        setRecommendations(data.data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch recommendations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [session?.user?.id, selectedModel, limit, showExplanations]);

  const modelOptions = [
    {
      value: 'hybrid' as const,
      label: t('models.hybrid.label'),
      icon: Brain,
      description: t('models.hybrid.description'),
      color: 'purple',
    },
    {
      value: 'content' as const,
      label: t('models.content.label'),
      icon: Sparkles,
      description: t('models.content.description'),
      color: 'blue',
    },
    {
      value: 'collaborative' as const,
      label: t('models.collaborative.label'),
      icon: Users,
      description: t('models.collaborative.description'),
      color: 'green',
    },
    {
      value: 'trending' as const,
      label: t('models.trending.label'),
      icon: TrendingUp,
      description: t('models.trending.description'),
      color: 'orange',
    },
  ];

  // Show login prompt if not authenticated
  if (!session?.user?.id) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={className}
      >
        <GlassCard className="p-8 text-center">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('loginPrompt.title')}</h3>
          <p className="text-gray-600 mb-6">
            {t('loginPrompt.description')}
          </p>
          <a
            href="/auth/login"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200"
          >
            {t('loginPrompt.cta')}
          </a>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Model Selection */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Brain className="h-6 w-6 mr-2 text-red-600" />
            {t('title')}
          </h2>
          
          {showModelSelector && (
            <div className="flex space-x-2">
              {modelOptions.map((model) => {
                const Icon = model.icon;
                return (
                  <button
                    key={model.value}
                    onClick={() => setSelectedModel(model.value)}
                    className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedModel === model.value
                        ? `bg-${model.color}-500 text-white`
                        : 'bg-white/50 text-gray-700 hover:bg-white/70'
                    }`}
                    title={model.description}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {model.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {showExplanations && (
          <div className="bg-blue-50/50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">{t('howItWorks')}</span>
            </div>
            <p className="text-sm text-blue-700">
              {modelOptions.find(m => m.value === selectedModel)?.description}
            </p>
          </div>
        )}
      </GlassCard>

      {/* Recommendations Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <GlassCard key={i} className="p-4">
              <div className="animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="p-8 text-center">
            <Brain className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gabim në AI</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
            >
              Provo përsëri
            </button>
          </GlassCard>
        </motion.div>
      ) : recommendations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="p-8 text-center">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nuk ka rekomandime</h3>
            <p className="text-gray-600 mb-6">
              AI-ja jonë po mëson preferencat tuaja. Blini disa libra për rekomandime më të mira!
            </p>
            <a
              href="/books"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200"
            >
              Eksploroni librat
            </a>
          </GlassCard>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="relative"
            >
              <BookCard book={rec.book} index={index} />
              
              {/* AI Score Badge */}
              <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                <Brain className="h-3 w-3" />
                <span>{Math.round(rec.score * 100)}%</span>
              </div>

              {/* Confidence Indicator */}
              <div className="absolute top-2 left-2">
                <div className={`w-2 h-2 rounded-full ${
                  rec.confidence > 0.8 ? 'bg-green-500' :
                  rec.confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                }`} title={`Confidence: ${Math.round(rec.confidence * 100)}%`} />
              </div>

              {/* Explanation */}
              {showExplanations && rec.reasons.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                  className="mt-2 p-3 bg-purple-50/50 rounded-xl"
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <Sparkles className="h-3 w-3 text-purple-600" />
                    <span className="text-xs font-medium text-purple-800">Pse rekomandohet:</span>
                  </div>
                  <p className="text-xs text-purple-700">
                    {rec.reasons[0]}
                  </p>
                  {rec.reasons.length > 1 && (
                    <p className="text-xs text-purple-600 mt-1">
                      +{rec.reasons.length - 1} arsye të tjera
                    </p>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* AI Learning Notice */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <GlassCard className="p-4 bg-gradient-to-r from-purple-50/50 to-blue-50/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">AI-ja jonë po mëson</p>
                <p className="text-xs text-gray-600">
                  Sa më shumë të blini dhe lexoni, aq më të sakta bëhen rekomandimet
                </p>
              </div>
              <div className="flex items-center space-x-1 text-xs text-purple-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Aktive</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}