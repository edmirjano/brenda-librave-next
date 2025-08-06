'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CurrencyEuroIcon, 
  BanknotesIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { LiquidButton } from '@/components/ui/LiquidButton';
import toast from 'react-hot-toast';

interface ExchangeRateInfo {
  rate: number;
  lastUpdated: Date;
  examples: {
    eurToAll: string;
    allToEur: string;
  };
}

export function CurrencyManagement() {
  const [exchangeRateInfo, setExchangeRateInfo] = useState<ExchangeRateInfo | null>(null);
  const [newRate, setNewRate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchExchangeRateInfo();
  }, []);

  const fetchExchangeRateInfo = async () => {
    try {
      const response = await fetch('/api/admin/currency/exchange-rate');
      if (response.ok) {
        const data = await response.json();
        setExchangeRateInfo({
          ...data,
          lastUpdated: new Date(data.lastUpdated)
        });
        setNewRate(data.rate.toString());
      } else {
        toast.error('Failed to load exchange rate information');
      }
    } catch (error) {
      console.error('Error fetching exchange rate info:', error);
      toast.error('Error loading exchange rate information');
    } finally {
      setIsLoading(false);
    }
  };

  const updateExchangeRate = async () => {
    const rate = parseFloat(newRate);
    
    if (isNaN(rate) || rate <= 0) {
      toast.error('Please enter a valid exchange rate');
      return;
    }

    if (rate < 50 || rate > 200) {
      toast.error('Exchange rate seems unrealistic. Please verify the value.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/currency/exchange-rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rate })
      });

      if (response.ok) {
        const data = await response.json();
        setExchangeRateInfo({
          ...data.exchangeRate,
          lastUpdated: new Date(data.exchangeRate.lastUpdated)
        });
        toast.success('Exchange rate updated successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update exchange rate');
      }
    } catch (error) {
      console.error('Error updating exchange rate:', error);
      toast.error('Error updating exchange rate');
    } finally {
      setIsSaving(false);
    }
  };

  const resetRate = () => {
    if (exchangeRateInfo) {
      setNewRate(exchangeRateInfo.rate.toString());
    }
  };

  if (isLoading) {
    return (
      <GlassCard className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </GlassCard>
    );
  }

  const hasChanges = exchangeRateInfo && newRate !== exchangeRateInfo.rate.toString();
  const newRateValue = parseFloat(newRate);
  const isValidRate = !isNaN(newRateValue) && newRateValue > 0;

  return (
    <div className="space-y-6">
      {/* Current Exchange Rate Info */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <CurrencyEuroIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Exchange Rate Management</h3>
              <p className="text-sm text-gray-600">Manage EUR to ALL conversion rate</p>
            </div>
          </div>
          {exchangeRateInfo && (
            <div className="text-right">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <ClockIcon className="w-4 h-4" />
                <span>Last updated: {exchangeRateInfo.lastUpdated.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {exchangeRateInfo && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Current Rate */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <ChartBarIcon className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">Current Rate</p>
                  <p className="text-2xl font-bold text-green-900">{exchangeRateInfo.rate}</p>
                  <p className="text-xs text-green-600">ALL per EUR</p>
                </div>
              </div>
            </div>

            {/* Examples */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <BanknotesIcon className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">EUR → ALL</p>
                  <p className="text-lg font-bold text-blue-900">{exchangeRateInfo.examples.eurToAll}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CurrencyEuroIcon className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-800">ALL → EUR</p>
                  <p className="text-lg font-bold text-purple-900">{exchangeRateInfo.examples.allToEur}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Update Exchange Rate */}
      <GlassCard className="p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Update Exchange Rate</h4>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="exchangeRate" className="block text-sm font-medium text-gray-700 mb-2">
              New Exchange Rate (1 EUR = X ALL)
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="number"
                  id="exchangeRate"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  step="0.01"
                  min="0.01"
                  max="1000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter exchange rate..."
                />
              </div>
              <span className="text-sm text-gray-500 font-medium">ALL</span>
            </div>
            {isValidRate && newRateValue !== exchangeRateInfo?.rate && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Preview:</strong> 1 EUR = {newRateValue} ALL | {newRateValue} ALL = 1 EUR
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 text-orange-600"
                >
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Unsaved changes</span>
                </motion.div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={resetRate}
                variant="ghost"
                disabled={!hasChanges}
              >
                Reset
              </Button>
              <LiquidButton
                onClick={updateExchangeRate}
                disabled={!isValidRate || !hasChanges || isSaving}
                loading={isSaving}
                variant="primary"
              >
                {isSaving ? 'Updating...' : 'Update Rate'}
              </LiquidButton>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-amber-800">Important Notes</h5>
              <ul className="mt-2 text-sm text-amber-700 space-y-1">
                <li>• Changing the exchange rate affects all product prices displayed to users</li>
                <li>• This change is applied immediately across the entire platform</li>
                <li>• Existing orders maintain their original conversion rates</li>
                <li>• Consider notifying users about significant rate changes</li>
              </ul>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}