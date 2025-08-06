-- CreateTable
CREATE TABLE "AudioBook" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "narrator" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "audioFileUrl" TEXT,
    "audioFileFormat" TEXT NOT NULL DEFAULT 'MP3',
    "sampleUrl" TEXT,
    "price" REAL,
    "digitalPrice" REAL,
    "baseCurrency" TEXT NOT NULL DEFAULT 'ALL',
    "inventory" INTEGER NOT NULL DEFAULT 0,
    "hasDigital" BOOLEAN NOT NULL DEFAULT true,
    "hasPhysical" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "language" TEXT NOT NULL DEFAULT 'SQ',
    "quality" TEXT NOT NULL DEFAULT 'STANDARD',
    "chapters" INTEGER,
    "chapterList" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AudioBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AudioBookRental" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "audioBookId" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "rentalType" TEXT NOT NULL,
    "rentalPrice" REAL NOT NULL,
    "guaranteeAmount" REAL,
    "currency" TEXT NOT NULL DEFAULT 'ALL',
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME NOT NULL,
    "returnDate" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isReturned" BOOLEAN NOT NULL DEFAULT false,
    "isDamaged" BOOLEAN NOT NULL DEFAULT false,
    "damageNotes" TEXT,
    "guaranteeRefunded" BOOLEAN NOT NULL DEFAULT false,
    "refundAmount" REAL,
    "totalPlayTime" INTEGER NOT NULL DEFAULT 0,
    "lastPlayedAt" DATETIME,
    "playCount" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "initialCondition" TEXT NOT NULL DEFAULT 'EXCELLENT',
    "returnCondition" TEXT,
    "conditionNotes" TEXT,
    "shippingAddress" TEXT,
    "trackingNumber" TEXT,
    "returnTracking" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AudioBookRental_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AudioBookRental_audioBookId_fkey" FOREIGN KEY ("audioBookId") REFERENCES "AudioBook" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AudioBookRental_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AudioBookAccessLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rentalId" TEXT,
    "userSubscriptionId" TEXT,
    "userId" TEXT NOT NULL,
    "audioBookId" TEXT NOT NULL,
    "accessType" TEXT NOT NULL,
    "playTime" INTEGER,
    "sessionDuration" INTEGER,
    "deviceInfo" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "suspiciousActivity" BOOLEAN NOT NULL DEFAULT false,
    "securityFlags" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AudioBookAccessLog_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "AudioBookRental" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AudioBookAccessLog_userSubscriptionId_fkey" FOREIGN KEY ("userSubscriptionId") REFERENCES "UserSubscription" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AudioBookAccessLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AudioBookAccessLog_audioBookId_fkey" FOREIGN KEY ("audioBookId") REFERENCES "AudioBook" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AudioBookSubscriptionBook" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscriptionId" TEXT NOT NULL,
    "audioBookId" TEXT NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AudioBookSubscriptionBook_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AudioBookSubscriptionBook_audioBookId_fkey" FOREIGN KEY ("audioBookId") REFERENCES "AudioBook" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "AudioBook_bookId_idx" ON "AudioBook"("bookId");

-- CreateIndex
CREATE INDEX "AudioBook_active_idx" ON "AudioBook"("active");

-- CreateIndex
CREATE INDEX "AudioBook_featured_idx" ON "AudioBook"("featured");

-- CreateIndex
CREATE INDEX "AudioBook_language_idx" ON "AudioBook"("language");

-- CreateIndex
CREATE INDEX "AudioBookRental_userId_idx" ON "AudioBookRental"("userId");

-- CreateIndex
CREATE INDEX "AudioBookRental_audioBookId_idx" ON "AudioBookRental"("audioBookId");

-- CreateIndex
CREATE INDEX "AudioBookRental_isActive_idx" ON "AudioBookRental"("isActive");

-- CreateIndex
CREATE INDEX "AudioBookRental_isReturned_idx" ON "AudioBookRental"("isReturned");

-- CreateIndex
CREATE INDEX "AudioBookRental_endDate_idx" ON "AudioBookRental"("endDate");

-- CreateIndex
CREATE INDEX "AudioBookAccessLog_rentalId_idx" ON "AudioBookAccessLog"("rentalId");

-- CreateIndex
CREATE INDEX "AudioBookAccessLog_userSubscriptionId_idx" ON "AudioBookAccessLog"("userSubscriptionId");

-- CreateIndex
CREATE INDEX "AudioBookAccessLog_userId_idx" ON "AudioBookAccessLog"("userId");

-- CreateIndex
CREATE INDEX "AudioBookAccessLog_audioBookId_idx" ON "AudioBookAccessLog"("audioBookId");

-- CreateIndex
CREATE INDEX "AudioBookAccessLog_accessType_idx" ON "AudioBookAccessLog"("accessType");

-- CreateIndex
CREATE INDEX "AudioBookAccessLog_suspiciousActivity_idx" ON "AudioBookAccessLog"("suspiciousActivity");

-- CreateIndex
CREATE INDEX "AudioBookSubscriptionBook_subscriptionId_idx" ON "AudioBookSubscriptionBook"("subscriptionId");

-- CreateIndex
CREATE INDEX "AudioBookSubscriptionBook_audioBookId_idx" ON "AudioBookSubscriptionBook"("audioBookId");

-- CreateIndex
CREATE UNIQUE INDEX "AudioBookSubscriptionBook_subscriptionId_audioBookId_key" ON "AudioBookSubscriptionBook"("subscriptionId", "audioBookId");
