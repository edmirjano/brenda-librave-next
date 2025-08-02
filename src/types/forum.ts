import { Prisma } from '@prisma/client';

// Forum types
export type ForumCategory = Prisma.ForumCategoryGetPayload<{
  include: {
    topics: {
      include: {
        author: {
          select: {
            id: true;
            name: true;
            image: true;
          };
        };
        _count: {
          select: {
            posts: true;
          };
        };
      };
    };
    _count: {
      select: {
        topics: true;
      };
    };
  };
}>;

export type ForumCategoryWithoutRelations = Prisma.ForumCategoryGetPayload<{}>;

export type ForumTopic = Prisma.ForumTopicGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        name: true;
        image: true;
      };
    };
    category: true;
    book: {
      select: {
        id: true;
        title: true;
        author: true;
        slug: true;
      };
    };
    tags: {
      include: {
        tag: true;
      };
    };
    posts: {
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
    _count: {
      select: {
        posts: true;
      };
    };
  };
}>;

export type ForumTopicListItem = Prisma.ForumTopicGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        name: true;
        image: true;
      };
    };
    category: true;
    book: {
      select: {
        id: true;
        title: true;
        author: true;
        slug: true;
      };
    };
    tags: {
      include: {
        tag: true;
      };
    };
    _count: {
      select: {
        posts: true;
      };
    };
  };
}>;

export type ForumPost = Prisma.ForumPostGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        name: true;
        image: true;
      };
    };
    topic: true;
    parent: {
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

export type ForumTag = Prisma.ForumTagGetPayload<{
  include: {
    topics: {
      include: {
        topic: true;
      };
    };
    _count: {
      select: {
        topics: true;
      };
    };
  };
}>;

// Wishlist and Collections
export type Wishlist = Prisma.WishlistGetPayload<{
  include: {
    book: {
      include: {
        category: true;
      };
    };
  };
}>;

export type BookCollection = Prisma.BookCollectionGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        image: true;
      };
    };
    books: {
      include: {
        book: {
          include: {
            category: true;
          };
        };
      };
    };
    _count: {
      select: {
        books: true;
      };
    };
  };
}>;

export type ReadingHistory = Prisma.ReadingHistoryGetPayload<{
  include: {
    book: {
      include: {
        category: true;
      };
    };
  };
}>;

// Form input types
export interface CreateForumTopicInput {
  title: string;
  content: string;
  categoryId: string;
  bookId?: string;
  tagIds?: string[];
}

export interface UpdateForumTopicInput extends Partial<CreateForumTopicInput> {
  id: string;
}

export interface CreateForumPostInput {
  content: string;
  topicId: string;
  parentId?: string;
}

export interface UpdateForumPostInput {
  id: string;
  content?: string;
  status?: 'ACTIVE' | 'HIDDEN' | 'DELETED' | 'FLAGGED';
}

export interface CreateForumCategoryInput {
  name: string;
  nameEn?: string;
  description?: string;
  slug?: string;
  color?: string;
  sortOrder?: number;
  active?: boolean;
}

export interface AddToWishlistInput {
  bookId: string;
  priority?: number;
  notes?: string;
}

export interface CreateCollectionInput {
  name: string;
  description?: string;
  isPublic?: boolean;
}

export interface AddToCollectionInput {
  collectionId: string;
  bookId: string;
  notes?: string;
}

// Search and filter types
export interface ForumSearchParams {
  query?: string;
  categoryId?: string;
  tags?: string[];
  bookId?: string;
  authorId?: string;
  status?: 'ACTIVE' | 'LOCKED' | 'HIDDEN' | 'DELETED';
  pinned?: boolean;
  sortBy?: 'title' | 'createdAt' | 'views' | 'posts';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ForumSearchResult {
  topics: ForumTopicListItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Statistics
export interface ForumStats {
  totalTopics: number;
  totalPosts: number;
  totalCategories: number;
  activeUsers: number;
  topCategories: Array<{
    id: string;
    name: string;
    topicCount: number;
  }>;
  recentActivity: Array<{
    type: 'topic' | 'post';
    title: string;
    author: string;
    createdAt: string;
  }>;
}