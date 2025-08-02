import { Prisma } from '@prisma/client';

// Base types from Prisma
export type Book = Prisma.BookGetPayload<{
  include: {
    category: true;
    tags: {
      include: {
        tag: true;
      };
    };
  };
}>;

export type Category = Prisma.CategoryGetPayload<{
  include: {
    books: true;
  };
}>;

export type Tag = Prisma.TagGetPayload<{
  include: {
    books: {
      include: {
        book: true;
      };
    };
  };
}>;

export type BookWithoutRelations = Prisma.BookGetPayload<{}>;
export type CategoryWithoutRelations = Prisma.CategoryGetPayload<{}>;
export type TagWithoutRelations = Prisma.TagGetPayload<{}>;

// Book listing and search types
export type BookListItem = Prisma.BookGetPayload<{
  include: {
    category: true;
    tags: {
      include: {
        tag: true;
      };
    };
  };
}>;

export type BookDetailView = Prisma.BookGetPayload<{
  include: {
    category: true;
    tags: {
      include: {
        tag: true;
      };
    };
  };
}>;

// Search and filter types
export interface BookSearchParams {
  query?: string;
  categoryId?: string;
  tags?: string[];
  language?: 'SQ' | 'EN';
  minPrice?: number;
  maxPrice?: number;
  currency?: 'ALL' | 'EUR';
  featured?: boolean;
  active?: boolean;
  sortBy?: 'title' | 'author' | 'price' | 'featured' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface BookSearchResult {
  books: BookListItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Form types for creating/editing books
export interface CreateBookInput {
  title: string;
  author: string;
  description: string;
  isbn?: string;
  categoryId: string;
  priceALL?: number;
  priceEUR?: number;
  digitalPriceALL?: number;
  digitalPriceEUR?: number;
  inventory: number;
  hasDigital: boolean;
  coverImage?: string;
  publishedDate?: Date;
  language: 'SQ' | 'EN';
  featured: boolean;
  active: boolean;
  slug?: string;
  tagIds?: string[];
}

export interface UpdateBookInput extends Partial<CreateBookInput> {
  id: string;
}

// Category form types
export interface CreateCategoryInput {
  name: string;
  nameEn?: string;
  slug?: string;
  description?: string;
  active: boolean;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: string;
}

// Tag form types
export interface CreateTagInput {
  name: string;
  nameEn?: string;
  slug?: string;
  color?: string;
}

export interface UpdateTagInput extends Partial<CreateTagInput> {
  id: string;
}

// API response types
export interface BookApiResponse {
  success: boolean;
  data?: BookDetailView;
  error?: string;
}

export interface BooksApiResponse {
  success: boolean;
  data?: BookSearchResult;
  error?: string;
}

export interface CategoryApiResponse {
  success: boolean;
  data?: Category;
  error?: string;
}

export interface CategoriesApiResponse {
  success: boolean;
  data?: CategoryWithoutRelations[];
  error?: string;
}

// Admin dashboard types
export interface BookStats {
  totalBooks: number;
  activeBooks: number;
  featuredBooks: number;
  booksWithDigital: number;
  categoriesCount: number;
  tagsCount: number;
}

// Book validation types
export interface BookValidationError {
  field: string;
  message: string;
}

export interface BookValidationResult {
  isValid: boolean;
  errors: BookValidationError[];
}

// Filter options for UI
export interface BookFilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface BookFilters {
  categories: BookFilterOption[];
  tags: BookFilterOption[];
  languages: BookFilterOption[];
  priceRanges: BookFilterOption[];
}

// Price-related types
export interface BookPrice {
  priceALL?: number;
  priceEUR?: number;
  digitalPriceALL?: number;
  digitalPriceEUR?: number;
}

export interface FormattedBookPrice {
  physical: {
    primary: string;
    secondary: string;
  };
  digital?: {
    primary: string;
    secondary: string;
  };
}

// Pagination helpers
export interface PaginationOptions {
  page: number;
  limit: number;
  offset: number;
}
