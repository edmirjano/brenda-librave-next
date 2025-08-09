import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ForumPageClient } from '@/components/pages/ForumPageClient';

export const metadata: Metadata = {
  title: 'Forumi Letrar | Brënda Librave',
  description:
    'Bashkohuni me komunitetin tonë të lexuesve për të diskutuar libra, ndarë opinione dhe gjetur rekomandime të reja.',
  keywords: [
    'forum shqip',
    'diskutime letrare',
    'komunitet lexuesish',
    'rekomandime librash',
    'literatura shqiptare',
  ],
  openGraph: {
    title: 'Forumi Letrar | Brënda Librave',
    description:
      'Bashkohuni me komunitetin tonë të lexuesve për të diskutuar libra, ndarë opinione dhe gjetur rekomandime të reja.',
    type: 'website',
    locale: 'sq_AL',
    url: 'https://brendalibrave.al/forum',
    siteName: 'Brënda Librave',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forumi Letrar | Brënda Librave',
    description:
      'Bashkohuni me komunitetin tonë të lexuesve për të diskutuar libra, ndarë opinione dhe gjetur rekomandime të reja.',
    creator: '@brendalibrave',
  },
  alternates: {
    canonical: 'https://brendalibrave.al/forum',
    languages: {
      'sq-AL': 'https://brendalibrave.al/forum',
      'en-US': 'https://brendalibrave.al/en/forum',
    },
  },
};

interface ForumPageProps {
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

export default async function ForumPage({ searchParams }: ForumPageProps) {
  const params = await searchParams;
  const t = await getTranslations('forum');

  return <ForumPageClient translations={t} searchParams={params} />;
}
