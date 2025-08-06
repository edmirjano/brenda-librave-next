'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlayIcon, 
  ClockIcon, 
  InfinityIcon, 
  SpeakerWaveIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CurrencyEuroIcon
} from '@heroicons/react/24/outline';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { PriceDisplay } from '@/components/ui/PriceDisplay';

interface AudioBook {
  id: string;
  title: string;
  author: string;
  narrator: string;
  duration: number;
  fileSize: number;
  price?: number;
  digitalPrice?: number;
  baseCurrency: 'ALL' | 'EUR';
  hasDigital: boolean;
  hasPhysical: boolean;
  inventory: number;
  quality: string;
  language: string;
}

interface AudioBookRentalOptionsProps {
  audioBook: AudioBook;
  onRentalSelect: (rentalType: string, rentalPrice: number, guaranteeAmount?: number) => void;
}

type RentalType = 'SINGLE_LISTEN' | 'TIME_LIMITED' | 'UNLIMITED_LISTENS';

export function AudioBookRentalOptions({ 
  audioBook, 
  onRentalSelect 
}: AudioBookRentalOptionsProps) {
  const [selectedType, setSelectedType] = useState<RentalType | null>(null);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${Math.round(mb)} MB`;
  };

  const getRentalOptions = () => {
    const basePrice = audioBook.digitalPrice || audioBook.price || 0;
    
    return {
      SINGLE_LISTEN: {
        title: 'Një Dëgjim',
        description: 'Dëgjoni librin një herë plotësisht',
        duration: '24 orë',
        rentalPrice: Math.round(basePrice * 0.3),
        guaranteeAmount: audioBook.hasPhysical ? Math.round((audioBook.price || 0) * 0.8) : 0,
        features: [
          'Dëgjim i plotë një herë',
          'Akses për 24 orë',
          'Kualitet i lartë audio',
          'Kontrolli i shpejtësisë'
        ],
        icon: PlayIcon,
        color: 'blue'
      },
      TIME_LIMITED: {
        title: 'Akses i Kufizuar',
        description: 'Dëgjoni sa herë që dëshironi për 7 ditë',
        duration: '7 ditë',
        rentalPrice: Math.round(basePrice * 0.6),
        guaranteeAmount: audioBook.hasPhysical ? Math.round((audioBook.price || 0) * 0.8) : 0,
        features: [
          'Dëgjime të pakufizuara',
          'Akses për 7 ditë',
          'Ruajtja e progresit',
          'Kualitet i lartë audio'
        ],
        icon: ClockIcon,
        color: 'green'
      },
      UNLIMITED_LISTENS: {
        title: 'Dëgjime të Pakufizuara',
        description: 'Dëgjoni sa herë që dëshironi për 30 ditë',
        duration: '30 ditë',
        rentalPrice: Math.round(basePrice * 0.8),
        guaranteeAmount: audioBook.hasPhysical ? Math.round((audioBook.price || 0) * 0.8) : 0,
        features: [
          'Dëgjime të pakufizuara',
          'Akses për 30 ditë',
          'Ruajtja e progresit',
          'Kualitet i lartë audio',
          'Shkarkim për dëgjim offline'
        ],
        icon: InfinityIcon,
        color: 'purple'
      }
    };
  };

  const rentalOptions = getRentalOptions();

  const handleRentalSelect = (type: RentalType) => {
    setSelectedType(type);
    const option = rentalOptions[type];
    onRentalSelect(type, option.rentalPrice, option.guaranteeAmount);
  };

  return (
    <div className="space-y-6">
      {/* Audio Book Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <GlassCard className="p-6 bg-blue-50/50 border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <SpeakerWaveIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {audioBook.title}
              </h3>
              <p className="text-gray-600 mb-2">
                nga {audioBook.author}
              </p>
              <p className="text-sm text-gray-500 mb-3">
                Narrator: {audioBook.narrator}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Kohëzgjatja:</span>
                  <p className="text-gray-600">{formatDuration(audioBook.duration)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Madhësia:</span>
                  <p className="text-gray-600">{formatFileSize(audioBook.fileSize)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Kualiteti:</span>
                  <p className="text-gray-600">{audioBook.quality}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Gjuha:</span>
                  <p className="text-gray-600">{audioBook.language}</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Rental Options */}
      <div className="space-y-4">
        <div className="text-center">
          <h4 className="text-xl font-semibold text-gray-900 mb-2">
            Opsionet e Rentimit
          </h4>
          <p className="text-gray-600">
            Zgjidhni planin që përshtatet më mirë me nevojat tuaja
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(rentalOptions).map(([type, option]) => {
            const IconComponent = option.icon;
            const isSelected = selectedType === type;
            
            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <GlassCard 
                  className={`p-6 cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? `ring-2 ring-${option.color}-500 bg-${option.color}-50/50` 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => handleRentalSelect(type as RentalType)}
                >
                  <div className="text-center mb-6">
                    <div className={`inline-flex p-3 rounded-full mb-4 bg-${option.color}-100 text-${option.color}-600`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    
                    <h5 className="text-lg font-semibold text-gray-900 mb-2">
                      {option.title}
                    </h5>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      {option.description}
                    </p>

                    <div className="mb-4">
                      <PriceDisplay 
                        price={option.rentalPrice} 
                        currency={audioBook.baseCurrency}
                        className="text-2xl font-bold text-gray-900"
                      />
                      <p className="text-xs text-gray-500">{option.duration}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {option.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
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
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Audio Book Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <GlassCard className="p-6 bg-purple-50/50 border-purple-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">
                Përfitimet e Audio Librave
              </h5>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <SpeakerWaveIcon className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h6 className="font-medium text-gray-900">Dëgjim i Lehtë</h6>
                    <p className="text-sm text-gray-600">
                      Dëgjoni gjatë udhëtimit, punës ose relaksimit
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <PlayIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h6 className="font-medium text-gray-900">Kontrolli i Shpejtësisë</h6>
                    <p className="text-sm text-gray-600">
                      Rregulloni shpejtësinë sipas preferencave tuaja
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <ClockIcon className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h6 className="font-medium text-gray-900">Ruajtja e Progresit</h6>
                    <p className="text-sm text-gray-600">
                      Vazhdoni nga ku keni ndalur
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-gray-900 mb-4">
                Informacione të Rëndësishme
              </h5>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div>
                    <h6 className="font-medium text-gray-900">Siguria</h6>
                    <p className="text-gray-600">
                      Audio librat janë të mbrojtur nga kopjimi
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CurrencyEuroIcon className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <h6 className="font-medium text-gray-900">Garantia</h6>
                    <p className="text-gray-600">
                      Për librat fizikë kërkohet një garanci
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <h6 className="font-medium text-gray-900">Kualiteti</h6>
                    <p className="text-gray-600">
                      Audio me kualitet të lartë {audioBook.quality}
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