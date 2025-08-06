-- CreateTable
CREATE TABLE "TermsAndConditions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "effectiveDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UserTermsAcceptance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "termsId" TEXT NOT NULL,
    "acceptedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "sessionId" TEXT,
    "rentalType" TEXT,
    "hardcopyRentalType" TEXT,
    "audioBookRentalType" TEXT,
    "subscriptionType" TEXT,
    "readTime" INTEGER,
    "scrollDepth" INTEGER,
    "confirmedRead" BOOLEAN NOT NULL DEFAULT false,
    "confirmedUnderstand" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserTermsAcceptance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserTermsAcceptance_termsId_fkey" FOREIGN KEY ("termsId") REFERENCES "TermsAndConditions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "TermsAndConditions_type_idx" ON "TermsAndConditions"("type");

-- CreateIndex
CREATE INDEX "TermsAndConditions_isActive_idx" ON "TermsAndConditions"("isActive");

-- CreateIndex
CREATE INDEX "TermsAndConditions_effectiveDate_idx" ON "TermsAndConditions"("effectiveDate");

-- CreateIndex
CREATE INDEX "UserTermsAcceptance_userId_idx" ON "UserTermsAcceptance"("userId");

-- CreateIndex
CREATE INDEX "UserTermsAcceptance_termsId_idx" ON "UserTermsAcceptance"("termsId");

-- CreateIndex
CREATE INDEX "UserTermsAcceptance_acceptedAt_idx" ON "UserTermsAcceptance"("acceptedAt");

-- CreateIndex
CREATE INDEX "UserTermsAcceptance_rentalType_idx" ON "UserTermsAcceptance"("rentalType");

-- CreateIndex
CREATE INDEX "UserTermsAcceptance_hardcopyRentalType_idx" ON "UserTermsAcceptance"("hardcopyRentalType");

-- CreateIndex
CREATE INDEX "UserTermsAcceptance_audioBookRentalType_idx" ON "UserTermsAcceptance"("audioBookRentalType");
