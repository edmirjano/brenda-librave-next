import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { FAQPageClient } from '@/components/pages/FAQPageClient';

export const metadata: Metadata = {
  title: 'Pyetje të Shpeshta | Brënda Librave',
  description:
    'Gjeni përgjigje për pyetjet më të shpeshta rreth shërbimeve tona, porosive, pagesave dhe më shumë.',
  keywords: [
    'FAQ shqip',
    'pyetje të shpeshta',
    'ndihmë',
    'mbështetje',
    'brënda librave',
    'libra online',
  ],
  openGraph: {
    title: 'Pyetje të Shpeshta | Brënda Librave',
    description:
      'Gjeni përgjigje për pyetjet më të shpeshta rreth shërbimeve tona, porosive, pagesave dhe më shumë.',
    type: 'website',
    locale: 'sq_AL',
    url: 'https://brendalibrave.al/faq',
    siteName: 'Brënda Librave',
    images: [
      {
        url: '/images/og/faq-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Pyetje të Shpeshta - Brënda Librave',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pyetje të Shpeshta | Brënda Librave',
    description:
      'Gjeni përgjigje për pyetjet më të shpeshta rreth shërbimeve tona, porosive, pagesave dhe më shumë.',
    images: ['/images/og/faq-og.jpg'],
    creator: '@brendalibrave',
  },
  alternates: {
    canonical: 'https://brendalibrave.al/faq',
    languages: {
      'sq-AL': 'https://brendalibrave.al/faq',
      'en-US': 'https://brendalibrave.al/en/faq',
    },
  },
  other: {
    'article:section': 'Help',
    'article:tag': 'FAQ, Help, Support',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Si mund të bëj një porosi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Për të bërë një porosi, zgjidhni librat që dëshironi, shtoni në shportë dhe ndiqni hapat e checkout-it.',
      },
    },
    {
      '@type': 'Question',
      name: 'Cilat janë metodat e pagesës?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pranojmë pagesa me karta krediti, PayPal, dhe transfer bankar.',
      },
    },
    {
      '@type': 'Question',
      name: 'Sa kohë merr dërgimi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dërgimi zakonisht merr 2-5 ditë pune për Tiranën dhe 3-7 ditë për qytetet e tjera.',
      },
    },
  ],
};

export default async function FAQPage() {
  const t = await getTranslations('faq');

  return <FAQPageClient translations={t} />;
}