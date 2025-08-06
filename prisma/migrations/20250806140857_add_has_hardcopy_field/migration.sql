-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "isbn" TEXT,
    "categoryId" TEXT NOT NULL,
    "price" REAL,
    "digitalPrice" REAL,
    "baseCurrency" TEXT NOT NULL DEFAULT 'ALL',
    "inventory" INTEGER NOT NULL DEFAULT 0,
    "hasDigital" BOOLEAN NOT NULL DEFAULT false,
    "hasHardcopy" BOOLEAN NOT NULL DEFAULT true,
    "digitalFileUrl" TEXT,
    "digitalFileSize" INTEGER,
    "coverImage" TEXT,
    "publishedDate" DATETIME,
    "baseLanguage" TEXT NOT NULL DEFAULT 'SQ',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Book_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Book" ("active", "baseCurrency", "baseLanguage", "categoryId", "coverImage", "createdAt", "digitalFileSize", "digitalFileUrl", "digitalPrice", "featured", "hasDigital", "id", "inventory", "isbn", "price", "publishedDate", "slug", "updatedAt") SELECT "active", "baseCurrency", "baseLanguage", "categoryId", "coverImage", "createdAt", "digitalFileSize", "digitalFileUrl", "digitalPrice", "featured", "hasDigital", "id", "inventory", "isbn", "price", "publishedDate", "slug", "updatedAt" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
CREATE UNIQUE INDEX "Book_slug_key" ON "Book"("slug");
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");
CREATE INDEX "Book_active_idx" ON "Book"("active");
CREATE INDEX "Book_featured_idx" ON "Book"("featured");
CREATE INDEX "Book_categoryId_idx" ON "Book"("categoryId");
CREATE INDEX "Book_slug_idx" ON "Book"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
