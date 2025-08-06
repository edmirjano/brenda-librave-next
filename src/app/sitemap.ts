import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db/prisma';
import { locales } from '@/lib/i18n/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://brenda-librave.netlify.app';
  const currentDate = new Date();
  
  // Static pages for each locale
  const staticPages: MetadataRoute.Sitemap = [];
  
  for (const locale of locales) {
    staticPages.push(
      // Homepage
      {
        url: `${baseUrl}/${locale}`,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 1,
        alternates: {
          languages: Object.fromEntries(
            locales.map(loc => [loc, `${baseUrl}/${loc}`])
          )
        }
      },
      // Books page
      {
        url: `${baseUrl}/${locale}/${locale === 'sq' ? 'libra' : 'books'}`,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 0.9,
        alternates: {
          languages: {
            'sq': `${baseUrl}/sq/libra`,
            'en': `${baseUrl}/en/books`
          }
        }
      },
      // Blog page
      {
        url: `${baseUrl}/${locale}/blog`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map(loc => [loc, `${baseUrl}/${loc}/blog`])
          )
        }
      },
      // Cart page
      {
        url: `${baseUrl}/${locale}/${locale === 'sq' ? 'shporte' : 'cart'}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: {
            'sq': `${baseUrl}/sq/shporte`,
            'en': `${baseUrl}/en/cart`
          }
        }
      },
      // About page
      {
        url: `${baseUrl}/${locale}/about`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.5
      },
      // Contact page
      {
        url: `${baseUrl}/${locale}/contact`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.5
      }
    );
  }

  // Dynamic book pages
  const books = await prisma.book.findMany({
    where: { active: true },
    select: {
      slug: true,
      updatedAt: true
    }
  });

  const bookPages: MetadataRoute.Sitemap = [];
  for (const book of books) {
    for (const locale of locales) {
      bookPages.push({
        url: `${baseUrl}/${locale}/${locale === 'sq' ? 'libra' : 'books'}/${book.slug}`,
        lastModified: book.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            'sq': `${baseUrl}/sq/libra/${book.slug}`,
            'en': `${baseUrl}/en/books/${book.slug}`
          }
        }
      });
    }
  }

  // Dynamic category pages
  const categories = await prisma.category.findMany({
    where: { active: true },
    select: {
      slug: true,
      updatedAt: true
    }
  });

  const categoryPages: MetadataRoute.Sitemap = [];
  for (const category of categories) {
    for (const locale of locales) {
      categoryPages.push({
        url: `${baseUrl}/${locale}/${locale === 'sq' ? 'libra' : 'books'}/category/${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: {
            'sq': `${baseUrl}/sq/libra/category/${category.slug}`,
            'en': `${baseUrl}/en/books/category/${category.slug}`
          }
        }
      });
    }
  }

  // Dynamic blog post pages (if blog posts exist)
  const blogPosts = await prisma.blogPost?.findMany({
    where: { published: true },
    select: {
      slug: true,
      updatedAt: true
    }
  }).catch(() => []); // In case BlogPost model doesn't exist yet

  const blogPages: MetadataRoute.Sitemap = [];
  if (blogPosts && Array.isArray(blogPosts)) {
    for (const post of blogPosts) {
      for (const locale of locales) {
        blogPages.push({
          url: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastModified: post.updatedAt,
          changeFrequency: 'monthly',
          priority: 0.6,
          alternates: {
            languages: Object.fromEntries(
              locales.map(loc => [loc, `${baseUrl}/${loc}/blog/${post.slug}`])
            )
          }
        });
      }
    }
  }

  return [
    ...staticPages,
    ...bookPages,
    ...categoryPages,
    ...blogPages
  ];
}