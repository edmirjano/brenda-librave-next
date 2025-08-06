import { NextRequest, NextResponse } from 'next/server';
import { Currency } from '@prisma/client';
import { CurrencyService } from '@/lib/services/currency';
import { z } from 'zod';

const convertRequestSchema = z.object({
  amount: z.number().min(0),
  baseCurrency: z.nativeEnum(Currency)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, baseCurrency } = convertRequestSchema.parse(body);

    const formattedPrices = await CurrencyService.getFormattedPrices(amount, baseCurrency);

    return NextResponse.json(formattedPrices);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error converting currency:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
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