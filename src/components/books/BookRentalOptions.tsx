'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ClockIcon, 
  EyeIcon, 
  InfinityIcon, 
  ShieldCheckIcon,
  CurrencyEuroIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BookOpenIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { RentalOptions } from './RentalOptions';
import { HardcopyRentalOptions } from './HardcopyRentalOptions';

interface Book {
  id: string;
  title: string;
  author: string;
  price?: number;
  digitalPrice?: number;
  baseCurrency: 'ALL' | 'EUR';
  inventory: number;
  hasDigital: boolean;
  hasHardcopy: boolean;
  digitalFileUrl?: string;
  digitalFileSize?: number;
}

interface BookRentalOptionsProps {
  book: Book;
  onEbookRentalSelect: (rentalType: string, price: number) => void;
  onHardcopyRentalSelect: (rentalType: string, rentalPrice: number, guaranteeAmount: number) => void;
}

type RentalMode = 'ebook' | 'hardcopy' | null;

export function BookRentalOptions({ 
  book, 
  onEbookRentalSelect, 
  onHardcopyRentalSelect 
}: BookRentalOptionsProps) {
  const [selectedMode, setSelectedMode] = useState<RentalMode>(null);

  // Determine what rental options are available
  const hasEbookRental = book.hasDigital && book.digitalPrice && book.digitalPrice > 0;
  const hasHardcopyRental = book.hasHardcopy && book.price && book.price > 0 && book.inventory > 0;

  // If only one option is available, auto-select it
  React.useEffect(() => {
    if (!selectedMode) {
      if (hasEbookRental && !hasHardcopyRental) {
        setSelectedMode('ebook');
      } else if (hasHardcopyRental && !hasEbookRental) {
        setSelectedMode('hardcopy');
      }
    }
  }, [hasEbookRental, hasHardcopyRental, selectedMode]);

  if (!hasEbookRental && !hasHardcopyRental) {
    return (
      <GlassCard className="p-6">
        <div className="text-center">
          <BookOpenIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nuk ka opsione të rentimit
          </h3>
          <p className="text-gray-600">
            Ky libër nuk është i disponueshëm për rentim në këtë moment.
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Opsionet e Rentimit
        </h3>
        <p className="text-gray-600">
          Zgjidhni formatin që preferoni për të lexuar librin
        </p>
      </div>

      {/* Mode Selection - Only show if both options are available */}
      {hasEbookRental && hasHardcopyRental && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <GlassCard className="p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4 text-center">
              Zgjidhni Formatin e Rentimit
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ebook Option */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <GlassCard 
                  className={`p-6 cursor-pointer transition-all duration-300 ${
                    selectedMode === 'ebook' 
                      ? 'ring-2 ring-blue-500 bg-blue-50/50' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedMode('ebook')}
                >
                  <div className="text-center">
                    <DevicePhoneMobileIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h5 className="text-lg font-semibold text-gray-900 mb-2">
                      Rentim Digital
                    </h5>
                    <p className="text-sm text-gray-600 mb-4">
                      Lexoni në pajisjen tuaj me siguri të lartë
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">Akses i menjëhershëm</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">Siguri maksimale</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">Pa dërgesa</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <PriceDisplay 
                        price={book.digitalPrice || 0} 
                        currency={book.baseCurrency}
                        className="text-xl font-bold text-gray-900"
                      />
                      <p className="text-xs text-gray-500">çmimi fillestar</p>
                    </div>

                    <Button
                      variant={selectedMode === 'ebook' ? 'primary' : 'outline'}
                      size="sm"
                      className="w-full"
                    >
                      {selectedMode === 'ebook' ? 'Zgjedhur' : 'Zgjidh Digital'}
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Hardcopy Option */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <GlassCard 
                  className={`p-6 cursor-pointer transition-all duration-300 ${
                    selectedMode === 'hardcopy' 
                      ? 'ring-2 ring-green-500 bg-green-50/50' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedMode('hardcopy')}
                >
                  <div className="text-center">
                    <BookOpenIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h5 className="text-lg font-semibold text-gray-900 mb-2">
                      Rentim Fizik
                    </h5>
                    <p className="text-sm text-gray-600 mb-4">
                      Merrni librin fizik me sistem garantie
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">Librin fizik</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">Garantia e plotë</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">Dërgesa falas</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <PriceDisplay 
                        price={book.price || 0} 
                        currency={book.baseCurrency}
                        className="text-xl font-bold text-gray-900"
                      />
                      <p className="text-xs text-gray-500">çmimi fillestar</p>
                    </div>

                    <Button
                      variant={selectedMode === 'hardcopy' ? 'primary' : 'outline'}
                      size="sm"
                      className="w-full"
                    >
                      {selectedMode === 'hardcopy' ? 'Zgjedhur' : 'Zgjidh Fizik'}
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Rental Options Based on Selection */}
      {selectedMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {selectedMode === 'ebook' && hasEbookRental && (
            <div>
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Opsionet e Rentimit Digital
                </h4>
                <p className="text-gray-600">
                  Zgjidhni kohëzgjatjen e rentimit dhe nivelin e sigurisë
                </p>
              </div>
              <RentalOptions
                bookId={book.id}
                digitalPrice={book.digitalPrice || 0}
                currency={book.baseCurrency}
                onRentalSelect={onEbookRentalSelect}
              />
            </div>
          )}

          {selectedMode === 'hardcopy' && hasHardcopyRental && (
            <div>
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Opsionet e Rentimit Fizik
                </h4>
                <p className="text-gray-600">
                  Zgjidhni kohëzgjatjen dhe sistemin e garantisë
                </p>
              </div>
              <HardcopyRentalOptions
                bookId={book.id}
                bookPrice={book.price || 0}
                currency={book.baseCurrency}
                onRentalSelect={onHardcopyRentalSelect}
              />
            </div>
          )}
        </motion.div>
      )}

      {/* Auto-show options if only one is available */}
      {!selectedMode && hasEbookRental && !hasHardcopyRental && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Opsionet e Rentimit Digital
            </h4>
            <p className="text-gray-600">
              Ky libër është i disponueshëm vetëm në format digital
            </p>
          </div>
          <RentalOptions
            bookId={book.id}
            digitalPrice={book.digitalPrice || 0}
            currency={book.baseCurrency}
            onRentalSelect={onEbookRentalSelect}
          />
        </motion.div>
      )}

      {!selectedMode && hasHardcopyRental && !hasEbookRental && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Opsionet e Rentimit Fizik
            </h4>
            <p className="text-gray-600">
              Ky libër është i disponueshëm vetëm në format fizik
            </p>
          </div>
          <HardcopyRentalOptions
            bookId={book.id}
            bookPrice={book.price || 0}
            currency={book.baseCurrency}
            onRentalSelect={onHardcopyRentalSelect}
          />
        </motion.div>
      )}

      {/* Book Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <GlassCard className="p-6 bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Informacioni i Librit</h5>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Titulli:</span>
                  <span className="font-medium">{book.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Autori:</span>
                  <span className="font-medium">{book.author}</span>
                </div>
                {book.hasDigital && (
                  <div className="flex justify-between">
                    <span>Versioni Digital:</span>
                    <span className="text-green-600 font-medium">✓ I disponueshëm</span>
                  </div>
                )}
                {book.hasHardcopy && (
                  <div className="flex justify-between">
                    <span>Versioni Fizik:</span>
                    <span className="text-green-600 font-medium">✓ I disponueshëm</span>
                  </div>
                )}
                {book.inventory > 0 && (
                  <div className="flex justify-between">
                    <span>Kopjet në stok:</span>
                    <span className="font-medium">{book.inventory}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-3">Çmimet</h5>
              <div className="space-y-2 text-sm text-gray-700">
                {book.hasHardcopy && book.price && (
                  <div className="flex justify-between">
                    <span>Çmimi fizik:</span>
                    <PriceDisplay 
                      price={book.price} 
                      currency={book.baseCurrency}
                      className="font-medium"
                    />
                  </div>
                )}
                {book.hasDigital && book.digitalPrice && (
                  <div className="flex justify-between">
                    <span>Çmimi digital:</span>
                    <PriceDisplay 
                      price={book.digitalPrice} 
                      currency={book.baseCurrency}
                      className="font-medium"
                    />
                  </div>
                )}
                {book.digitalFileSize && (
                  <div className="flex justify-between">
                    <span>Madhësia e file:</span>
                    <span className="font-medium">
                      {Math.round(book.digitalFileSize / 1024 / 1024)} MB
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
} 