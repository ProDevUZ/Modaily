/*
  Warnings:

  - You are about to drop the column `categoryIds` on the `Product` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sku" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameUz" TEXT NOT NULL,
    "nameRu" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "shortDescriptionUz" TEXT,
    "shortDescriptionRu" TEXT,
    "shortDescriptionEn" TEXT,
    "descriptionUz" TEXT,
    "descriptionRu" TEXT,
    "descriptionEn" TEXT,
    "featureUz" TEXT,
    "featureRu" TEXT,
    "featureEn" TEXT,
    "ingredientsUz" TEXT,
    "ingredientsRu" TEXT,
    "ingredientsEn" TEXT,
    "usageUz" TEXT,
    "usageRu" TEXT,
    "usageEn" TEXT,
    "storeImageUrl" TEXT,
    "storeLocationUz" TEXT,
    "storeLocationRu" TEXT,
    "storeLocationEn" TEXT,
    "storeContactsUz" TEXT,
    "storeContactsRu" TEXT,
    "storeContactsEn" TEXT,
    "skinTypes" TEXT,
    "size" TEXT,
    "price" INTEGER NOT NULL,
    "discountAmount" INTEGER NOT NULL DEFAULT 0,
    "hidePrice" BOOLEAN NOT NULL DEFAULT false,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "isBestseller" BOOLEAN NOT NULL DEFAULT false,
    "isHit" BOOLEAN NOT NULL DEFAULT false,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "homeSortOrder" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "colorFrom" TEXT,
    "colorTo" TEXT,
    "categoryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("active", "categoryId", "colorFrom", "colorTo", "createdAt", "descriptionEn", "descriptionRu", "descriptionUz", "discountAmount", "featureEn", "featureRu", "featureUz", "hidePrice", "homeSortOrder", "id", "imageUrl", "ingredientsEn", "ingredientsRu", "ingredientsUz", "isBestseller", "isHit", "isNew", "nameEn", "nameRu", "nameUz", "price", "shortDescriptionEn", "shortDescriptionRu", "shortDescriptionUz", "size", "skinTypes", "sku", "slug", "stock", "storeContactsEn", "storeContactsRu", "storeContactsUz", "storeImageUrl", "storeLocationEn", "storeLocationRu", "storeLocationUz", "updatedAt", "usageEn", "usageRu", "usageUz") SELECT "active", "categoryId", "colorFrom", "colorTo", "createdAt", "descriptionEn", "descriptionRu", "descriptionUz", "discountAmount", "featureEn", "featureRu", "featureUz", "hidePrice", "homeSortOrder", "id", "imageUrl", "ingredientsEn", "ingredientsRu", "ingredientsUz", "isBestseller", "isHit", "isNew", "nameEn", "nameRu", "nameUz", "price", "shortDescriptionEn", "shortDescriptionRu", "shortDescriptionUz", "size", "skinTypes", "sku", "slug", "stock", "storeContactsEn", "storeContactsRu", "storeContactsUz", "storeImageUrl", "storeLocationEn", "storeLocationRu", "storeLocationUz", "updatedAt", "usageEn", "usageRu", "usageUz" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE INDEX "Product_active_homeSortOrder_createdAt_idx" ON "Product"("active", "homeSortOrder", "createdAt");
CREATE INDEX "Product_active_isBestseller_homeSortOrder_createdAt_idx" ON "Product"("active", "isBestseller", "homeSortOrder", "createdAt");
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX "Product_createdAt_idx" ON "Product"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
