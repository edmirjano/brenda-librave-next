'use client';

import { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';

import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

export function CartIcon() {
  const { data: session } = useSession();
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) {
      setItemCount(0);
      return;
    }

    const fetchCartCount = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/cart');
        if (response.ok) {
          const data = await response.json();
          setItemCount(data.data?.totalItems || 0);
        }
      } catch (error) {
        console.error('Error fetching cart count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartCount();
  }, [session?.user?.id]);

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-red-600 transition-colors" />
      
      {itemCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </motion.div>
      )}
      
      {isLoading && (
        <div className="absolute -top-1 -right-1 w-3 h-3">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500"></div>
        </div>
      )}
    </motion.div>
  );
}