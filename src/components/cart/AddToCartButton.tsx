'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { BookDetailView } from '@/types/book';

interface AddToCartButtonProps {
  book: BookDetailView;
  format: 'physical' | 'digital';
  disabled?: boolean;
  className?: string;
}

export function AddToCartButton({ book, format, disabled = false, className }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (disabled || isAdding) return;

    setIsAdding(true);
    
    try {
      // TODO: Implement actual cart functionality
      // This would typically call an API to add the item to cart
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      console.log('Added to cart:', {
        bookId: book.id,
        format,
        title: book.title
      });
      
      // TODO: Show success message/toast
      // TODO: Update cart state/count
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      // TODO: Show error message
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      loading={isAdding}
      className={className}
      size="lg"
    >
      {isAdding ? (
        'Duke shtuar...'
      ) : (
        <>
          🛒 Shto në shportë
          {format === 'digital' && ' (Digital)'}
        </>
      )}
    </Button>
  );
}