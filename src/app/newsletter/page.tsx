import { Metadata } from 'next';

import { NewsletterSignup } from '@/components/newsletter/NewsletterSignup';

export const metadata: Metadata = {
  title: 'Newsletter | Brënda Librave',
  description: 'Regjistrohuni në newsletter-in tonë për të marrë lajme të reja dhe oferta speciale.',
};

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-100/20 to-purple-100/20"></div>
      </div>

      <div className="relative max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <NewsletterSignup />
      </div>
    </div>
  );
}