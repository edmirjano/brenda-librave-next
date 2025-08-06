'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClockIcon, EyeIcon, InfinityIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { PriceDisplay } from '@/components/ui/PriceDisplay';

interface RentalOption {
  id: string;
  type: 'SINGLE_READ' | 'TIME_LIMITED' | 'UNLIMITED_READS';
  title: string;
  description: string;
  duration: string;
  price: number;
  currency: 'ALL' | 'EUR';
  icon: React.ComponentType<any>;
  features: string[];
}

interface RentalOptionsProps {
  bookId: string;
  digitalPrice: number;
  currency: 'ALL' | 'EUR';
  onRentalSelect: (rentalType: string, price: number) => void;
}

export function RentalOptions({ bookId, digitalPrice, currency, onRentalSelect }: RentalOptionsProps) {
  const [selectedRental, setSelectedRental] = useState<string | null>(null);

  const rentalOptions: RentalOption[] = [
    {
      id: 'single-read',
      type: 'SINGLE_READ',
      title: 'Lexim i Vetëm',
      description: 'Hap librin një herë dhe lexo për 24 orë',
      duration: '24 orë',
      price: Math.round(digitalPrice * 0.3), // 30% of full price
      currency,
      icon: EyeIcon,
      features: [
        'Hap librin një herë',
        'Lexim për 24 orë',
        'Siguri maksimale',
        'Çmim më i ulët'
      ]
    },
    {
      id: 'time-limited',
      type: 'TIME_LIMITED',
      title: 'Lexim i Kufizuar',
      description: 'Akses për 7 ditë me siguri të lartë',
      duration: '7 ditë',
      price: Math.round(digitalPrice * 0.6), // 60% of full price
      currency,
      icon: ClockIcon,
      features: [
        'Akses për 7 ditë',
        'Lexim i pakufizuar',
        'Siguri e lartë',
        'Çmim i përshtatshëm'
      ]
    },
    {
      id: 'unlimited-reads',
      type: 'UNLIMITED_READS',
      title: 'Lexim i Pakufizuar',
      description: 'Akses për 30 ditë me të gjitha privilegjet',
      duration: '30 ditë',
      price: digitalPrice, // Full price
      currency,
      icon: InfinityIcon,
      features: [
        'Akses për 30 ditë',
        'Lexim i pakufizuar',
        'Siguri maksimale',
        'Të gjitha privilegjet'
      ]
    }
  ];

  const handleRentalSelect = (option: RentalOption) => {
    setSelectedRental(option.id);
    onRentalSelect(option.type, option.price);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Zgjidhni Opsionin e Leximit
        </h3>
        <p className="text-gray-600">
          Secili opsion ofron nivele të ndryshme sigurie dhe fleksibiliteti
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                className={`p-6 cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? 'ring-2 ring-blue-500 bg-blue-50/50' 
                    : 'hover:shadow-lg hover:scale-105'
                }`}
                onClick={() => handleRentalSelect(option)}
              >
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
                    <PriceDisplay 
                      price={option.price} 
                      currency={option.currency}
                      className="text-2xl font-bold text-gray-900"
                    />
                    <p className="text-sm text-gray-500">{option.duration}</p>
                  </div>

                  <div className="space-y-2 mb-6">
                    {option.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <ShieldCheckIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
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
                Siguria e Leximit
              </h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Mbrojtje nga kopjimi i tekstit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Parandalimi i screenshot-eve</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Mbyllja e mjeteve të zhvilluesit</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Monitorimi i aktivitetit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Watermark i personalizuar</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Siguri në kohë reale</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
} 