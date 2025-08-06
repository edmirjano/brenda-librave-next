import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db/prisma';
import { authConfig } from '@/lib/auth/config';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get total translations
    const totalTranslations = await prisma.translation.count();

    // Get translations by language
    const translationsByLanguage = await prisma.translation.groupBy({
      by: ['language'],
      _count: {
        language: true
      }
    });

    // Get translations by entity type
    const translationsByEntity = await prisma.translation.groupBy({
      by: ['entityType'],
      _count: {
        entityType: true
      }
    });

    // Calculate missing translations
    // This is a simplified calculation - in practice you'd want more sophisticated logic
    const supportedLanguages = ['sq', 'en'];
    const uniqueKeys = await prisma.translation.findMany({
      select: {
        entityType: true,
        entityId: true,
        key: true,
        namespace: true
      },
      distinct: ['entityType', 'entityId', 'key', 'namespace']
    });

    const expectedTranslations = uniqueKeys.length * supportedLanguages.length;
    const missingTranslations = Math.max(0, expectedTranslations - totalTranslations);

    // Format the results
    const languageStats = translationsByLanguage.reduce((acc, item) => {
      acc[item.language] = item._count.language;
      return acc;
    }, {} as Record<string, number>);

    const entityStats = translationsByEntity.reduce((acc, item) => {
      acc[item.entityType] = item._count.entityType;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      totalTranslations,
      translationsByLanguage: languageStats,
      translationsByEntity: entityStats,
      missingTranslations,
      supportedLanguages,
      uniqueTranslationKeys: uniqueKeys.length
    });
  } catch (error) {
    console.error('Error fetching translation stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}