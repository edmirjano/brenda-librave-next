import { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { BlogPageClient } from '@/components/pages/BlogPageClient';

export const metadata: Metadata = {
  title: 'Blog | Brënda Librave',
  description:
    'Lexoni artikuj të fundit për libra, recension dhe përditësime nga bota e letërsisë shqiptare.',
};

interface BlogPageProps {
  searchParams: Promise<{
    kategoria?: string;
    etiketa?: string;
    autori?: string;
    data?: string;
    faqja?: string;
    kerkim?: string;
    renditi?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const t = await getTranslations('blog');

  return <BlogPageClient translations={t} searchParams={params} />;
}