import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { CartPageClient } from '@/components/pages/CartPageClient';

import { authOptions } from '@/lib/auth/config';

export const metadata: Metadata = {
  title: 'Shporta | Brënda Librave',
  description: 'Shikoni dhe menaxhoni librat në shportën tuaj.',
  robots: {
    index: false,
    follow: true,
  },
};

export default async function CartPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login?callbackUrl=/cart');
  }

  const t = await getTranslations('cart');

  return <CartPageClient translations={t} />;
}