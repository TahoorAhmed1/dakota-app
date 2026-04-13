/*
  Warnings:

  - Added the required column `lodgingCapacity` to the `CampWeekPricing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CampWeekPricing" ADD COLUMN     "lodgingCapacity" INTEGER NOT NULL;
