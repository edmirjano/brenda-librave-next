'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  CreditCard,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
  User,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { GlassFormField } from '@/components/ui/form/GlassFormField';

import { type CreateOrderFormData, createOrderSchema } from '@/lib/validations/order';

import type { CartSummary } from '@/types/cart';

export function CheckoutForm() {
  const router = useRouter();
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      currency: 'ALL',
      paymentMethod: 'PAYPAL',
      shippingCountry: 'Shqipëri',
    },
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
        if (response.ok) {
          const data = await response.json();
          setCartSummary(data.data);
          
          // Redirect if cart is empty
          if (!data.data || data.data.items.length === 0) {
            toast.error('Shporta është bosh');
            router.push('/cart');
            return;
          }
        } else {
          throw new Error('Failed to fetch cart');
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Gabim në ngarkimin e shportës');
        router.push('/cart');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [router]);

  const onSubmit = async (data: CreateOrderFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create order');
      }

      toast.success('Porosia u krijua me sukses!');
      router.push(`/orders/${result.data.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error instanceof Error ? error.message : 'Gabim në krijimin e porosisë');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <GlassCard className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <span className="ml-3 text-gray-700">Duke ngarkuar checkout...</span>
        </div>
      </GlassCard>
    );
  }

  if (!cartSummary || cartSummary.items.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Shporta është bosh</h3>
        <p className="text-gray-600">Nuk mund të vazhdoni me checkout pa libra në shportë.</p>
      </GlassCard>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Checkout Form */}
      <div className="lg:col-span-2 space-y-8">
        {/* Shipping Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Informacionet e dërgimit</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassFormField
                label="Emri i plotë"
                type="text"
                placeholder="Shkruani emrin tuaj të plotë"
                icon={<User className="h-5 w-5" />}
                error={errors.shippingName?.message}
                {...register('shippingName')}
              />

              <GlassFormField
                label="Email"
                type="email"
                placeholder="email@example.com"
                icon={<User className="h-5 w-5" />}
                error={errors.shippingEmail?.message}
                {...register('shippingEmail')}
              />

              <GlassFormField
                label="Telefon"
                type="tel"
                placeholder="+355 6X XXX XXX"
                icon={<User className="h-5 w-5" />}
                error={errors.shippingPhone?.message}
                {...register('shippingPhone')}
              />

              <GlassFormField
                label="Qyteti"
                type="text"
                placeholder="Tiranë"
                icon={<MapPin className="h-5 w-5" />}
                error={errors.shippingCity?.message}
                {...register('shippingCity')}
              />

              <div className="md:col-span-2">
                <GlassFormField
                  label="Adresa"
                  type="text"
                  placeholder="Rruga, numri, apartamenti"
                  icon={<MapPin className="h-5 w-5" />}
                  error={errors.shippingAddress?.message}
                  {...register('shippingAddress')}
                />
              </div>

              <GlassFormField
                label="Kodi postar"
                type="text"
                placeholder="1001"
                icon={<MapPin className="h-5 w-5" />}
                error={errors.shippingZip?.message}
                {...register('shippingZip')}
              />

              <GlassFormField
                label="Shteti"
                type="text"
                placeholder="Shqipëri"
                icon={<MapPin className="h-5 w-5" />}
                error={errors.shippingCountry?.message}
                {...register('shippingCountry')}
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-3">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Metoda e pagesës</h3>
            </div>

            <div className="space-y-4">
              {[
                { value: 'PAYPAL', label: 'PayPal', description: 'Paguani me PayPal' },
                { value: 'STRIPE', label: 'Kartë krediti/debiti', description: 'Visa, Mastercard, American Express' },
                { value: 'BANK_TRANSFER', label: 'Transfer bankar', description: 'Paguani me transfer bankar' },
              ].map((method) => (
                <label
                  key={method.value}
                  className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50/50 transition-colors"
                >
                  <input
                    type="radio"
                    value={method.value}
                    {...register('paymentMethod')}
                    className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">{method.label}</div>
                    <div className="text-sm text-gray-600">{method.description}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.paymentMethod && (
              <p className="text-sm text-red-600 mt-2">{errors.paymentMethod.message}</p>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="sticky top-24 space-y-6"
        >
          {/* Order Items */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Porosia juaj ({cartSummary.totalItems} libra)
            </h3>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cartSummary.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-12 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded flex items-center justify-center flex-shrink-0">
                    {item.book.coverImage ? (
                      <img
                        src={item.book.coverImage}
                        alt={item.book.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <Package className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{item.book.title}</h4>
                    <p className="text-xs text-gray-600">{item.book.author}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">Sasia: {item.quantity}</span>
                      <PriceDisplay
                        priceALL={item.isDigital ? (item.book.digitalPriceALL || 0) : (item.book.priceALL || 0)}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Order Total */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Përmbledhja e pagesës</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Nëntotali:</span>
                <PriceDisplay priceALL={cartSummary.subtotal} size="sm" />
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Dërgimi:</span>
                {cartSummary.shippingCost === 0 ? (
                  <span className="text-green-600 font-medium">Falas</span>
                ) : (
                  <PriceDisplay priceALL={cartSummary.shippingCost} size="sm" />
                )}
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Totali:</span>
                  <PriceDisplay
                    priceALL={cartSummary.totalAmount}
                    size="lg"
                    variant="accent"
                  />
                </div>
              </div>
            </div>

            <LiquidButton
              type="submit"
              variant="albanian"
              size="lg"
              className="w-full"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              {isSubmitting ? 'Duke përpunuar...' : 'Përfundo porosinë'}
            </LiquidButton>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Duke klikuar "Përfundo porosinë", ju pranoni{' '}
              <a href="/terms-conditions" className="text-red-600 hover:underline">
                Termat dhe Kushtet
              </a>{' '}
              tona.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </form>
  );
}