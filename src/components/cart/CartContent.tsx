'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { motion } from 'framer-motion';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';
import { PriceDisplay } from '@/components/ui/PriceDisplay';

import type { CartSummary } from '@/types/cart';

export function CartContent() {
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setCartSummary(data.data);
      } else {
        throw new Error('Failed to fetch cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Gabim në ngarkimin e shportës');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();

    // Listen for cart updates
    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingItems(prev => new Set(prev).add(itemId));

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update quantity');
      }

      await fetchCart();
      toast.success('Sasia u përditësua');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(error instanceof Error ? error.message : 'Gabim në përditësimin e sasisë');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const removeItem = async (itemId: string) => {
    setUpdatingItems(prev => new Set(prev).add(itemId));

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove item');
      }

      await fetchCart();
      toast.success('Libri u hoq nga shporta');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Gabim në heqjen e librit');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const clearCart = async () => {
    if (!confirm('Jeni të sigurt që dëshironi të pastroni shportën?')) {
      return;
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      await fetchCart();
      toast.success('Shporta u pastrua');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Gabim në pastrimin e shportës');
    }
  };

  if (isLoading) {
    return (
      <GlassCard className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <span className="ml-3 text-gray-700">Duke ngarkuar shportën...</span>
        </div>
      </GlassCard>
    );
  }

  if (!cartSummary || cartSummary.items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="p-12 text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Shporta është bosh</h2>
          <p className="text-gray-600 mb-8">
            Nuk keni shtuar asnjë libër në shportë akoma. Eksploroni koleksionin tonë!
          </p>
          <Link href="/books">
            <LiquidButton variant="albanian" size="lg">
              <ArrowRight className="w-5 h-5 mr-2" />
              Shiko librat
            </LiquidButton>
          </Link>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Librat në shportë ({cartSummary.totalItems})
          </h2>
          {cartSummary.items.length > 0 && (
            <LiquidButton variant="ghost" size="sm" onClick={clearCart}>
              <X className="w-4 h-4 mr-2" />
              Pastro shportën
            </LiquidButton>
          )}
        </div>

        {cartSummary.items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-start space-x-4">
                {/* Book Cover */}
                <div className="w-20 h-28 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.book.coverImage ? (
                    <img
                      src={item.book.coverImage}
                      alt={`Kapaku i librit "${item.book.title}"`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <ShoppingBag className="h-8 w-8 text-red-600" />
                  )}
                </div>

                {/* Book Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.book.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.book.author}</p>
                      <p className="text-xs text-red-600 mb-3">{item.book.category.name}</p>
                      
                      {item.isDigital && (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          Digital
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={updatingItems.has(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      
                      <span className="font-medium text-gray-900 min-w-[2rem] text-center">
                        {updatingItems.has(item.id) ? '...' : item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= 10 || updatingItems.has(item.id)}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <PriceDisplay
                      priceALL={item.isDigital ? (item.book.digitalPriceALL || 0) : (item.book.priceALL || 0)}
                      priceEUR={item.isDigital ? item.book.digitalPriceEUR : item.book.priceEUR}
                      size="md"
                      variant="accent"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="sticky top-24"
        >
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Përmbledhja e porosisë</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Nëntotali:</span>
                <PriceDisplay
                  priceALL={cartSummary.subtotal}
                  size="sm"
                />
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Dërgimi:</span>
                {cartSummary.shippingCost === 0 ? (
                  <span className="text-green-600 font-medium">Falas</span>
                ) : (
                  <PriceDisplay
                    priceALL={cartSummary.shippingCost}
                    size="sm"
                  />
                )}
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Totali:</span>
                  <PriceDisplay
                    priceALL={cartSummary.totalAmount}
                    size="lg"
                    variant="accent"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/checkout">
                <LiquidButton variant="albanian" size="lg" className="w-full">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Vazhdo me blerjen
                </LiquidButton>
              </Link>
              
              <Link href="/books">
                <LiquidButton variant="secondary" size="lg" className="w-full">
                  Vazhdo blerjen
                </LiquidButton>
              </Link>
            </div>

            {/* Shipping Info */}
            {cartSummary.hasPhysicalItems && (
              <div className="mt-6 p-4 bg-blue-50/50 rounded-xl">
                <p className="text-sm text-blue-800">
                  <strong>Dërgim falas</strong> për porosi mbi{' '}
                  <PriceDisplay
                    priceALL={cartSummary.currency === 'ALL' ? 3000 : 30}
                    size="sm"
                  />
                </p>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}