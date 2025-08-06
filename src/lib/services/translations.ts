import { prisma } from '@/lib/db/prisma';
import type { Locale } from '@/lib/i18n/config';

export class TranslationService {
  // Get translated content for an entity
  static async getTranslations(
    entityType: string,
    entityId: string,
    language: Locale,
    fallbackLanguage: Locale = 'sq'
  ): Promise<Record<string, string>> {
    const translations = await prisma.translation.findMany({
      where: {
        entityType,
        entityId,
        language: { in: [language, fallbackLanguage] }
      }
    });

    // Organize by key with fallback logic
    const result: Record<string, string> = {};
    
    // First pass: set fallback values
    translations
      .filter(t => t.language === fallbackLanguage)
      .forEach(t => {
        result[t.key] = t.value;
      });
    
    // Second pass: override with preferred language
    translations
      .filter(t => t.language === language)
      .forEach(t => {
        result[t.key] = t.value;
      });

    return result;
  }

  // Create or update translation
  static async setTranslation(
    entityType: string,
    entityId: string,
    key: string,
    language: Locale,
    value: string,
    namespace?: string
  ) {
    return prisma.translation.upsert({
      where: {
        namespace_key_language_entityType_entityId: {
          namespace: namespace || entityType.toLowerCase(),
          key,
          language,
          entityType,
          entityId
        }
      },
      update: { value },
      create: {
        namespace: namespace || entityType.toLowerCase(),
        key,
        language,
        value,
        entityType,
        entityId
      }
    });
  }

  // Get all translations for an entity (for admin interface)
  static async getAllTranslations(entityType: string, entityId: string) {
    return prisma.translation.findMany({
      where: { entityType, entityId },
      orderBy: [{ language: 'asc' }, { key: 'asc' }]
    });
  }

  // Bulk create translations
  static async bulkCreateTranslations(translations: Array<{
    entityType: string;
    entityId: string;
    key: string;
    language: Locale;
    value: string;
    namespace?: string;
  }>) {
    return prisma.translation.createMany({
      data: translations.map(t => ({
        ...t,
        namespace: t.namespace || t.entityType.toLowerCase()
      })),
      skipDuplicates: true
    });
  }

  // Get missing translations for a language
  static async getMissingTranslations(
    entityType: string,
    fromLanguage: Locale,
    toLanguage: Locale
  ) {
    // Get all keys that exist in fromLanguage but not in toLanguage
    const fromTranslations = await prisma.translation.findMany({
      where: {
        entityType,
        language: fromLanguage
      },
      select: {
        entityId: true,
        key: true,
        namespace: true
      }
    });

    const toTranslations = await prisma.translation.findMany({
      where: {
        entityType,
        language: toLanguage,
        OR: fromTranslations.map(t => ({
          entityId: t.entityId,
          key: t.key,
          namespace: t.namespace
        }))
      },
      select: {
        entityId: true,
        key: true,
        namespace: true
      }
    });

    // Find missing translations
    const existingSet = new Set(
      toTranslations.map(t => `${t.entityId}-${t.key}-${t.namespace}`)
    );

    return fromTranslations.filter(
      t => !existingSet.has(`${t.entityId}-${t.key}-${t.namespace}`)
    );
  }

  // Initialize default language content as translations
  static async initializeFromDefaults(entityType: string, entityId: string) {
    // This method helps migrate existing content to the translation system
    switch (entityType) {
      case 'Book':
        await this.initializeBookTranslations(entityId);
        break;
      case 'Category':
        await this.initializeCategoryTranslations(entityId);
        break;
      case 'Tag':
        await this.initializeTagTranslations(entityId);
        break;
    }
  }

  private static async initializeBookTranslations(bookId: string) {
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    });

    if (book) {
      // For now, we'll assume the book has title, author, description in the old format
      // This is a migration helper - in the new system, these would be stored as translations
      const defaultTranslations = [
        { key: 'title', value: book.title || '' },
        { key: 'author', value: book.author || '' },
        { key: 'description', value: book.description || '' }
      ];

      await this.bulkCreateTranslations(
        defaultTranslations.map(t => ({
          entityType: 'Book',
          entityId: bookId,
          key: t.key,
          language: book.baseLanguage as Locale,
          value: t.value,
          namespace: 'book'
        }))
      );
    }
  }

  private static async initializeCategoryTranslations(categoryId: string) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (category) {
      // Migration from old name/nameEn format
      const translations = [
        { key: 'name', language: 'sq' as Locale, value: category.name || '' },
        // { key: 'name', language: 'en' as Locale, value: category.nameEn || category.name || '' }
      ];

      await this.bulkCreateTranslations(
        translations.map(t => ({
          entityType: 'Category',
          entityId: categoryId,
          key: t.key,
          language: t.language,
          value: t.value,
          namespace: 'category'
        }))
      );
    }
  }

  private static async initializeTagTranslations(tagId: string) {
    const tag = await prisma.tag.findUnique({
      where: { id: tagId }
    });

    if (tag) {
      // Migration from old name/nameEn format  
      const translations = [
        { key: 'name', language: 'sq' as Locale, value: tag.name || '' },
        // { key: 'name', language: 'en' as Locale, value: tag.nameEn || tag.name || '' }
      ];

      await this.bulkCreateTranslations(
        translations.map(t => ({
          entityType: 'Tag',
          entityId: tagId,
          key: t.key,
          language: t.language,
          value: t.value,
          namespace: 'tag'
        }))
      );
    }
  }
}