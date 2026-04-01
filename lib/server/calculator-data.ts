import { prisma } from "@/lib/prisma";
import { mapConfigFromDb } from "@/lib/server/quote-engine";

export async function getCalculatorConfig() {
  const [camps, weeks, packages, pricingRows, volumeRules, discountRules] = await Promise.all([
    prisma.camp.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true },
    }),
    prisma.huntWeek.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { label: "asc" }],
      select: { id: true, label: true, slug: true, seasonLabel: true },
    }),
    prisma.packageOption.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { label: "asc" }],
      select: { id: true, code: true, label: true, days: true, nights: true },
    }),
    prisma.campWeekPricing.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        campId: true,
        weekId: true,
        packageId: true,
        baseRate: true,
        minGroupSize: true,
        isAvailable: true,
        availabilityTag: true,
      },
    }),
    prisma.volumeDiscountRule.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { minHunters: "asc" }],
      select: {
        id: true,
        minHunters: true,
        maxHunters: true,
        amountOffPerHead: true,
      },
    }),
    prisma.discountRule.findMany({
      where: { isActive: true },
      orderBy: [{ stackOrder: "asc" }, { label: "asc" }],
      select: {
        id: true,
        code: true,
        label: true,
        category: true,
        type: true,
        value: true,
        stackOrder: true,
      },
    }),
  ]);

  return mapConfigFromDb({
    camps,
    weeks,
    packages,
    pricingRows,
    volumeRules,
    discountRules,
  });
}
