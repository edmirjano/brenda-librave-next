import { Prisma } from '@prisma/client';

// Blog post types
export type BlogPost = Prisma.BlogPostGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        name: true;
        email: true;
        image: true;
      };
    };
    category: true;
    moderatedBy: {
      select: {
        id: true;
        name: true;
      };
    };
    tags: {
      include: {
        tag: true;
      };
    };
    comments: {
      include: {
        author: {
          select: {
            id: true;
            name: true;
            image: true;
          };
        };
        replies: {
          include: {
            author: {
              select: {
                id: true;
                name: true;
                image: true;
              };
            };
          };
        };
      };
    };
    likes_relation: true;
    _count: {
      select: {
        comments: true;
        likes_relation: true;
      };
    };
  };
}>;

export type BlogPostListItem = Prisma.BlogPostGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        name: true;
        image: true;
      };
    };
    category: true;
    tags: {
      include: {
        tag: true;
      };
    };
    _count: {
      select: {
        comments: true;
        likes_relation: true;
      };
    };
  };
}>;

export type BlogPostWithoutRelations = Prisma.BlogPostGetPayload<{}>;

// Blog category types
export type BlogCategory = Prisma.BlogCategoryGetPayload<{
  include: {
    posts: true;
    _count: {
      select: {
        posts: true;
      };
    };
  };
}>;

export type BlogCategoryWithoutRelations = Prisma.BlogCategoryGetPayload<{}>;

// Blog tag types
export type BlogTag = Prisma.BlogTagGetPayload<{
  include: {
    posts: {
      include: {
        post: true;
      };
    };
    _count: {
      select: {
        posts: true;
      };
    };
  };
}>;

export type BlogTagWithoutRelations = Prisma.BlogTagGetPayload<{}>;

// Comment types
export type Comment = Prisma.CommentGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        name: true;
        image: true;
      };
    };
    post: true;
    parent: true;
    replies: {
      include: {
        author: {
          select: {
            id: true;
            name: true;
            image: true;
          };
        };
      };
    };
  };
}>;

export type CommentWithoutRelations = Prisma.CommentGetPayload<{}>;

// Form input types
export interface CreateBlogPostInput {
  title: string;
  content: string;
  excerpt?: string;
  categoryId?: string;
  featuredImage?: string;
  language: 'SQ' | 'EN';
  type: 'ADMIN' | 'USER' | 'FEATURED';
  published?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  tagIds?: string[];
}

export interface UpdateBlogPostInput extends Partial<CreateBlogPostInput> {
  id: string;
}

export interface CreateBlogCategoryInput {
  name: string;
  nameEn?: string;
  slug?: string;
  description?: string;
  active?: boolean;
}

export interface UpdateBlogCategoryInput extends Partial<CreateBlogCategoryInput> {
  id: string;
}

export interface CreateBlogTagInput {
  name: string;
  nameEn?: string;
}

export interface UpdateBlogTagInput extends Partial<CreateBlogTagInput> {
  id: string;
}

export interface CreateCommentInput {
  content: string;
  postId: string;
  parentId?: string;
}

export interface UpdateCommentInput {
  id: string;
  content?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SPAM';
}

// Search and filter types
export interface BlogSearchParams {
  query?: string;
  categoryId?: string;
  tags?: string[];
  language?: 'SQ' | 'EN';
  type?: 'ADMIN' | 'USER' | 'FEATURED';
  status?: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';
  authorId?: string;
  published?: boolean;
  sortBy?: 'title' | 'createdAt' | 'publishedAt' | 'views' | 'likes';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface BlogSearchResult {
  posts: BlogPostListItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// API response types
export interface BlogPostApiResponse {
  success: boolean;
  data?: BlogPost;
  error?: string;
}

export interface BlogPostsApiResponse {
  success: boolean;
  data?: BlogSearchResult;
  error?: string;
}

export interface BlogCategoriesApiResponse {
  success: boolean;
  data?: BlogCategoryWithoutRelations[];
  error?: string;
}

// Moderation types
export interface ModerationAction {
  postId: string;
  action: 'APPROVE' | 'REJECT' | 'FEATURE';
  rejectionReason?: string;
}

export interface ModerationStats {
  pendingPosts: number;
  approvedPosts: number;
  rejectedPosts: number;
  featuredPosts: number;
  totalUserPosts: number;
}

// Blog statistics
export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  userPosts: number;
  adminPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  categoriesCount: number;
  tagsCount: number;
}