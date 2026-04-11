-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('FIXED', 'PERCENT');

-- CreateEnum
CREATE TYPE "DiscountCategory" AS ENUM ('INDIVIDUAL', 'JUNIOR');

-- CreateTable
CREATE TABLE "Camp" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Camp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HuntWeek" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "seasonLabel" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HuntWeek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageOption" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "nights" INTEGER NOT NULL,
    "days" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampWeekPricing" (
    "id" TEXT NOT NULL,
    "campId" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "baseRate" DECIMAL(10,2) NOT NULL,
    "minGroupSize" INTEGER NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "availabilityTag" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampWeekPricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VolumeDiscountRule" (
    "id" TEXT NOT NULL,
    "minHunters" INTEGER NOT NULL,
    "maxHunters" INTEGER,
    "amountOffPerHead" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VolumeDiscountRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscountRule" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "category" "DiscountCategory" NOT NULL,
    "type" "DiscountType" NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "stackOrder" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscountRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalculatorSetting" (
    "id" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalculatorSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "quoteNumber" TEXT NOT NULL,
    "seasonLabel" TEXT NOT NULL,
    "campId" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "hunterCount" INTEGER NOT NULL,
    "earlyBird" BOOLEAN NOT NULL,
    "quoteEmail" TEXT,
    "bookingName" TEXT NOT NULL,
    "bookingEmail" TEXT NOT NULL,
    "subtotalBeforeTax" DECIMAL(12,2) NOT NULL,
    "minimumAdjustment" DECIMAL(12,2) NOT NULL,
    "taxAmount" DECIMAL(12,2) NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "depositRate" DECIMAL(5,4) NOT NULL,
    "depositBase" DECIMAL(12,2) NOT NULL,
    "processingFeeRate" DECIMAL(5,4) NOT NULL,
    "processingFee" DECIMAL(12,2) NOT NULL,
    "depositTotal" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteHunter" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "rowIndex" INTEGER NOT NULL,
    "hunterName" TEXT,
    "discountCode" TEXT NOT NULL,
    "extraDays" INTEGER NOT NULL,
    "extraNights" INTEGER NOT NULL,
    "baseRate" DECIMAL(10,2) NOT NULL,
    "volumeDiscount" DECIMAL(10,2) NOT NULL,
    "extraHunting" DECIMAL(10,2) NOT NULL,
    "extraLodging" DECIMAL(10,2) NOT NULL,
    "earlyBirdDiscount" DECIMAL(10,2) NOT NULL,
    "individualDiscount" DECIMAL(10,2) NOT NULL,
    "juniorDiscount" DECIMAL(10,2) NOT NULL,
    "subtotalBeforeTax" DECIMAL(10,2) NOT NULL,
    "taxAmount" DECIMAL(10,2) NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteHunter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactSubmission" (
    "id" TEXT NOT NULL,
    "huntType" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "minGroupSize" TEXT NOT NULL,
    "maxGroupSize" TEXT NOT NULL,
    "dogPower" TEXT NOT NULL,
    "firstChoice" TEXT NOT NULL,
    "secondChoice" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "stateProvince" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "additionalComments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaitlistEntry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "weekPref" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaitlistEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "caption" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT 'general',
    "width" INTEGER NOT NULL DEFAULT 0,
    "height" INTEGER NOT NULL DEFAULT 0,
    "format" TEXT NOT NULL DEFAULT '',
    "bytes" INTEGER NOT NULL DEFAULT 0,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageCatalog" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "caption" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT 'catalog',
    "width" INTEGER NOT NULL DEFAULT 0,
    "height" INTEGER NOT NULL DEFAULT 0,
    "format" TEXT NOT NULL DEFAULT '',
    "bytes" INTEGER NOT NULL DEFAULT 0,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImageCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Camp_name_key" ON "Camp"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Camp_slug_key" ON "Camp"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "HuntWeek_label_key" ON "HuntWeek"("label");

-- CreateIndex
CREATE UNIQUE INDEX "HuntWeek_slug_key" ON "HuntWeek"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PackageOption_code_key" ON "PackageOption"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PackageOption_label_key" ON "PackageOption"("label");

-- CreateIndex
CREATE UNIQUE INDEX "CampWeekPricing_campId_weekId_packageId_key" ON "CampWeekPricing"("campId", "weekId", "packageId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscountRule_code_key" ON "DiscountRule"("code");

-- CreateIndex
CREATE UNIQUE INDEX "NewsPost_slug_key" ON "NewsPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Quote_quoteNumber_key" ON "Quote"("quoteNumber");

-- CreateIndex
CREATE UNIQUE INDEX "QuoteHunter_quoteId_rowIndex_key" ON "QuoteHunter"("quoteId", "rowIndex");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryImage_publicId_key" ON "GalleryImage"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageCatalog_publicId_key" ON "ImageCatalog"("publicId");

-- AddForeignKey
ALTER TABLE "CampWeekPricing" ADD CONSTRAINT "CampWeekPricing_campId_fkey" FOREIGN KEY ("campId") REFERENCES "Camp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampWeekPricing" ADD CONSTRAINT "CampWeekPricing_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "HuntWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampWeekPricing" ADD CONSTRAINT "CampWeekPricing_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "PackageOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_campId_fkey" FOREIGN KEY ("campId") REFERENCES "Camp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "HuntWeek"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "PackageOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteHunter" ADD CONSTRAINT "QuoteHunter_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
