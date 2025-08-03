import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth/config';
import { recommendationEngine } from '@/lib/ai/recommendation-engine';
import { logError, logInfo } from '@/lib/logging/logger';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || session.user.id;
    const model = searchParams.get('model') || 'hybrid';
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 8;
    const includeExplanations = searchParams.get('explanations') !== 'false';

    // Validate parameters
    if (limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 50' },
        { status: 400 }
      );
    }

    // Only allow users to get their own recommendations (unless admin)
    if (userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Generate recommendations based on model type
    let recommendations;
    
    switch (model) {
      case 'content':
        recommendations = await recommendationEngine.generateRecommendations(userId, {
          limit,
          includeExplanations,
          diversityFactor: 0.1, // Less diversity for content-based
        });
        break;
      
      case 'collaborative':
        recommendations = await recommendationEngine.generateRecommendations(userId, {
          limit,
          includeExplanations,
          diversityFactor: 0.5, // More diversity for collaborative
        });
        break;
      
      case 'trending':
        recommendations = await recommendationEngine.generateRecommendations(userId, {
          limit,
          includeExplanations,
          freshnessFactor: 0.8, // Emphasize newer books
        });
        break;
      
      case 'hybrid':
      default:
        recommendations = await recommendationEngine.generateRecommendations(userId, {
          limit,
          includeExplanations,
          diversityFactor: 0.3,
          freshnessFactor: 0.2,
        });
        break;
    }

    logInfo('AI recommendations generated', {
      userId,
      model,
      recommendationCount: recommendations.length,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: recommendations,
      metadata: {
        model,
        userId,
        generatedAt: new Date().toISOString(),
        count: recommendations.length,
      },
    });
  } catch (error) {
    logError('Error in AI recommendations API', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate recommendations',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { feedback } = body;

    if (!feedback || !Array.isArray(feedback)) {
      return NextResponse.json(
        { error: 'Feedback array is required' },
        { status: 400 }
      );
    }

    // Process recommendation feedback to improve AI models
    // This would update the neural networks based on user interactions
    
    logInfo('Recommendation feedback received', {
      userId: session.user.id,
      feedbackCount: feedback.length,
    });

    // For now, just acknowledge the feedback
    // In a full implementation, this would retrain the models
    
    return NextResponse.json({
      success: true,
      message: 'Feedback processed successfully',
    });
  } catch (error) {
    logError('Error processing recommendation feedback', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process feedback',
      },
      { status: 500 }
    );
  }
}