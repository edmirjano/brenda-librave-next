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
    const { 
      rentalId,
      returnCondition,
      conditionNotes,
      returnTracking,
      isDamaged,
      damageNotes
    } = await request.json();

    // Validate return condition
    const validConditions = ['EXCELLENT', 'VERY_GOOD', 'GOOD', 'FAIR', 'POOR', 'DAMAGED'];
    if (!validConditions.includes(returnCondition)) {
      return NextResponse.json({ error: 'Invalid return condition' }, { status: 400 });
    }

    // Check if rental exists and belongs to user
    const rental = await prisma.hardcopyRental.findFirst({
      where: {
        id: rentalId,
        userId: session.user.id,
        bookId: bookId,
        isActive: true,
        isReturned: false
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            price: true
          }
        }
      }
    });

    if (!rental) {
      return NextResponse.json({ 
        error: 'Rental not found or already returned' 
      }, { status: 404 });
    }

    // Calculate refund amount based on condition
    let refundAmount = rental.guaranteeAmount;
    let damageDeduction = 0;

    switch (returnCondition) {
      case 'EXCELLENT':
        // Full refund
        refundAmount = rental.guaranteeAmount;
        break;
      case 'VERY_GOOD':
        // 95% refund
        damageDeduction = rental.guaranteeAmount * 0.05;
        refundAmount = rental.guaranteeAmount - damageDeduction;
        break;
      case 'GOOD':
        // 90% refund
        damageDeduction = rental.guaranteeAmount * 0.10;
        refundAmount = rental.guaranteeAmount - damageDeduction;
        break;
      case 'FAIR':
        // 75% refund
        damageDeduction = rental.guaranteeAmount * 0.25;
        refundAmount = rental.guaranteeAmount - damageDeduction;
        break;
      case 'POOR':
        // 50% refund
        damageDeduction = rental.guaranteeAmount * 0.50;
        refundAmount = rental.guaranteeAmount - damageDeduction;
        break;
      case 'DAMAGED':
        // No refund or minimal refund
        damageDeduction = rental.guaranteeAmount * 0.90;
        refundAmount = rental.guaranteeAmount - damageDeduction;
        break;
      default:
        refundAmount = rental.guaranteeAmount;
    }

    // Check if rental is late
    const now = new Date();
    const isLate = now > rental.endDate;
    let lateFee = 0;

    if (isLate) {
      const daysLate = Math.ceil((now.getTime() - rental.endDate.getTime()) / (1000 * 60 * 60 * 24));
      lateFee = daysLate * (rental.rentalPrice * 0.1); // 10% of rental price per day
      refundAmount = Math.max(0, refundAmount - lateFee);
    }

    // Update the rental
    const updatedRental = await prisma.hardcopyRental.update({
      where: { id: rentalId },
      data: {
        isReturned: true,
        returnDate: now,
        returnCondition: returnCondition as any,
        conditionNotes,
        returnTracking,
        isDamaged: isDamaged || returnCondition === 'DAMAGED',
        damageNotes,
        guaranteeRefunded: true,
        refundAmount,
        isActive: false
      }
    });

    // Log the return
    await prisma.hardcopyRentalLog.create({
      data: {
        rentalId: rental.id,
        userId: session.user.id,
        bookId: bookId,
        logType: 'BOOK_RETURNED',
        description: `Book returned in ${returnCondition} condition`,
        amount: 0,
        currency: rental.currency
      }
    });

    // Log damage assessment if applicable
    if (damageDeduction > 0) {
      await prisma.hardcopyRentalLog.create({
        data: {
          rentalId: rental.id,
          userId: session.user.id,
          bookId: bookId,
          logType: 'DAMAGE_ASSESSED',
          description: `Damage deduction: ${damageDeduction} ${rental.currency}`,
          amount: damageDeduction,
          currency: rental.currency
        }
      });
    }

    // Log late fee if applicable
    if (lateFee > 0) {
      await prisma.hardcopyRentalLog.create({
        data: {
          rentalId: rental.id,
          userId: session.user.id,
          bookId: bookId,
          logType: 'LATE_FEE_CHARGED',
          description: `Late fee: ${lateFee} ${rental.currency}`,
          amount: lateFee,
          currency: rental.currency
        }
      });
    }

    // Log guarantee refund
    await prisma.hardcopyRentalLog.create({
      data: {
        rentalId: rental.id,
        userId: session.user.id,
        bookId: bookId,
        logType: 'GUARANTEE_REFUNDED',
        description: `Guarantee refunded: ${refundAmount} ${rental.currency}`,
        amount: refundAmount,
        currency: rental.currency
      }
    });

    // Log rental completion
    await prisma.hardcopyRentalLog.create({
      data: {
        rentalId: rental.id,
        userId: session.user.id,
        bookId: bookId,
        logType: 'RENTAL_COMPLETED',
        description: 'Hardcopy rental completed',
        amount: 0,
        currency: rental.currency
      }
    });

    // Update book inventory (return one copy)
    await prisma.book.update({
      where: { id: bookId },
      data: {
        inventory: {
          increment: 1
        }
      }
    });

    return NextResponse.json({
      rentalId: rental.id,
      bookId: rental.book.id,
      title: rental.book.title,
      returnDate: updatedRental.returnDate,
      returnCondition: updatedRental.returnCondition,
      isDamaged: updatedRental.isDamaged,
      damageDeduction,
      lateFee,
      refundAmount: updatedRental.refundAmount,
      guaranteeAmount: rental.guaranteeAmount,
      currency: rental.currency,
      isLate,
      success: true
    });

  } catch (error) {
    console.error('Error processing hardcopy rental return:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 