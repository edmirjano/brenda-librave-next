import { getTranslations } from 'next-intl/server';
import { HomePageClient } from '@/components/pages/HomePageClient';

export default async function HomePage() {
  const t = await getTranslations('home');
  
  return <HomePageClient translations={t} />;
}