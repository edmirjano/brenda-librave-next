'use client';

import Link from 'next/link';

import { motion } from 'framer-motion';
import { Calendar, Eye, FileText, Heart, MessageCircle, Star, User } from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';

import type { BlogPostListItem } from '@/types/blog';

interface BlogPostCardProps {
  post: BlogPostListItem;
  index?: number;
}

export function BlogPostCard({ post, index = 0 }: BlogPostCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ADMIN': return 'bg-red-100 text-red-700';
      case 'FEATURED': return 'bg-yellow-100 text-yellow-700';
      case 'USER': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'ADMIN': return 'Zyrtare';
      case 'FEATURED': return 'E veçantë';
      case 'USER': return 'Nga komuniteti';
      default: return type;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group"
    >
      <Link href={`/blog/${post.slug}`}>
        <GlassCard className="p-6 hover:scale-105 transition-transform duration-300 cursor-pointer h-full">
          {/* Featured Image */}
          <div className="relative mb-4">
            <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-200 rounded-xl flex items-center justify-center overflow-hidden">
              {post.featuredImage ? (
                <img
                  src={post.featuredImage}
                  alt={`Imazhi i artikullit "${post.title}"`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FileText className="h-12 w-12 text-blue-600" />
              )}
            </div>

            {/* Type Badge */}
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${getTypeColor(post.type)}`}>
                {getTypeLabel(post.type)}
              </span>
            </div>

            {/* Language Badge */}
            {post.language === 'EN' && (
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                  English
                </span>
              </div>
            )}
          </div>

          {/* Post Info */}
          <div className="space-y-3">
            {/* Category */}
            {post.category && (
              <p className="text-xs text-red-600 font-medium">{post.category.name}</p>
            )}

            {/* Title */}
            <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
              {post.title}
            </h3>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
            )}

            {/* Author and Date */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {post.publishedAt 
                    ? new Date(post.publishedAt).toLocaleDateString('sq-AL')
                    : new Date(post.createdAt).toLocaleDateString('sq-AL')
                  }
                </span>
              </div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, 3).map((postTag) => (
                  <span
                    key={postTag.tag.id}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {postTag.tag.name}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{post.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-3 w-3" />
                  <span>{post._count.likes_relation}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{post._count.comments}</span>
                </div>
              </div>

              {post.type === 'FEATURED' && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}