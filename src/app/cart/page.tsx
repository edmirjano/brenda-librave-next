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
          <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-100/20 to-purple-100/20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shporta{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              Juaj
            </span>
          </h1>
          <p className="text-xl text-gray-700">
            Shikoni dhe menaxhoni librat që dëshironi të blini
          </p>
        </div>

        {/* Cart Content */}
        <Suspense
          fallback={
            <GlassCard className="p-8">
              <div className="flex items-center justify-center">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-gray-700">Duke ngarkuar shportën...</span>
              </div>
            </GlassCard>
          }
        >
          <CartContent />
        </Suspense>
      </div>
    </div>
  );
}