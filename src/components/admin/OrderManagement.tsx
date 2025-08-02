'use client';

import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import {
  Calendar,
  CreditCard,
  Eye,
  Filter,
  Package,
  Search,
  Truck,
  User,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Pagination } from '@/components/ui/Pagination';
import { PriceDisplay } from '@/components/ui/PriceDisplay';

interface OrderListItem {
  id: string;
  orderNumber: string;
  shippingName: string;
  shippingEmail: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  itemCount: number;
}

interface OrderSearchResult {
  orders: OrderListItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function OrderManagement() {
  const [orders, setOrders] = useState<OrderSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (searchQuery) params.set('query', searchQuery);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      params.set('page', currentPage.toString());
      params.set('limit', '20');

      const response = await fetch(`/api/admin/orders?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Gabim në ngarkimin e porosive');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [searchQuery, statusFilter, currentPage]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success('Statusi i porosisë u përditësua');
        fetchOrders();
      } else {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      toast.error('Gabim në përditësimin e statusit');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'REFUNDED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Në pritje';
      case 'PAID': return 'Paguar';
      case 'PROCESSING': return 'Duke u përpunuar';
      case 'SHIPPED': return 'Dërguar';
      case 'DELIVERED': return 'Dorëzuar';
      case 'CANCELLED': return 'Anuluar';
      case 'REFUNDED': return 'Rimbursuar';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Menaxhimi i Porosive</h1>
        <p className="text-gray-600 mt-1">Menaxho porositë dhe statusin e tyre</p>
      </div>

      {/* Filters */}
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kërkoni sipas numrit të porosisë, emrit të klientit..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            >
              <option value="all">Të gjitha</option>
              <option value="PENDING">Në pritje</option>
              <option value="PAID">Paguar</option>
              <option value="PROCESSING">Duke u përpunuar</option>
              <option value="SHIPPED">Dërguar</option>
              <option value="DELIVERED">Dorëzuar</option>
              <option value="CANCELLED">Anuluar</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Orders Table */}
      <GlassCard className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-gray-700">Duke ngarkuar porositë...</span>
          </div>
        ) : orders && orders.orders.length > 0 ? (
          <div className="space-y-6">
            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <p className="text-gray-700">
                U gjetën <span className="font-semibold">{orders.totalCount}</span> porosi
              </p>
              <p className="text-sm text-gray-500">
                Faqja {orders.currentPage} nga {orders.totalPages}
              </p>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {orders.orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="p-6 bg-white/50 rounded-xl hover:bg-white/70 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                          <p className="text-sm text-gray-600">{order.shippingName}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{order.shippingEmail}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString('sq-AL')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{order.paymentMethod}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{order.itemCount} libra</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <PriceDisplay priceALL={order.totalAmount} size="md" variant="accent" />
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {/* TODO: View order details */}}
                          className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {order.status === 'PAID' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'PROCESSING')}
                            className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                            title="Shëno si duke u përpunuar"
                          >
                            <Package className="h-4 w-4" />
                          </button>
                        )}

                        {order.status === 'PROCESSING' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                            className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                            title="Shëno si dërguar"
                          >
                            <Truck className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {orders.totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={orders.currentPage}
                  totalPages={orders.totalPages}
                  hasNextPage={orders.hasNextPage}
                  hasPreviousPage={orders.hasPreviousPage}
                  baseUrl="/admin/orders"
                  searchParams={{
                    query: searchQuery || undefined,
                    status: statusFilter !== 'all' ? statusFilter : undefined,
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nuk u gjetën porosi</h3>
            <p className="text-gray-600">
              Nuk ka porosi që përputhen me kriteret tuaja të kërkimit.
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}