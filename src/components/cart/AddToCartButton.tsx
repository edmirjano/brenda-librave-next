'use client';

import { useState } from 'react';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { LiquidButton } from '@/components/ui/LiquidButton';

import type { BookDetailView } from '@/types/book';

interface AddToCartButtonProps {
  book: BookDetailView;
  format: 'physical' | 'digital';
  disabled?: boolean;
  className?: string;
}

export function AddToCartButton({
  book,
  format,
  disabled = false,
  className,
}: AddToCartButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (disabled || isAdding) return;

    // Redirect to login if not authenticated
    if (!session?.user?.id) {
      router.push('/auth/login?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setIsAdding(true);

    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: book.id,
          quantity: 1,
          isDigital: format === 'digital',
          currency: 'ALL', // TODO: Get from user preference
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add to cart');
      }

      toast.success('Libri u shtua në shportë!');
      
      // Trigger cart update (could use a global state manager here)
      window.dispatchEvent(new CustomEvent('cartUpdated'));

    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error instanceof Error ? error.message : 'Gabim në shtimin e librit');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <LiquidButton
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      loading={isAdding}
      variant="albanian"
      size="lg"
      className={className}
    >
      <ShoppingCart className="w-5 h-5 mr-2" />
      {isAdding ? (
        'Duke shtuar...'
      ) : (
        `Shto në shportë${format === 'digital' ? ' (Digital)' : ''}`
      )}
    </LiquidButton>
  );
}
