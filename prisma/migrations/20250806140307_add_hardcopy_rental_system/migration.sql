-- CreateTable
CREATE TABLE "HardcopyRental" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "rentalType" TEXT NOT NULL,
    "rentalPrice" REAL NOT NULL,
    "guaranteeAmount" REAL NOT NULL,
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
    "initialCondition" TEXT NOT NULL DEFAULT 'EXCELLENT',
    "returnCondition" TEXT,
    "conditionNotes" TEXT,
    "shippingAddress" TEXT NOT NULL,
    "trackingNumber" TEXT,
    "returnTracking" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HardcopyRental_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "HardcopyRental_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "HardcopyRental_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HardcopyRentalLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rentalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "logType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" REAL,
    "currency" TEXT NOT NULL DEFAULT 'ALL',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "HardcopyRentalLog_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "HardcopyRental" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "HardcopyRentalLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "HardcopyRentalLog_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "HardcopyRental_userId_idx" ON "HardcopyRental"("userId");

-- CreateIndex
CREATE INDEX "HardcopyRental_bookId_idx" ON "HardcopyRental"("bookId");

-- CreateIndex
CREATE INDEX "HardcopyRental_isActive_idx" ON "HardcopyRental"("isActive");

-- CreateIndex
CREATE INDEX "HardcopyRental_isReturned_idx" ON "HardcopyRental"("isReturned");

-- CreateIndex
CREATE INDEX "HardcopyRental_endDate_idx" ON "HardcopyRental"("endDate");

-- CreateIndex
CREATE INDEX "HardcopyRentalLog_rentalId_idx" ON "HardcopyRentalLog"("rentalId");

-- CreateIndex
CREATE INDEX "HardcopyRentalLog_userId_idx" ON "HardcopyRentalLog"("userId");

-- CreateIndex
CREATE INDEX "HardcopyRentalLog_bookId_idx" ON "HardcopyRentalLog"("bookId");

-- CreateIndex
CREATE INDEX "HardcopyRentalLog_logType_idx" ON "HardcopyRentalLog"("logType");
