/*
  Warnings:

  - You are about to drop the column `appliesTo` on the `DiscountRule` table. All the data in the column will be lost.
  - You are about to drop the column `depositBase` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `depositTotal` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `processingFee` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `processingFeeRate` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `baseHuntingPortion` on the `QuoteHunter` table. All the data in the column will be lost.
  - You are about to drop the column `baseLodgingPortion` on the `QuoteHunter` table. All the data in the column will be lost.
  - Added the required column `depositAmount` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CalculatorSetting" ALTER COLUMN "id" SET DEFAULT 'default';

-- AlterTable
ALTER TABLE "DiscountRule" DROP COLUMN "appliesTo";

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "depositBase",
DROP COLUMN "depositTotal",
DROP COLUMN "processingFee",
DROP COLUMN "processingFeeRate",
ADD COLUMN     "depositAmount" DECIMAL(12,2) NOT NULL,
ALTER COLUMN "minimumAdjustment" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "QuoteHunter" DROP COLUMN "baseHuntingPortion",
DROP COLUMN "baseLodgingPortion",
ALTER COLUMN "extraDays" SET DEFAULT 0,
ALTER COLUMN "extraNights" SET DEFAULT 0;

-- DropEnum
DROP TYPE "DiscountAppliesTo";
