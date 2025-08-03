import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth/config';
import { BusinessIntelligence } from '@/lib/analytics/business-intelligence';
import { logError, logInfo } from '@/lib/logging/logger';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const segmentation = await BusinessIntelligence.getCustomerSegmentation();

    logInfo('Customer segmentation retrieved', {
      adminId: session.user.id,
      segmentCount: segmentation.length,
    });

    return NextResponse.json({
      success: true,
      data: segmentation,
      metadata: {
        generatedAt: new Date().toISOString(),
        adminId: session.user.id,
      },
    });
  } catch (error) {
    logError('Error in customer segmentation API', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch customer segmentation',
      },
      { status: 500 }
    );
  }
}