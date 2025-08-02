/*
  # Phase 7: Community Features & Forum System

  1. New Tables
    - `ForumCategory` - Categories for organizing forum discussions
    - `ForumTopic` - Discussion topics with book connections
    - `ForumPost` - Posts within topics with threading support
    - `ForumTag` - Tags for categorizing topics
    - `ForumTopicTag` - Many-to-many relationship for topic tags
    - `Wishlist` - User wishlists for books
    - `BookCollection` - User-created book collections
    - `BookCollectionItem` - Items within collections
    - `ReadingHistory` - Track user reading progress

  2. Security
    - User-owned content protection
    - Moderation capabilities for admins
    - Privacy controls for collections

  3. Features
    - Forum discussions with book connections
    - User wishlists and collections
    - Reading history tracking
    - Community engagement features
*/

-- CreateTable
CREATE TABLE "ForumCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "color" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ForumTopic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "bookId" TEXT,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ForumTopic_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ForumTopic_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ForumCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ForumTopic_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ForumPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "parentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ForumPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ForumPost_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "ForumTopic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ForumPost_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ForumPost" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ForumTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "color" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ForumTopicTag" (
    "topicId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    PRIMARY KEY ("topicId", "tagId"),
    CONSTRAINT "ForumTopicTag_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "ForumTopic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ForumTopicTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "ForumTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Wishlist_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BookCollection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BookCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BookCollectionItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "collectionId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    CONSTRAINT "BookCollectionItem_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "BookCollection" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BookCollectionItem_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReadingHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "rating" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ReadingHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReadingHistory_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ForumCategory_slug_key" ON "ForumCategory"("slug");

-- CreateIndex
CREATE INDEX "ForumCategory_active_sortOrder_idx" ON "ForumCategory"("active", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ForumTopic_slug_key" ON "ForumTopic"("slug");

-- CreateIndex
CREATE INDEX "ForumTopic_categoryId_idx" ON "ForumTopic"("categoryId");

-- CreateIndex
CREATE INDEX "ForumTopic_authorId_idx" ON "ForumTopic"("authorId");

-- CreateIndex
CREATE INDEX "ForumTopic_bookId_idx" ON "ForumTopic"("bookId");

-- CreateIndex
CREATE INDEX "ForumTopic_status_idx" ON "ForumTopic"("status");

-- CreateIndex
CREATE INDEX "ForumPost_topicId_idx" ON "ForumPost"("topicId");

-- CreateIndex
CREATE INDEX "ForumPost_authorId_idx" ON "ForumPost"("authorId");

-- CreateIndex
CREATE INDEX "ForumPost_status_idx" ON "ForumPost"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ForumTag_name_key" ON "ForumTag"("name");

-- CreateIndex
CREATE INDEX "ForumTopicTag_topicId_idx" ON "ForumTopicTag"("topicId");

-- CreateIndex
CREATE INDEX "ForumTopicTag_tagId_idx" ON "ForumTopicTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_userId_bookId_key" ON "Wishlist"("userId", "bookId");

-- CreateIndex
CREATE INDEX "Wishlist_userId_idx" ON "Wishlist"("userId");

-- CreateIndex
CREATE INDEX "BookCollection_userId_idx" ON "BookCollection"("userId");

-- CreateIndex
CREATE INDEX "BookCollection_isPublic_idx" ON "BookCollection"("isPublic");

-- CreateIndex
CREATE UNIQUE INDEX "BookCollectionItem_collectionId_bookId_key" ON "BookCollectionItem"("collectionId", "bookId");

-- CreateIndex
CREATE INDEX "BookCollectionItem_collectionId_idx" ON "BookCollectionItem"("collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingHistory_userId_bookId_key" ON "ReadingHistory"("userId", "bookId");

-- CreateIndex
CREATE INDEX "ReadingHistory_userId_idx" ON "ReadingHistory"("userId");