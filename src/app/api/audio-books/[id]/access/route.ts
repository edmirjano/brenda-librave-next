import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { AudioBookService } from '@/lib/services/audio-books';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const audioBookId = params.id;
    const access = await AudioBookService.checkAudioBookAccess(session.user.id, audioBookId);

    return NextResponse.json({
      audioBookId,
      hasAccess: access.hasAccess,
      userRental: access.userRental,
      userSubscription: access.userSubscription,
      availableAudioBooks: access.availableAudioBooks,
      currentListens: access.currentListens,
      maxConcurrent: access.maxConcurrent,
      canListenMore: access.canListenMore
    });

  } catch (error) {
    console.error('Error checking audio book access:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const audioBookId = params.id;
    const { action, playTime } = await request.json();

    switch (action) {
      case 'start':
        const success = await AudioBookService.startListening(session.user.id, audioBookId);
        
        if (!success) {
          return NextResponse.json({ 
            error: 'Cannot start listening. Check your rental or subscription access.' 
          }, { status: 400 });
        }

        return NextResponse.json({
          success: true,
          message: 'Started listening to audio book'
        });

      case 'update_playtime':
        if (typeof playTime !== 'number') {
          return NextResponse.json({ error: 'Play time must be a number' }, { status: 400 });
        }

        await AudioBookService.updatePlayTime(session.user.id, audioBookId, playTime);
        
        return NextResponse.json({
          success: true,
          message: 'Updated play time'
        });

      case 'complete':
        await AudioBookService.completeListening(session.user.id, audioBookId);
        
        return NextResponse.json({
          success: true,
          message: 'Marked audio book as completed'
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error managing audio book access:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 