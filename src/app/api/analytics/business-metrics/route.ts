import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth/config';
import { BusinessIntelligence } from '@/lib/analytics/business-intelligence';
import { logError, logInfo } from '@/lib/logging/logger';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = (searchParams.get('range') as '7d' | '30d' | '90d' | '1y') || '30d';

    // Validate time range
    if (!['7d', '30d', '90d', '1y'].includes(range)) {
      return NextResponse.json(
        { error: 'Invalid time range. Must be one of: 7d, 30d, 90d, 1y' },
        { status: 400 }
      );
    }

    const metrics = await BusinessIntelligence.getBusinessMetrics(range);

    logInfo('Business metrics retrieved', {
      adminId: session.user.id,
      timeRange: range,
      revenue: metrics.revenue.total,
    });

    return NextResponse.json({
      success: true,
      data: metrics,
      metadata: {
        timeRange: range,
        generatedAt: new Date().toISOString(),
        adminId: session.user.id,
      },
    });
  } catch (error) {
    logError('Error in business metrics API', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch business metrics',
      },
      { status: 500 }
    );
  }
}