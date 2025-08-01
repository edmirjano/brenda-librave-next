import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { DEFAULT_EXCHANGE_RATE } from '@/lib/currency/config';

export async function GET() {
  try {
    // Try to get the current exchange rate from database
    const exchangeRate = await prisma.exchangeRate.findFirst({
      where: {
        fromCurrency: 'EUR',
        toCurrency: 'ALL',
        isActive: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    if (exchangeRate) {
      return NextResponse.json({
        rate: exchangeRate.rate,
        lastUpdated: exchangeRate.updatedAt
      });
    }

    // If no rate found in database, return default
    return NextResponse.json({
      rate: DEFAULT_EXCHANGE_RATE,
      lastUpdated: new Date(),
      isDefault: true
    });

  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    
    // Return default rate on error
    return NextResponse.json({
      rate: DEFAULT_EXCHANGE_RATE,
      lastUpdated: new Date(),
      isDefault: true
    });
  }
}

export async function POST(request: Request) {
  try {
    const { rate } = await request.json();
    
    if (!rate || typeof rate !== 'number' || rate <= 0) {
      return NextResponse.json(
        { error: 'Valid rate is required' },
        { status: 400 }
      );
    }

    // Deactivate old rates
    await prisma.exchangeRate.updateMany({
      where: {
        fromCurrency: 'EUR',
        toCurrency: 'ALL',
        isActive: true
      },
      data: {
        isActive: false
      }
    });

    // Create new rate
    const newRate = await prisma.exchangeRate.create({
      data: {
        fromCurrency: 'EUR',
        toCurrency: 'ALL',
        rate: rate,
        isActive: true
      }
    });

    return NextResponse.json({
      rate: newRate.rate,
      lastUpdated: newRate.updatedAt
    });

  } catch (error) {
    console.error('Error updating exchange rate:', error);
    return NextResponse.json(
      { error: 'Failed to update exchange rate' },
      { status: 500 }
    );
  }
}