import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ContactPageClient } from '@/components/pages/ContactPageClient';

export const metadata: Metadata = {
  title: 'Na Kontaktoni | Brënda Librave',
  description:
    'Na kontaktoni për çdo pyetje apo sugjerim. Jemi këtu për t\'ju ndihmuar me kënaqësi.',
  openGraph: {
    title: 'Na Kontaktoni | Brënda Librave',
    description:
      'Na kontaktoni për çdo pyetje apo sugjerim. Jemi këtu për t\'ju ndihmuar me kënaqësi.',
    type: 'website',
    locale: 'sq_AL',
    url: 'https://brendalibrave.al/contact',
    siteName: 'Brënda Librave',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Na Kontaktoni | Brënda Librave',
    description:
      'Na kontaktoni për çdo pyetje apo sugjerim. Jemi këtu për t\'ju ndihmuar me kënaqësi.',
    creator: '@brendalibrave',
  },
  alternates: {
    canonical: 'https://brendalibrave.al/contact',
    languages: {
      'sq-AL': 'https://brendalibrave.al/contact',
      'en-US': 'https://brendalibrave.al/en/contact',
    },
  },
};

export default async function ContactPage() {
  const t = await getTranslations('contact');
  
  return <ContactPageClient translations={t} />;
}
