import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db/prisma';
import { TranslationService } from '@/lib/services/translations';
import { authConfig } from '@/lib/auth/config';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType');
    const language = searchParams.get('language');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};
    
    if (entityType && entityType !== 'all') {
      where.entityType = entityType;
    }
    
    if (language && language !== 'all') {
      where.language = language;
    }
    
    if (search) {
      where.OR = [
        { key: { contains: search, mode: 'insensitive' } },
        { value: { contains: search, mode: 'insensitive' } },
        { namespace: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [translations, total] = await Promise.all([
      prisma.translation.findMany({
        where,
        orderBy: [
          { entityType: 'asc' },
          { namespace: 'asc' },
          { key: 'asc' },
          { language: 'asc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.translation.count({ where })
    ]);

    return NextResponse.json({
      translations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { entityType, entityId, key, language, value, namespace, context } = data;

    if (!entityType || !entityId || !key || !language || !value) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const translation = await TranslationService.setTranslation(
      entityType,
      entityId,
      key,
      language,
      value,
      namespace
    );

    return NextResponse.json(translation, { status: 201 });
  } catch (error) {
    console.error('Error creating translation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}