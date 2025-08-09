import { getTranslations } from 'next-intl/server';
import { TypographyDemoPageClient } from '@/components/pages/TypographyDemoPageClient';

export default async function TypographyDemo() {
  const t = await getTranslations('typography');
  
  return <TypographyDemoPageClient translations={t} />;
}
