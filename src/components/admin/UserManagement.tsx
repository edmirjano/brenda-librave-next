'use client';

import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import {
  Calendar,
  Crown,
  Mail,
  Search,
  Shield,
  User,
  UserCheck,
  UserX,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Pagination } from '@/components/ui/Pagination';

interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: string | null;
  newsletter: boolean;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

interface UserSearchResult {
  users: UserListItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function UserManagement() {
  const [users, setUsers] = useState<UserSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (searchQuery) params.set('query', searchQuery);
      if (roleFilter !== 'all') params.set('role', roleFilter);
      params.set('page', currentPage.toString());
      params.set('limit', '20');

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Gabim në ngarkimin e përdoruesve');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, roleFilter, currentPage]);

  const toggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    
    if (!confirm(`Jeni të sigurt që dëshironi të ndryshoni rolin në ${newRole}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        toast.success('Roli u ndryshua me sukses');
        fetchUsers();
      } else {
        throw new Error('Failed to update user role');
      }
    } catch (error) {
      toast.error('Gabim në ndryshimin e rolit');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Menaxhimi i Përdoruesve</h1>
        <p className="text-gray-600 mt-1">Menaxho përdoruesit dhe rolet e tyre</p>
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
                placeholder="Kërkoni sipas emrit ose email-it..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            >
              <option value="all">Të gjithë</option>
              <option value="USER">Përdorues</option>
              <option value="ADMIN">Administratorë</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Users Table */}
      <GlassCard className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-gray-700">Duke ngarkuar përdoruesit...</span>
          </div>
        ) : users && users.users.length > 0 ? (
          <div className="space-y-6">
            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <p className="text-gray-700">
                U gjetën <span className="font-semibold">{users.totalCount}</span> përdorues
              </p>
              <p className="text-sm text-gray-500">
                Faqja {users.currentPage} nga {users.totalPages}
              </p>
            </div>

            {/* Users List */}
            <div className="space-y-4">
              {users.users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="p-6 bg-white/50 rounded-xl hover:bg-white/70 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        user.role === 'ADMIN' 
                          ? 'bg-gradient-to-r from-red-500 to-red-600'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600'
                      }`}>
                        {user.role === 'ADMIN' ? (
                          <Crown className="h-6 w-6 text-white" />
                        ) : (
                          <User className="h-6 w-6 text-white" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{user.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            user.role === 'ADMIN'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role === 'ADMIN' ? 'Administrator' : 'Përdorues'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(user.createdAt).toLocaleDateString('sq-AL')}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {user.emailVerified ? (
                              <UserCheck className="h-4 w-4 text-green-600" />
                            ) : (
                              <UserX className="h-4 w-4 text-red-600" />
                            )}
                            <span>
                              {user.emailVerified ? 'Email i verifikuar' : 'Email i paverifikuar'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <span className="text-gray-600">
                            <strong>{user.orderCount}</strong> porosi
                          </span>
                          <span className="text-gray-600">
                            Totali: <strong>{user.totalSpent.toLocaleString()} ALL</strong>
                          </span>
                          {user.newsletter && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Newsletter
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleUserRole(user.id, user.role)}
                        className={`p-2 transition-colors ${
                          user.role === 'ADMIN'
                            ? 'text-gray-600 hover:text-blue-600'
                            : 'text-gray-600 hover:text-red-600'
                        }`}
                        title={user.role === 'ADMIN' ? 'Bëje përdorues' : 'Bëje administrator'}
                      >
                        <Shield className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {users.totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={users.currentPage}
                  totalPages={users.totalPages}
                  hasNextPage={users.hasNextPage}
                  hasPreviousPage={users.hasPreviousPage}
                  baseUrl="/admin/users"
                  searchParams={{
                    query: searchQuery || undefined,
                    role: roleFilter !== 'all' ? roleFilter : undefined,
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nuk u gjetën përdorues</h3>
            <p className="text-gray-600">
              Nuk ka përdorues që përputhen me kriteret tuaja të kërkimit.
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}