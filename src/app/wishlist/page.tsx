import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { WishlistPageClient } from '@/components/pages/WishlistPageClient';

import { authOptions } from '@/lib/auth/config';

export const metadata: Metadata = {
  title: 'Lista e Dëshirave | Brënda Librave',
  description: 'Shikoni dhe menaxhoni librat që dëshironi të blini në të ardhmen.',
  robots: {
    index: false,
    follow: true,
  },
};

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login?callbackUrl=/wishlist');
  }

  const t = await getTranslations('wishlist');
  
  return <WishlistPageClient translations={t} />;
}