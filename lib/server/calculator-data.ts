import { prisma } from "@/lib/prisma";
import { defaultCalculatorSettings, normalizeCalculatorSettings } from "@/lib/calculator-settings";
import { mapConfigFromDb } from "@/lib/server/quote-engine";

const CALCULATOR_CONFIG_TTL_MS = 10_000;

let cachedCalculatorConfig: ReturnType<typeof mapConfigFromDb> | null = null;
let cachedCalculatorConfigExpiresAt = 0;
let inFlightCalculatorConfigPromise: Promise<ReturnType<typeof mapConfigFromDb>> | null = null;

export async function getCalculatorConfig() {
  const now = Date.now();

  if (cachedCalculatorConfig && cachedCalculatorConfigExpiresAt > now) {
    return cachedCalculatorConfig;
  }

  if (inFlightCalculatorConfigPromise) {
    return inFlightCalculatorConfigPromise;
  }

  inFlightCalculatorConfigPromise = (async () => {
    const camps = await prisma.camp.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true },
    });

    const weeks = await prisma.huntWeek.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { label: "asc" }],
      select: { id: true, label: true, slug: true, seasonLabel: true },
    });

    const packages = await prisma.packageOption.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { label: "asc" }],
      select: { id: true, code: true, label: true, days: true, nights: true },
    });

    const pricingRows = await prisma.campWeekPricing.findMany({
      orderBy: [{ weekId: "asc" }, { campId: "asc" }, { packageId: "asc" }],
      select: {
        id: true,
        campId: true,
        weekId: true,
        packageId: true,
        baseRate: true,
        minGroupSize: true,
        lodgingCapacity: true,
        isAvailable: true,
        availabilityTag: true,
      },
    });

    const volumeRules = await prisma.volumeDiscountRule.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { minHunters: "asc" }],
      select: {
        id: true,
        minHunters: true,
        maxHunters: true,
        amountOffPerHead: true,
      },
    });

    const discountRules = await prisma.discountRule.findMany({
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
    });

    const settings = await prisma.calculatorSetting.findUnique({
      where: { id: "default" },
      select: { config: true },
    });

    const config = mapConfigFromDb({
      camps,
      weeks,
      packages,
      pricingRows,
      volumeRules,
      discountRules,
      settings: normalizeCalculatorSettings(settings?.config ?? defaultCalculatorSettings),
    });

    cachedCalculatorConfig = config;
    cachedCalculatorConfigExpiresAt = Date.now() + CALCULATOR_CONFIG_TTL_MS;

    return config;
  })();

  try {
    return await inFlightCalculatorConfigPromise;
  } finally {
    inFlightCalculatorConfigPromise = null;
  }
}
