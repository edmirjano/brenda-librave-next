import { Metadata } from 'next';

import { BusinessDashboard } from '@/components/analytics/BusinessDashboard';

export const metadata: Metadata = {
  title: 'Analytics & Business Intelligence | Admin',
  description: 'Analizë e thellë e performancës së biznesit dhe inteligjencë artificiale.',
};

export default function AdminAnalyticsPage() {
  return <BusinessDashboard />;
}