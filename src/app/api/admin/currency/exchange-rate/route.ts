import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { CurrencyService } from '@/lib/services/currency';
import { z } from 'zod';

const updateExchangeRateSchema = z.object({
  rate: z.number().min(0.01).max(1000) // Reasonable limits for EUR to ALL
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const exchangeRateInfo = await CurrencyService.getExchangeRateInfo();
    return NextResponse.json(exchangeRateInfo);
  } catch (error) {
    console.error('Error getting exchange rate info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { rate } = updateExchangeRateSchema.parse(body);

    await CurrencyService.setExchangeRate(rate);

    const updatedInfo = await CurrencyService.getExchangeRateInfo();
    
    return NextResponse.json({
      success: true,
      message: 'Exchange rate updated successfully',
      exchangeRate: updatedInfo
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid exchange rate', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating exchange rate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}