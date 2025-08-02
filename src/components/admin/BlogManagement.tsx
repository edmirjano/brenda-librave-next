'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  FileText,
  Heart,
  MessageCircle,
  Plus,
  Search,
  Star,
  Trash2,
  User,
  XCircle,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Pagination } from '@/components/ui/Pagination';

import type { BlogPostListItem, BlogSearchResult } from '@/types/blog';

export function BlogManagement() {
  const [posts, setPosts] = useState<BlogSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (searchQuery) params.set('query', searchQuery);
      if (typeFilter !== 'all') params.set('type', typeFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      params.set('page', currentPage.toString());
      params.set('limit', '20');

      const response = await fetch(`/api/admin/blog/posts?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.data);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Gabim në ngarkimin e postimeve');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [searchQuery, typeFilter, statusFilter, currentPage]);

  const moderatePost = async (postId: string, action: 'APPROVE' | 'REJECT' | 'FEATURE', rejectionReason?: string) => {
    try {
      const response = await fetch(`/api/admin/blog/posts/${postId}/moderate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, rejectionReason }),
      });

      if (response.ok) {
        toast.success(`Postimi u ${action === 'APPROVE' ? 'miratua' : action === 'REJECT' ? 'refuzua' : 'shënua si i veçantë'} me sukses`);
        fetchPosts();
      } else {
        throw new Error('Failed to moderate post');
      }
    } catch (error) {
      toast.error('Gabim në moderimin e postimit');
    }
  };

  const deletePost = async (postId: string, title: string) => {
    if (!confirm(`Jeni të sigurt që dëshironi të fshini postimin "${title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blog/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Postimi u fshi me sukses');
        fetchPosts();
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      toast.error('Gabim në fshirjen e postimit');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'PENDING_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'PUBLISHED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'Draft';
      case 'PENDING_REVIEW': return 'Në pritje';
      case 'APPROVED': return 'Miratuar';
      case 'REJECTED': return 'Refuzuar';
      case 'PUBLISHED': return 'Botuar';
      default: return status;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'FEATURED': return 'bg-yellow-100 text-yellow-800';
      case 'USER': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'ADMIN': return 'Zyrtare';
      case 'FEATURED': return 'E veçantë';
      case 'USER': return 'Nga përdoruesi';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menaxhimi i Blogut</h1>
          <p className="text-gray-600 mt-1">Menaxho postimet, kategoritë dhe moderimin</p>
        </div>

        <Link href="/admin/blog/new">
          <LiquidButton variant="albanian" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Postim i Ri
          </LiquidButton>
        </Link>
      </div>

      {/* Filters */}
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kërkoni postime, autorë, ose përmbajtje..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            >
              <option value="all">Të gjitha llojet</option>
              <option value="ADMIN">Zyrtare</option>
              <option value="USER">Nga përdoruesit</option>
              <option value="FEATURED">Të veçanta</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            >
              <option value="all">Të gjitha statuset</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING_REVIEW">Në pritje</option>
              <option value="APPROVED">Miratuar</option>
              <option value="REJECTED">Refuzuar</option>
              <option value="PUBLISHED">Botuar</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Posts Table */}
      <GlassCard className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-gray-700">Duke ngarkuar postimet...</span>
          </div>
        ) : posts && posts.posts.length > 0 ? (
          <div className="space-y-6">
            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <p className="text-gray-700">
                U gjetën <span className="font-semibold">{posts.totalCount}</span> postime
              </p>
              <p className="text-sm text-gray-500">
                Faqja {posts.currentPage} nga {posts.totalPages}
              </p>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {posts.posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="p-6 bg-white/50 rounded-xl hover:bg-white/70 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{post.title}</h3>
                          <p className="text-sm text-gray-600">nga {post.author.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mb-3">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getTypeColor(post.type)}`}>
                          {getTypeLabel(post.type)}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(post.status)}`}>
                          {getStatusLabel(post.status)}
                        </span>
                        {post.language === 'EN' && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            English
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.createdAt).toLocaleDateString('sq-AL')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Eye className="h-4 w-4" />
                          <span>{post.views} shikime</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Heart className="h-4 w-4" />
                          <span>{post._count.likes_relation} pëlqime</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post._count.comments} komente</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Link href={`/blog/${post.slug}`}>
                        <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      </Link>
                      <Link href={`/admin/blog/${post.id}/edit`}>
                        <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>

                      {/* Moderation Actions */}
                      {post.status === 'PENDING_REVIEW' && (
                        <>
                          <button
                            onClick={() => moderatePost(post.id, 'APPROVE')}
                            className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                            title="Mirato"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Arsyeja e refuzimit:');
                              if (reason) moderatePost(post.id, 'REJECT', reason);
                            }}
                            className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                            title="Refuzo"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}

                      {(post.status === 'APPROVED' || post.status === 'PUBLISHED') && post.type !== 'FEATURED' && (
                        <button
                          onClick={() => moderatePost(post.id, 'FEATURE')}
                          className="p-2 text-gray-600 hover:text-yellow-600 transition-colors"
                          title="Bëje të veçantë"
                        >
                          <Star className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        onClick={() => deletePost(post.id, post.title)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {posts.totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={posts.currentPage}
                  totalPages={posts.totalPages}
                  hasNextPage={posts.hasNextPage}
                  hasPreviousPage={posts.hasPreviousPage}
                  baseUrl="/admin/blog"
                  searchParams={{
                    query: searchQuery || undefined,
                    type: typeFilter !== 'all' ? typeFilter : undefined,
                    status: statusFilter !== 'all' ? statusFilter : undefined,
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nuk u gjetën postime</h3>
            <p className="text-gray-600 mb-6">
              Nuk ka postime që përputhen me kriteret tuaja të kërkimit.
            </p>
            <Link href="/admin/blog/new">
              <LiquidButton variant="albanian" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Krijo Postimin e Parë
              </LiquidButton>
            </Link>
          </div>
        )}
      </GlassCard>
    </div>
  );
}