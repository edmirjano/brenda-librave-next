import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { PrivacyPolicyPageClient } from '@/components/pages/PrivacyPolicyPageClient';

export const metadata: Metadata = {
  title: 'Politika e Privatësisë | Brënda Librave',
  description:
    'Lexoni politikën tonë të privatësisë për të kuptuar se si i mbledhim, ruajmë dhe përdorim të dhënat tuaja personale.',
  keywords: [
    'politika privatësie',
    'mbrojtja e të dhënave',
    'GDPR',
    'siguria',
    'Brënda Librave',
    'privatësia',
  ],
  openGraph: {
    title: 'Politika e Privatësisë | Brënda Librave',
    description:
      'Lexoni politikën tonë të privatësisë për të kuptuar se si i mbledhim, ruajmë dhe përdorim të dhënat tuaja personale.',
    type: 'article',
    locale: 'sq_AL',
    url: 'https://brendalibrave.al/privacy-policy',
    siteName: 'Brënda Librave',
    publishedTime: '2024-01-01T00:00:00.000Z',
    modifiedTime: new Date().toISOString(),
    section: 'Legal',
    tags: ['Privacy Policy', 'GDPR', 'Data Protection'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Politika e Privatësisë | Brënda Librave',
    description:
      'Lexoni politikën tonë të privatësisë për të kuptuar se si i mbledhim, ruajmë dhe përdorim të dhënat tuaja personale.',
    creator: '@brendalibrave',
  },
  alternates: {
    canonical: 'https://brendalibrave.al/privacy-policy',
    languages: {
      'sq-AL': 'https://brendalibrave.al/privacy-policy',
      'en-US': 'https://brendalibrave.al/en/privacy-policy',
    },
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
    nocache: false,
  },
  other: {
    'article:section': 'Legal',
    'article:tag': 'Privacy Policy, GDPR, Legal',
    'date-updated': new Date().toISOString().split('T')[0],
  },
};

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('privacy');

  return <PrivacyPolicyPageClient translations={t} />;
}