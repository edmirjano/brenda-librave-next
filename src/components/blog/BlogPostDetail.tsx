'use client';

import { useState } from 'react';

import { useSession } from 'next-auth/react';

import { motion } from 'framer-motion';
import {
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Star,
  ThumbsUp,
  User,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';
import { ShareButton } from '@/components/ui/ShareButton';

import type { BlogPost } from '@/types/blog';

interface BlogPostDetailProps {
  post: BlogPost;
}

export function BlogPostDetail({ post }: BlogPostDetailProps) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post._count.likes_relation);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!session?.user?.id) {
      toast.error('Duhet të jeni të kyçur për të pëlqyer postime');
      return;
    }

    setIsLiking(true);

    try {
      const response = await fetch(`/api/blog/posts/${post.id}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      const result = await response.json();
      setIsLiked(result.data.liked);
      setLikeCount(result.data.totalLikes);

      toast.success(result.data.liked ? 'Postimi u pëlqye!' : 'Pëlqimi u hoq');
    } catch (error) {
      toast.error('Gabim në pëlqimin e postimit');
    } finally {
      setIsLiking(false);
    }
  };

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
    <div className="max-w-4xl mx-auto">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="p-8 md:p-12">
          {/* Header */}
          <header className="mb-8">
            {/* Meta Info */}
            <div className="flex items-center space-x-3 mb-6">
              <span className={`px-3 py-1 text-sm rounded-full font-medium ${getTypeColor(post.type)}`}>
                {getTypeLabel(post.type)}
              </span>
              {post.category && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                  {post.category.name}
                </span>
              )}
              {post.language === 'EN' && (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                  English
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Author and Date */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    {post.author.image ? (
                      <img
                        src={post.author.image}
                        alt={post.author.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{post.author.name}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {post.publishedAt 
                          ? new Date(post.publishedAt).toLocaleDateString('sq-AL')
                          : new Date(post.createdAt).toLocaleDateString('sq-AL')
                        }
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {post.views} shikime
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <ShareButton
                url={`/blog/${post.slug}`}
                title={post.title}
                description={post.excerpt || post.content.slice(0, 160)}
              />
            </div>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="mb-8">
                <img
                  src={post.featuredImage}
                  alt={`Imazhi i artikullit "${post.title}"`}
                  className="w-full h-64 md:h-96 object-cover rounded-xl"
                />
              </div>
            )}
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <div 
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }}
            />
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Etiketat:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((postTag) => (
                  <span
                    key={postTag.tag.id}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    #{postTag.tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Engagement */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-6">
              <LiquidButton
                variant={isLiked ? 'albanian' : 'secondary'}
                size="sm"
                onClick={handleLike}
                disabled={isLiking}
                loading={isLiking}
              >
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {likeCount} pëlqime
              </LiquidButton>

              <div className="flex items-center space-x-1 text-gray-600">
                <MessageCircle className="h-4 w-4" />
                <span>{post._count.comments} komente</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Eye className="h-4 w-4" />
              <span>{post.views} shikime</span>
            </div>
          </div>
        </GlassCard>
      </motion.article>

      {/* Comments Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-8"
      >
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Komente ({post._count.comments})
          </h2>
          
          {/* Comment Form */}
          {session ? (
            <div className="mb-8 p-6 bg-blue-50/50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shkruani një koment</h3>
              <textarea
                placeholder="Shkruani komentin tuaj këtu..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm resize-none"
                rows={4}
              />
              <div className="flex justify-end mt-4">
                <LiquidButton variant="albanian" size="sm">
                  Posto komentin
                </LiquidButton>
              </div>
            </div>
          ) : (
            <div className="mb-8 p-6 bg-gray-50/50 rounded-xl text-center">
              <p className="text-gray-600 mb-4">Duhet të jeni të kyçur për të komentuar</p>
              <LiquidButton variant="primary" size="sm">
                Kyçuni për të komentuar
              </LiquidButton>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {post.comments.length > 0 ? (
              post.comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                  className="p-4 bg-white/50 rounded-xl"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      {comment.author.image ? (
                        <img
                          src={comment.author.image}
                          alt={comment.author.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-gray-900">{comment.author.name}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString('sq-AL')}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nuk ka komente akoma. Jini i pari që komenton!</p>
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}