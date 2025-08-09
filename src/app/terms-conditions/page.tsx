import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { TermsConditionsPageClient } from '@/components/pages/TermsConditionsPageClient';

export const metadata: Metadata = {
  title: 'Termat dhe Kushtet | Brënda Librave',
  description: 'Lexoni termat dhe kushtet e përdorimit të platformës Brënda Librave.',
};

export default async function TermsConditionsPage() {
  const t = await getTranslations('terms');
  
  return <TermsConditionsPageClient translations={t} />;
}