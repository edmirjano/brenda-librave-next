-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ALL',
    "duration" INTEGER NOT NULL,
    "maxConcurrent" INTEGER NOT NULL DEFAULT 3,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "includesEbooks" BOOLEAN NOT NULL DEFAULT true,
    "includesHardcopy" BOOLEAN NOT NULL DEFAULT false,
    "unlimitedReads" BOOLEAN NOT NULL DEFAULT true,
    "prioritySupport" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SubscriptionBook" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscriptionId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SubscriptionBook_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SubscriptionBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserSubscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "autoRenew" BOOLEAN NOT NULL DEFAULT true,
    "paymentMethod" TEXT,
    "totalReads" INTEGER NOT NULL DEFAULT 0,
    "currentReads" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserSubscription_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SubscriptionAccessLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userSubscriptionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "accessType" TEXT NOT NULL,
    "sessionDuration" INTEGER,
    "deviceInfo" TEXT,
    "ipAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SubscriptionAccessLog_userSubscriptionId_fkey" FOREIGN KEY ("userSubscriptionId") REFERENCES "UserSubscription" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SubscriptionAccessLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SubscriptionAccessLog_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Subscription_isActive_idx" ON "Subscription"("isActive");

-- CreateIndex
CREATE INDEX "Subscription_featured_idx" ON "Subscription"("featured");

-- CreateIndex
CREATE INDEX "SubscriptionBook_subscriptionId_idx" ON "SubscriptionBook"("subscriptionId");

-- CreateIndex
CREATE INDEX "SubscriptionBook_bookId_idx" ON "SubscriptionBook"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionBook_subscriptionId_bookId_key" ON "SubscriptionBook"("subscriptionId", "bookId");

-- CreateIndex
CREATE INDEX "UserSubscription_userId_idx" ON "UserSubscription"("userId");

-- CreateIndex
CREATE INDEX "UserSubscription_subscriptionId_idx" ON "UserSubscription"("subscriptionId");

-- CreateIndex
CREATE INDEX "UserSubscription_isActive_idx" ON "UserSubscription"("isActive");

-- CreateIndex
CREATE INDEX "UserSubscription_endDate_idx" ON "UserSubscription"("endDate");

-- CreateIndex
CREATE INDEX "SubscriptionAccessLog_userSubscriptionId_idx" ON "SubscriptionAccessLog"("userSubscriptionId");

-- CreateIndex
CREATE INDEX "SubscriptionAccessLog_userId_idx" ON "SubscriptionAccessLog"("userId");

-- CreateIndex
CREATE INDEX "SubscriptionAccessLog_bookId_idx" ON "SubscriptionAccessLog"("bookId");

-- CreateIndex
CREATE INDEX "SubscriptionAccessLog_accessType_idx" ON "SubscriptionAccessLog"("accessType");
