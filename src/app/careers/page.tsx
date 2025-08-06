import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { CareersPageClient } from '@/components/pages/CareersPageClient';

export const metadata: Metadata = {
  title: 'Karriera | Brënda Librave',
  description: 'Bashkohuni me ekipin tonë dhe ndihmonani të ndërtojmë të ardhmen e librave në Shqipëri.',
};

export default async function CareersPage() {
  const t = await getTranslations('careers');
  
  return <CareersPageClient translations={t} />;
}