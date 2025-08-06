'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ClockIcon, 
  TruckIcon, 
  ShieldCheckIcon, 
  CurrencyEuroIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { PriceDisplay } from '@/components/ui/PriceDisplay';

interface HardcopyRentalOption {
  id: string;
  type: 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM' | 'EXTENDED_TERM';
  title: string;
  description: string;
  duration: string;
  rentalPrice: number;
  guaranteeAmount: number;
  currency: 'ALL' | 'EUR';
  icon: React.ComponentType<any>;
  features: string[];
  popular?: boolean;
}

interface HardcopyRentalOptionsProps {
  bookId: string;
  bookPrice: number;
  currency: 'ALL' | 'EUR';
  onRentalSelect: (rentalType: string, rentalPrice: number, guaranteeAmount: number) => void;
}

export function HardcopyRentalOptions({ 
  bookId, 
  bookPrice, 
  currency, 
  onRentalSelect 
}: HardcopyRentalOptionsProps) {
  const [selectedRental, setSelectedRental] = useState<string | null>(null);

  const rentalOptions: HardcopyRentalOption[] = [
    {
      id: 'short-term',
      type: 'SHORT_TERM',
      title: 'Rentim i Shkurtër',
      description: 'Përshtatet për lexim të shpejtë',
      duration: '7 ditë',
      rentalPrice: Math.round(bookPrice * 0.15), // 15% of book price
      guaranteeAmount: Math.round(bookPrice * 0.8), // 80% guarantee
      currency,
      icon: ClockIcon,
      features: [
        '7 ditë akses',
        'Garantia e plotë',
        'Dërgesa e shpejtë',
        'Kthimi i lehtë'
      ]
    },
    {
      id: 'medium-term',
      type: 'MEDIUM_TERM',
      title: 'Rentim i Mesëm',
      description: 'Kohë e mjaftueshme për të lexuar',
      duration: '14 ditë',
      rentalPrice: Math.round(bookPrice * 0.25), // 25% of book price
      guaranteeAmount: Math.round(bookPrice * 0.8), // 80% guarantee
      currency,
      icon: ClockIcon,
      features: [
        '14 ditë akses',
        'Garantia e plotë',
        'Dërgesa standarde',
        'Kthimi i lehtë',
        'Çmim optimal'
      ],
      popular: true
    },
    {
      id: 'long-term',
      type: 'LONG_TERM',
      title: 'Rentim i Gjatë',
      description: 'Për lexues të kujdesshëm',
      duration: '30 ditë',
      rentalPrice: Math.round(bookPrice * 0.4), // 40% of book price
      guaranteeAmount: Math.round(bookPrice * 0.8), // 80% guarantee
      currency,
      icon: ClockIcon,
      features: [
        '30 ditë akses',
        'Garantia e plotë',
        'Dërgesa standarde',
        'Kthimi i lehtë',
        'Vlerë e mirë'
      ]
    },
    {
      id: 'extended-term',
      type: 'EXTENDED_TERM',
      title: 'Rentim i Zgjeruar',
      description: 'Për lexues të kujdesshëm',
      duration: '60 ditë',
      rentalPrice: Math.round(bookPrice * 0.6), // 60% of book price
      guaranteeAmount: Math.round(bookPrice * 0.8), // 80% guarantee
      currency,
      icon: ClockIcon,
      features: [
        '60 ditë akses',
        'Garantia e plotë',
        'Dërgesa standarde',
        'Kthimi i lehtë',
        'Për lexues të kujdesshëm'
      ]
    }
  ];

  const handleRentalSelect = (option: HardcopyRentalOption) => {
    setSelectedRental(option.id);
    onRentalSelect(option.type, option.rentalPrice, option.guaranteeAmount);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Zgjidhni Opsionin e Rentimit
        </h3>
        <p className="text-gray-600">
          Sistemi i garantisë siguron që librin ta ktheni në gjendje të mirë
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rentalOptions.map((option, index) => {
          const Icon = option.icon;
          const isSelected = selectedRental === option.id;
          
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard 
                className={`p-6 cursor-pointer transition-all duration-300 relative ${
                  isSelected 
                    ? 'ring-2 ring-blue-500 bg-blue-50/50' 
                    : 'hover:shadow-lg hover:scale-105'
                } ${option.popular ? 'border-2 border-yellow-400' : ''}`}
                onClick={() => handleRentalSelect(option)}
              >
                {option.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-medium">
                      Më Popullor
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <div className={`inline-flex p-3 rounded-full mb-4 ${
                    isSelected 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {option.title}
                  </h4>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    {option.description}
                  </p>

                  <div className="mb-4">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <CurrencyEuroIcon className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">Rentimi:</span>
                      <PriceDisplay 
                        price={option.rentalPrice} 
                        currency={option.currency}
                        className="text-lg font-bold text-gray-900"
                      />
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">Garantia:</span>
                      <PriceDisplay 
                        price={option.guaranteeAmount} 
                        currency={option.currency}
                        className="text-sm font-medium text-blue-600"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{option.duration}</p>
                  </div>

                  <div className="space-y-2 mb-6">
                    {option.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant={isSelected ? 'primary' : 'outline'}
                    size="sm"
                    className="w-full"
                  >
                    {isSelected ? 'Zgjedhur' : 'Zgjidh'}
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {selectedRental && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <GlassCard className="p-6 bg-blue-50/50 border-blue-200">
            <div className="flex items-center space-x-3 mb-4">
              <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-900">
                Sistemi i Garantisë
              </h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h5 className="font-medium text-gray-900">Si funksionon:</h5>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">1. Paguani rentimin</span>
                      <p className="text-gray-600">Paguani çmimin e rentimit (15-60% e çmimit të librit)</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">2. Depozitoni garantinë</span>
                      <p className="text-gray-600">Depozitoni 80% të çmimit të librit si garanti</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">3. Lexoni librin</span>
                      <p className="text-gray-600">Merrni librin dhe lexojeni në kohën e caktuar</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">4. Ktheni librin</span>
                      <p className="text-gray-600">Ktheni librin në gjendje të mirë dhe merrni garantinë</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-medium text-gray-900">Kushtet e kthimit:</h5>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span>Ekselente - 100% garanti</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span>Shumë mirë - 95% garanti</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span>Mirë - 90% garanti</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
                    <span>E pranueshme - 75% garanti</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />
                    <span>E dobët - 50% garanti</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                    <span>E dëmtuar - 10% garanti</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      Vonesa në kthim: 10% e çmimit të rentimit për ditë
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
} 