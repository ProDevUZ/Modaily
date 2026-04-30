-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cardTitle" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "publishDate" DATETIME NOT NULL,
    "category" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "linkedProductId" TEXT,
    "mainTitle" TEXT NOT NULL,
    "introDescription" TEXT NOT NULL,
    "seoTitle" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "cardTitleEn" TEXT,
    "cardTitleRu" TEXT,
    "cardTitleUz" TEXT,
    "categoryEn" TEXT,
    "categoryRu" TEXT,
    "categoryUz" TEXT,
    "excerptEn" TEXT,
    "excerptRu" TEXT,
    "excerptUz" TEXT,
    "introDescriptionEn" TEXT,
    "introDescriptionRu" TEXT,
    "introDescriptionUz" TEXT,
    "mainTitleEn" TEXT,
    "mainTitleRu" TEXT,
    "mainTitleUz" TEXT,
    FOREIGN KEY ("linkedProductId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BlogPostMedia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL DEFAULT 'IMAGE',
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "postId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("postId") REFERENCES "BlogPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BlogPostSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "postId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "descriptionEn" TEXT,
    "descriptionRu" TEXT,
    "descriptionUz" TEXT,
    "titleEn" TEXT,
    "titleRu" TEXT,
    "titleUz" TEXT,
    FOREIGN KEY ("postId") REFERENCES "BlogPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "nameUz" TEXT NOT NULL,
    "nameRu" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "descriptionUz" TEXT,
    "descriptionRu" TEXT,
    "descriptionEn" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CategoryToProduct" (
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,

    PRIMARY KEY ("productId", "categoryId"),
    FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GalleryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "titleUz" TEXT,
    "titleRu" TEXT,
    "titleEn" TEXT,
    "descriptionUz" TEXT,
    "descriptionRu" TEXT,
    "descriptionEn" TEXT,
    "imageUrl" TEXT NOT NULL,
    "videoUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GallerySectionHeading" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "textUz" TEXT,
    "textRu" TEXT,
    "textEn" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "HomeAboutSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titleUz" TEXT NOT NULL,
    "titleRu" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionUz" TEXT,
    "descriptionRu" TEXT,
    "descriptionEn" TEXT,
    "secondaryTitleUz" TEXT,
    "secondaryTitleRu" TEXT,
    "secondaryTitleEn" TEXT,
    "secondaryDescriptionUz" TEXT,
    "secondaryDescriptionRu" TEXT,
    "secondaryDescriptionEn" TEXT,
    "bottomDescriptionUz" TEXT,
    "bottomDescriptionRu" TEXT,
    "bottomDescriptionEn" TEXT,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "HomeHero" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "badgeUz" TEXT,
    "badgeRu" TEXT,
    "badgeEn" TEXT,
    "titleUz" TEXT NOT NULL,
    "titleRu" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionUz" TEXT,
    "descriptionRu" TEXT,
    "descriptionEn" TEXT,
    "primaryCtaUz" TEXT,
    "primaryCtaRu" TEXT,
    "primaryCtaEn" TEXT,
    "primaryCtaLink" TEXT,
    "secondaryCtaUz" TEXT,
    "secondaryCtaRu" TEXT,
    "secondaryCtaEn" TEXT,
    "secondaryCtaLink" TEXT,
    "imageUrl" TEXT,
    "heroProductId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "mobileImageUrl" TEXT,
    FOREIGN KEY ("heroProductId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HomePromoCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titleUz" TEXT NOT NULL,
    "titleRu" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionUz" TEXT,
    "descriptionRu" TEXT,
    "descriptionEn" TEXT,
    "buttonLabelUz" TEXT,
    "buttonLabelRu" TEXT,
    "buttonLabelEn" TEXT,
    "buttonLink" TEXT,
    "imageUrl" TEXT,
    "promoProductId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("promoProductId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Product" (
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
    "categoryIds" TEXT,
    FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductGalleryImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL DEFAULT 'IMAGE',
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "productId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductRecommendation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceProductId" TEXT NOT NULL,
    "recommendedProductId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("recommendedProductId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("sourceProductId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorName" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "productId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "imageUrl" TEXT,
    FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShopLocation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL,
    "mapLink" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ShopWorkingHour" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT,
    "value" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "shopLocationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("shopLocationId") REFERENCES "ShopLocation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brandName" TEXT NOT NULL DEFAULT 'Modaily',
    "hideCommerce" BOOLEAN NOT NULL DEFAULT false,
    "announcementTextUz" TEXT,
    "announcementTextRu" TEXT,
    "announcementTextEn" TEXT,
    "announcementLinkLabelUz" TEXT,
    "announcementLinkLabelRu" TEXT,
    "announcementLinkLabelEn" TEXT,
    "announcementLink" TEXT,
    "footerPhone" TEXT,
    "footerEmail" TEXT,
    "footerTelegram" TEXT,
    "footerTelegramLink" TEXT,
    "footerInstagram" TEXT,
    "footerInstagramLink" TEXT,
    "storeAddress" TEXT,
    "storeMapLink" TEXT,
    "footerAddressUz" TEXT,
    "footerAddressRu" TEXT,
    "footerAddressEn" TEXT,
    "newsletterTitleUz" TEXT,
    "newsletterTitleRu" TEXT,
    "newsletterTitleEn" TEXT,
    "newsletterPlaceholderUz" TEXT,
    "newsletterPlaceholderRu" TEXT,
    "newsletterPlaceholderEn" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "aboutBrandTitleEn" TEXT,
    "aboutBrandTitleRu" TEXT,
    "aboutBrandTitleUz" TEXT,
    "aboutDescriptionEn" TEXT,
    "aboutDescriptionRu" TEXT,
    "aboutDescriptionUz" TEXT,
    "aboutImageUrl" TEXT,
    "aboutPanelDescriptionEn" TEXT,
    "aboutPanelDescriptionRu" TEXT,
    "aboutPanelDescriptionUz" TEXT,
    "aboutPanelSecondaryDescriptionEn" TEXT,
    "aboutPanelSecondaryDescriptionRu" TEXT,
    "aboutPanelSecondaryDescriptionUz" TEXT,
    "aboutTitleEn" TEXT,
    "aboutTitleRu" TEXT,
    "aboutTitleUz" TEXT
);

-- CreateTable
CREATE TABLE "SkinTypeOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "nameUz" TEXT NOT NULL,
    "nameRu" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorName" TEXT NOT NULL,
    "authorRoleUz" TEXT,
    "authorRoleRu" TEXT,
    "authorRoleEn" TEXT,
    "productNameUz" TEXT,
    "productNameRu" TEXT,
    "productNameEn" TEXT,
    "bodyUz" TEXT NOT NULL,
    "bodyRu" TEXT NOT NULL,
    "bodyEn" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "city" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "BlogPost_linkedProductId_idx" ON "BlogPost"("linkedProductId" ASC);

-- CreateIndex
CREATE INDEX "BlogPost_featured_publishDate_idx" ON "BlogPost"("featured" ASC, "publishDate" DESC);

-- CreateIndex
CREATE INDEX "BlogPost_category_publishDate_idx" ON "BlogPost"("category" ASC, "publishDate" DESC);

-- CreateIndex
CREATE INDEX "BlogPost_publishDate_idx" ON "BlogPost"("publishDate" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug" ASC);

-- CreateIndex
CREATE INDEX "BlogPostMedia_postId_sortOrder_idx" ON "BlogPostMedia"("postId" ASC, "sortOrder" ASC);

-- CreateIndex
CREATE INDEX "BlogPostSection_postId_sortOrder_idx" ON "BlogPostSection"("postId" ASC, "sortOrder" ASC);

-- CreateIndex
CREATE INDEX "Category_createdAt_idx" ON "Category"("createdAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug" ASC);

-- CreateIndex
CREATE INDEX "CategoryToProduct_categoryId_sortOrder_idx" ON "CategoryToProduct"("categoryId" ASC, "sortOrder" ASC);

-- CreateIndex
CREATE INDEX "CategoryToProduct_productId_sortOrder_idx" ON "CategoryToProduct"("productId" ASC, "sortOrder" ASC);

-- CreateIndex
CREATE INDEX "ContactMessage_createdAt_idx" ON "ContactMessage"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "GalleryItem_active_type_sortOrder_createdAt_idx" ON "GalleryItem"("active" ASC, "type" ASC, "sortOrder" ASC, "createdAt" ASC);

-- CreateIndex
CREATE INDEX "GallerySectionHeading_active_type_sortOrder_createdAt_idx" ON "GallerySectionHeading"("active" ASC, "type" ASC, "sortOrder" ASC, "createdAt" ASC);

-- CreateIndex
CREATE INDEX "HomeHero_heroProductId_idx" ON "HomeHero"("heroProductId" ASC);

-- CreateIndex
CREATE INDEX "HomePromoCard_promoProductId_idx" ON "HomePromoCard"("promoProductId" ASC);

-- CreateIndex
CREATE INDEX "HomePromoCard_active_sortOrder_createdAt_idx" ON "HomePromoCard"("active" ASC, "sortOrder" ASC, "createdAt" ASC);

-- CreateIndex
CREATE INDEX "Product_createdAt_idx" ON "Product"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId" ASC);

-- CreateIndex
CREATE INDEX "Product_active_isBestseller_homeSortOrder_createdAt_idx" ON "Product"("active" ASC, "isBestseller" ASC, "homeSortOrder" ASC, "createdAt" ASC);

-- CreateIndex
CREATE INDEX "Product_active_homeSortOrder_createdAt_idx" ON "Product"("active" ASC, "homeSortOrder" ASC, "createdAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku" ASC);

-- CreateIndex
CREATE INDEX "ProductGalleryImage_productId_sortOrder_idx" ON "ProductGalleryImage"("productId" ASC, "sortOrder" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ProductRecommendation_sourceProductId_recommendedProductId_key" ON "ProductRecommendation"("sourceProductId" ASC, "recommendedProductId" ASC);

-- CreateIndex
CREATE INDEX "ProductRecommendation_recommendedProductId_idx" ON "ProductRecommendation"("recommendedProductId" ASC);

-- CreateIndex
CREATE INDEX "ProductRecommendation_sourceProductId_sortOrder_idx" ON "ProductRecommendation"("sourceProductId" ASC, "sortOrder" ASC);

-- CreateIndex
CREATE INDEX "ProductReview_productId_active_createdAt_idx" ON "ProductReview"("productId" ASC, "active" ASC, "createdAt" DESC);

-- CreateIndex
CREATE INDEX "ShopLocation_active_sortOrder_idx" ON "ShopLocation"("active" ASC, "sortOrder" ASC);

-- CreateIndex
CREATE INDEX "ShopWorkingHour_shopLocationId_sortOrder_idx" ON "ShopWorkingHour"("shopLocationId" ASC, "sortOrder" ASC);

-- CreateIndex
CREATE INDEX "SkinTypeOption_createdAt_idx" ON "SkinTypeOption"("createdAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "SkinTypeOption_value_key" ON "SkinTypeOption"("value" ASC);

-- CreateIndex
CREATE INDEX "Testimonial_active_sortOrder_createdAt_idx" ON "Testimonial"("active" ASC, "sortOrder" ASC, "createdAt" ASC);

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email" ASC);
