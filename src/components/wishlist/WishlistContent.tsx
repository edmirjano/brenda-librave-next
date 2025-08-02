'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { motion } from 'framer-motion';
import { ArrowRight, Heart, ShoppingCart, Star, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';
import { PriceDisplay } from '@/components/ui/PriceDisplay';

import type { Wishlist } from '@/types/forum';

export function WishlistContent() {
  const [wishlist, setWishlist] = useState<Wishlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const data = await response.json();
        setWishlist(data.data);
      } else {
        throw new Error('Failed to fetch wishlist');
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Gabim në ngarkimin e listës së dëshirave');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (bookId: string) => {
    try {
      const response = await fetch(`/api/wishlist/${bookId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove from wishlist');
      }

      await fetchWishlist();
      toast.success('Libri u hoq nga lista e dëshirave');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Gabim në heqjen e librit');
    }
  };

  const addToCart = async (bookId: string) => {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId,
          quantity: 1,
          isDigital: false,
          currency: 'ALL',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add to cart');
      }

      toast.success('Libri u shtua në shportë!');
      
      // Trigger cart update
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Gabim në shtimin e librit në shportë');
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 3: return 'bg-red-100 text-red-700';
      case 2: return 'bg-yellow-100 text-yellow-700';
      case 1: return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 3: return 'E lartë';
      case 2: return 'Mesatare';
      case 1: return 'E ulët';
      default: return 'E ulët';
    }
  };

  if (isLoading) {
    return (
      <GlassCard className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <span className="ml-3 text-gray-700">Duke ngarkuar listën e dëshirave...</span>
        </div>
      </GlassCard>
    );
  }

  if (wishlist.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="p-12 text-center">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lista e dëshirave është bosh</h2>
          <p className="text-gray-600 mb-8">
            Nuk keni shtuar asnjë libër në listën e dëshirave akoma. Eksploroni koleksionin tonë!
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
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Librat në listën tuaj ({wishlist.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <GlassCard className="p-6 hover:scale-105 transition-transform duration-300">
              {/* Book Cover */}
              <div className="relative mb-4">
                <Link href={`/books/${item.book.slug}`}>
                  <div className="w-full h-48 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer">
                    {item.book.coverImage ? (
                      <img
                        src={item.book.coverImage}
                        alt={`Kapaku i librit "${item.book.title}"`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Heart className="h-12 w-12 text-red-600" />
                    )}
                  </div>
                </Link>

                {/* Priority Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getPriorityColor(item.priority)}`}>
                    {getPriorityLabel(item.priority)}
                  </span>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(item.book.id)}
                  className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                  title="Hiq nga lista"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>

              {/* Book Info */}
              <div className="space-y-3">
                <Link href={`/books/${item.book.slug}`}>
                  <h3 className="font-semibold text-gray-900 hover:text-red-600 transition-colors cursor-pointer">
                    {item.book.title}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600">{item.book.author}</p>
                <p className="text-xs text-red-600 font-medium">{item.book.category.name}</p>

                {/* Notes */}
                {item.notes && (
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
                    {item.notes}
                  </p>
                )}

                {/* Price and Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <PriceDisplay
                    priceALL={item.book.priceALL || 0}
                    priceEUR={item.book.priceEUR || undefined}
                    size="sm"
                    variant="accent"
                  />
                  <button
                    onClick={() => addToCart(item.book.id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Shto në shportë"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}