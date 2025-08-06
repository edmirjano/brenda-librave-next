'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckIcon, 
  StarIcon, 
  BookOpenIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  InfinityIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { PriceDisplay } from '@/components/ui/PriceDisplay';

interface SubscriptionPlan {
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
  featured: boolean;
}

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  onSubscribe: (planId: string) => void;
  isLoading?: boolean;
}

export function SubscriptionPlans({ 
  plans, 
  onSubscribe, 
  isLoading = false 
}: SubscriptionPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    onSubscribe(planId);
  };

  const getDurationText = (days: number) => {
    if (days === 30) return '30 ditë';
    if (days === 90) return '3 muaj';
    if (days === 365) return '1 vit';
    return `${days} ditë`;
  };

  const getFeatures = (plan: SubscriptionPlan) => {
    const features = [];

    if (plan.unlimitedReads) {
      features.push('Lexime të pakufizuara');
    }

    if (plan.includesEbooks) {
      features.push('Akses në librat digitale');
    }

    if (plan.includesHardcopy) {
      features.push('Akses në librat fizike');
    }

    features.push(`${plan.maxConcurrent} libra njëkohësisht`);
    features.push(`${plan.bookCount} libra në koleksion`);

    if (plan.prioritySupport) {
      features.push('Mbështetje prioritare');
    }

    return features;
  };

  if (plans.length === 0) {
    return (
      <GlassCard className="p-8">
        <div className="text-center">
          <BookOpenIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nuk ka plane të disponueshme
          </h3>
          <p className="text-gray-600">
            Kontrolloni më vonë për plane të reja të abonimit.
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Planet e Abonimit
        </h2>
        <p className="text-gray-600">
          Zgjidhni planin që përshtatet më mirë me nevojat tuaja
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard 
              className={`p-6 relative ${
                plan.featured 
                  ? 'ring-2 ring-yellow-400 bg-yellow-50/50' 
                  : 'hover:shadow-lg hover:scale-105'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <StarIcon className="w-3 h-3" />
                    <span>Më Popullor</span>
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`inline-flex p-3 rounded-full mb-4 ${
                  plan.featured 
                    ? 'bg-yellow-100 text-yellow-600' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  <BookOpenIcon className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                
                {plan.description && (
                  <p className="text-sm text-gray-600 mb-4">
                    {plan.description}
                  </p>
                )}

                <div className="mb-4">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <PriceDisplay 
                      price={plan.price} 
                      currency={plan.currency}
                      className="text-2xl font-bold text-gray-900"
                    />
                    <span className="text-sm text-gray-500">/ muaj</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {getDurationText(plan.duration)}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {getFeatures(plan).map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-2">
                    <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                variant={plan.featured ? 'primary' : 'outline'}
                size="sm"
                className="w-full"
                onClick={() => handleSubscribe(plan.id)}
                disabled={isLoading}
              >
                {isLoading && selectedPlan === plan.id ? 'Duke u abonuar...' : 'Abonohu'}
              </Button>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Subscription Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <GlassCard className="p-6 bg-blue-50/50 border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Përfitimet e Abonimit
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <InfinityIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-gray-900">Lexime të Pakufizuara</h5>
                    <p className="text-sm text-gray-600">
                      Lexoni sa herë që dëshironi librat në koleksionin tuaj
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <ShieldCheckIcon className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-gray-900">Siguri Maksimale</h5>
                    <p className="text-sm text-gray-600">
                      Lexoni në mënyrë të sigurt me mbrojtje të avancuar
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <DevicePhoneMobileIcon className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-gray-900">Akses i Menjëhershëm</h5>
                    <p className="text-sm text-gray-600">
                      Fillini të lexoni menjëherë pas abonimit
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Si Funksionon
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                    1
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Zgjidhni Planin</h5>
                    <p className="text-sm text-gray-600">
                      Zgjidhni planin që përshtatet më mirë me nevojat tuaja
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Abonohuni</h5>
                    <p className="text-sm text-gray-600">
                      Plotësoni pagesën dhe aktivizoni abonimin tuaj
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Filloni të Lexoni</h5>
                    <p className="text-sm text-gray-600">
                      Aksesoni koleksionin dhe filloni të lexoni menjëherë
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
} 