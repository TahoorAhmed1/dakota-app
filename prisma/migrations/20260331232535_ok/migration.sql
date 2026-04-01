-- CreateEnum
CREATE TYPE "public"."DiscountType" AS ENUM ('FIXED', 'PERCENT');

-- CreateEnum
CREATE TYPE "public"."DiscountCategory" AS ENUM ('INDIVIDUAL', 'JUNIOR');

-- CreateTable
CREATE TABLE "public"."Camp" (
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
CREATE TABLE "public"."HuntWeek" (
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
CREATE TABLE "public"."PackageOption" (
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
CREATE TABLE "public"."CampWeekPricing" (
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
CREATE TABLE "public"."VolumeDiscountRule" (
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
CREATE TABLE "public"."DiscountRule" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "category" "public"."DiscountCategory" NOT NULL,
    "type" "public"."DiscountType" NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "stackOrder" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscountRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Quote" (
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
CREATE TABLE "public"."QuoteHunter" (
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
CREATE TABLE "public"."ContactSubmission" (
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
CREATE TABLE "public"."NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Camp_name_key" ON "public"."Camp"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Camp_slug_key" ON "public"."Camp"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "HuntWeek_label_key" ON "public"."HuntWeek"("label");

-- CreateIndex
CREATE UNIQUE INDEX "HuntWeek_slug_key" ON "public"."HuntWeek"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PackageOption_code_key" ON "public"."PackageOption"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PackageOption_label_key" ON "public"."PackageOption"("label");

-- CreateIndex
CREATE UNIQUE INDEX "CampWeekPricing_campId_weekId_packageId_key" ON "public"."CampWeekPricing"("campId", "weekId", "packageId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscountRule_code_key" ON "public"."DiscountRule"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Quote_quoteNumber_key" ON "public"."Quote"("quoteNumber");

-- CreateIndex
CREATE UNIQUE INDEX "QuoteHunter_quoteId_rowIndex_key" ON "public"."QuoteHunter"("quoteId", "rowIndex");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "public"."NewsletterSubscriber"("email");

-- AddForeignKey
ALTER TABLE "public"."CampWeekPricing" ADD CONSTRAINT "CampWeekPricing_campId_fkey" FOREIGN KEY ("campId") REFERENCES "public"."Camp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CampWeekPricing" ADD CONSTRAINT "CampWeekPricing_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "public"."HuntWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CampWeekPricing" ADD CONSTRAINT "CampWeekPricing_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."PackageOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quote" ADD CONSTRAINT "Quote_campId_fkey" FOREIGN KEY ("campId") REFERENCES "public"."Camp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quote" ADD CONSTRAINT "Quote_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "public"."HuntWeek"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quote" ADD CONSTRAINT "Quote_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."PackageOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuoteHunter" ADD CONSTRAINT "QuoteHunter_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "public"."Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
