import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { HelpPageClient } from '@/components/pages/HelpPageClient';

export const metadata: Metadata = {
  title: 'Ndihmë dhe Mbështetje | Brënda Librave',
  description:
    'Gjeni udhëzime dhe mbështetje për çdo pyetje që mund të keni rreth përdorimit të platformës sonë.',
  keywords: [
    'ndihmë shqip',
    'mbështetje',
    'udhëzime',
    'probleme teknike',
    'tutoriale',
    'Brënda Librave',
  ],
  openGraph: {
    title: 'Ndihmë dhe Mbështetje | Brënda Librave',
    description:
      'Gjeni udhëzime dhe mbështetje për çdo pyetje që mund të keni rreth përdorimit të platformës sonë.',
    type: 'website',
    locale: 'sq_AL',
    url: 'https://brendalibrave.al/help',
    siteName: 'Brënda Librave',
    images: [
      {
        url: '/images/og/help-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Ndihmë dhe Mbështetje - Brënda Librave',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ndihmë dhe Mbështetje | Brënda Librave',
    description:
      'Gjeni udhëzime dhe mbështetje për çdo pyetje që mund të keni rreth përdorimit të platformës sonë.',
    images: ['/images/og/help-og.jpg'],
    creator: '@brendalibrave',
  },
  alternates: {
    canonical: 'https://brendalibrave.al/help',
    languages: {
      'sq-AL': 'https://brendalibrave.al/help',
      'en-US': 'https://brendalibrave.al/en/help',
    },
  },
  other: {
    'article:section': 'Help',
    'article:tag': 'Help, Support, Tutorials',
  },
};

export default async function HelpPage() {
  const t = await getTranslations('help');

  return <HelpPageClient translations={t} />;
}