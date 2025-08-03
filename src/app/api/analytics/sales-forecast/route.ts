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
    const periods = searchParams.get('periods') ? Number(searchParams.get('periods')) : 6;

    // Validate periods
    if (periods < 1 || periods > 24) {
      return NextResponse.json(
        { error: 'Periods must be between 1 and 24' },
        { status: 400 }
      );
    }

    const forecast = await BusinessIntelligence.generateSalesForecast(periods);

    logInfo('Sales forecast generated', {
      adminId: session.user.id,
      periods,
      forecastCount: forecast.length,
    });

    return NextResponse.json({
      success: true,
      data: forecast,
      metadata: {
        periods,
        generatedAt: new Date().toISOString(),
        adminId: session.user.id,
      },
    });
  } catch (error) {
    logError('Error in sales forecast API', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate sales forecast',
      },
      { status: 500 }
    );
  }
}