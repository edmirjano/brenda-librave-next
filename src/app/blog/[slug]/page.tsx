import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BlogPostDetail } from '@/components/blog/BlogPostDetail';
import { RelatedPosts } from '@/components/blog/RelatedPosts';

import { BlogService } from '@/lib/services/blog';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await BlogService.getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Postimi nuk u gjet | Blog | Brënda Librave',
      description: 'Postimi që kërkoni nuk ekziston.',
    };
  }

  return {
    title: `${post.title} | Blog | Brënda Librave`,
    description: post.excerpt || post.content.slice(0, 160),
    keywords: [
      post.title,
      post.author.name,
      post.category?.name || '',
      'blog shqiptar',
      'literatura',
      ...post.tags.map((pt) => pt.tag.name),
    ],
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.slice(0, 160),
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author.name],
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await BlogService.getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-100/20 to-purple-100/20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <BlogPostDetail post={post} />
        <div className="mt-16">
          <RelatedPosts postId={post.id} />
        </div>
      </div>
    </div>
  );
}