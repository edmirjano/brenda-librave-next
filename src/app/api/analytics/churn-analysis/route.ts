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

    const churnAnalysis = await BusinessIntelligence.analyzeChurnRisk();

    logInfo('Churn analysis completed', {
      adminId: session.user.id,
      atRiskCustomers: churnAnalysis.filter(c => c.churnRisk === 'high').length,
      totalAnalyzed: churnAnalysis.length,
    });

    return NextResponse.json({
      success: true,
      data: churnAnalysis,
      metadata: {
        generatedAt: new Date().toISOString(),
        adminId: session.user.id,
        summary: {
          highRisk: churnAnalysis.filter(c => c.churnRisk === 'high').length,
          mediumRisk: churnAnalysis.filter(c => c.churnRisk === 'medium').length,
          totalAnalyzed: churnAnalysis.length,
        },
      },
    });
  } catch (error) {
    logError('Error in churn analysis API', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze churn risk',
      },
      { status: 500 }
    );
  }
}