/*
  Warnings:

  - You are about to drop the column `baseRate` on the `CampWeekPricing` table. All the data in the column will be lost.
  - You are about to drop the column `individualDiscount` on the `QuoteHunter` table. All the data in the column will be lost.
  - Added the required column `dailyHuntRate` to the `CampWeekPricing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adultDiscount` to the `QuoteHunter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseHuntingPortion` to the `QuoteHunter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseLodgingPortion` to the `QuoteHunter` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DiscountAppliesTo" AS ENUM ('SUBTOTAL', 'HUNTING_ONLY');

-- AlterTable
ALTER TABLE "Camp" ADD COLUMN     "nightlyLodgingRate" DECIMAL(10,2) NOT NULL DEFAULT 100.00;

-- AlterTable
ALTER TABLE "CampWeekPricing" DROP COLUMN "baseRate",
ADD COLUMN     "dailyHuntRate" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "nightlyLodgingRate" DECIMAL(10,2) NOT NULL DEFAULT 100.00;

-- AlterTable
ALTER TABLE "DiscountRule" ADD COLUMN     "appliesTo" "DiscountAppliesTo" NOT NULL DEFAULT 'SUBTOTAL',
ADD COLUMN     "maxPerGroup" INTEGER,
ADD COLUMN     "requiresHunterIndex" INTEGER;

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "juniorCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "youthCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "QuoteHunter" DROP COLUMN "individualDiscount",
ADD COLUMN     "adultDiscount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "baseHuntingPortion" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "baseLodgingPortion" DECIMAL(10,2) NOT NULL;

-- CreateTable
CREATE TABLE "WeekBaseRate" (
    "id" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "baseRate" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeekBaseRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WeekBaseRate_weekId_key" ON "WeekBaseRate"("weekId");

-- AddForeignKey
ALTER TABLE "WeekBaseRate" ADD CONSTRAINT "WeekBaseRate_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "HuntWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;
