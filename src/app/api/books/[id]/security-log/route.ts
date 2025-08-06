import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookId = params.id;
    const { rentalId, securityToken, eventType, details, timestamp } = await request.json();

    // Validate required fields
    if (!rentalId || !securityToken || !eventType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify the rental belongs to the user
    const rental = await prisma.ebookRental.findFirst({
      where: {
        id: rentalId,
        securityToken: securityToken,
        userId: session.user.id,
        bookId: bookId,
        isActive: true
      }
    });

    if (!rental) {
      return NextResponse.json({ error: 'Invalid rental or security token' }, { status: 403 });
    }

    // Determine access type based on event type
    let accessType: 'SECURITY_VIOLATION' | 'SUSPICIOUS_ACTIVITY' | 'RENTAL_END';
    let suspiciousActivity = false;

    switch (eventType) {
      case 'security_violation':
        accessType = 'SECURITY_VIOLATION';
        suspiciousActivity = true;
        break;
      case 'suspicious_activity':
        accessType = 'SUSPICIOUS_ACTIVITY';
        suspiciousActivity = true;
        break;
      case 'rental_end':
        accessType = 'RENTAL_END';
        suspiciousActivity = false;
        break;
      default:
        accessType = 'SUSPICIOUS_ACTIVITY';
        suspiciousActivity = true;
    }

    // Log the security event
    const securityLog = await prisma.ebookAccessLog.create({
      data: {
        rentalId: rental.id,
        userId: session.user.id,
        bookId: bookId,
        accessType,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        sessionId: session.user.id,
        deviceFingerprint: request.headers.get('sec-ch-ua') || 'unknown',
        suspiciousActivity,
        securityFlags: JSON.stringify({
          eventType,
          details,
          timestamp,
          userAgent: request.headers.get('user-agent'),
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          referer: request.headers.get('referer'),
          origin: request.headers.get('origin')
        })
      }
    });

    // If it's a security violation, update the rental status
    if (suspiciousActivity) {
      await prisma.ebookRental.update({
        where: { id: rentalId },
        data: {
          isActive: false // Deactivate rental on security violation
        }
      });
    }

    // If it's a rental end, update the rental status
    if (eventType === 'rental_end') {
      await prisma.ebookRental.update({
        where: { id: rentalId },
        data: {
          isActive: false,
          endDate: new Date() // Force end the rental
        }
      });
    }

    return NextResponse.json({
      success: true,
      logId: securityLog.id,
      eventType,
      suspiciousActivity
    });

  } catch (error) {
    console.error('Error logging security event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 