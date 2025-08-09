import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AboutPageClient } from '@/components/pages/AboutPageClient';

export const metadata: Metadata = {
  title: 'Rreth Nesh | Brënda Librave',
  description:
    'Mësoni më shumë për Brënda Librave, misionin tonë dhe ekipin që bën të mundur këtë platformë.',
};

export default async function AboutPage() {
  const t = await getTranslations('about');
  
  return <AboutPageClient translations={t} />;
}
