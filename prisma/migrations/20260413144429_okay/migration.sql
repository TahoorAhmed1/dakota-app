/*
  Warnings:

  - Added the required column `baseRate` to the `CampWeekPricing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CampWeekPricing" ADD COLUMN     "baseRate" INTEGER NOT NULL;
