import { CalculatorSettings, calculateDepositRate } from "@/lib/calculator-settings";

type DiscountCategory = "INDIVIDUAL" | "JUNIOR" | "YOUTH";
type DiscountType = "FIXED" | "PERCENT";
type DecimalLike = number | string | { toString(): string };

export type CalculatorConfig = {
  camps: Array<{ id: string; name: string; slug: string }>;
  weeks: Array<{ id: string; label: string; slug: string; seasonLabel: string }>;
  packages: Array<{ id: string; code: string; label: string; days: number; nights: number }>;
  pricingRows: Array<{
    id: string;
    campId: string;
    weekId: string;
    packageId: string;
    baseRate: number;
    minGroupSize: number;
    lodgingCapacity: number;
    isAvailable: boolean;
    availabilityTag: string | null;
  }>;
  volumeRules: Array<{
    id: string;
    minHunters: number;
    maxHunters: number | null;
    amountOffPerHead: number;
  }>;
  discountRules: Array<{
    id: string;
    code: string;
    label: string;
    category: DiscountCategory;
    type: DiscountType;
    value: number;
    stackOrder: number;
  }>;
  settings: CalculatorSettings;
};

export type HunterInput = {
  name?: string;
  discountCode?: string;
  extraDays?: number;
  extraNights?: number;
};

export type QuoteCalcInput = {
  campId: string;
  weekId: string;
  packageId: string;
  hunterCount: number;
  earlyBird: boolean;
  hunters: HunterInput[];
};

export type QuoteCalculation = {
  selected: {
    campId: string;
    campName: string;
    weekId: string;
    weekLabel: string;
    packageId: string;
    packageLabel: string;
    minGroupSize: number;
  };
  rows: Array<{
    rowIndex: number;
    name: string;
    discountCode: string;
    discountLabel: string;
    baseRate: number;
    volumeDiscount: number;
    extraHunting: number;
    extraLodging: number;
    earlyBirdDiscount: number;
    individualDiscount: number;
    juniorDiscount: number;
    subtotalBeforeTax: number;
    taxAmount: number;
    totalAmount: number;
  }>;
  totals: {
    subtotalBeforeTax: number;
    minimumAdjustment: number;
    taxAmount: number;
    totalAmount: number;
    depositRate: number;
    depositBase: number;
    processingFeeRate: number;
    processingFee: number;
    depositTotal: number;
  };
};

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function toNumber(value: DecimalLike): number {
  return typeof value === "number" ? value : Number(value.toString());
}

export function mapConfigFromDb(data: {
  camps: Array<{ id: string; name: string; slug: string }>;
  weeks: Array<{ id: string; label: string; slug: string; seasonLabel: string }>;
  packages: Array<{ id: string; code: string; label: string; days: number; nights: number }>;
  pricingRows: Array<{
    id: string;
    campId: string;
    weekId: string;
    packageId: string;
    baseRate: DecimalLike;
    minGroupSize: number;
    lodgingCapacity: number;
    isAvailable: boolean;
    availabilityTag: string | null;
  }>;
  volumeRules: Array<{
    id: string;
    minHunters: number;
    maxHunters: number | null;
    amountOffPerHead: DecimalLike;
  }>;
  discountRules: Array<{
    id: string;
    code: string;
    label: string;
    category: DiscountCategory;
    type: DiscountType;
    value: DecimalLike;
    stackOrder: number;
  }>;
  settings: CalculatorSettings;
}): CalculatorConfig {
  return {
    camps: data.camps,
    weeks: data.weeks,
    packages: data.packages,
    pricingRows: data.pricingRows.map((row) => ({
      ...row,
      baseRate: toNumber(row.baseRate),
    })),
    volumeRules: data.volumeRules.map((rule) => ({
      ...rule,
      amountOffPerHead: toNumber(rule.amountOffPerHead),
    })),
    discountRules: data.discountRules.map((rule) => ({
      ...rule,
      value: toNumber(rule.value),
    })),
    settings: data.settings,
  };
}

function getVolumeDiscount(config: CalculatorConfig, hunterCount: number): number {
  const matched = config.volumeRules.find((rule) => {
    if (hunterCount < rule.minHunters) return false;
    if (rule.maxHunters == null) return true;
    return hunterCount <= rule.maxHunters;
  });

  return matched ? matched.amountOffPerHead : 0;
}

export function calculateQuote(input: QuoteCalcInput, config: CalculatorConfig): QuoteCalculation {
  const selectedCamp = config.camps.find((camp) => camp.id === input.campId);
  const selectedWeek = config.weeks.find((week) => week.id === input.weekId);
  const selectedPackage = config.packages.find((pkg) => pkg.id === input.packageId);

  if (!selectedCamp || !selectedWeek || !selectedPackage) {
    throw new Error("Invalid camp, week, or package selection.");
  }

  const pricing = config.pricingRows.find(
    (row) =>
      row.campId === input.campId &&
      row.weekId === input.weekId &&
      row.packageId === input.packageId
  );

  if (!pricing) {
    throw new Error("Pricing row was not found for the selected camp, week, and package.");
  }

  const volumeDiscount = getVolumeDiscount(config, input.hunterCount);
  const noneRule = config.discountRules.find((rule) => rule.code === "NONE");

  const rows = Array.from({ length: input.hunterCount }, (_, idx) => {
    const hunter = input.hunters[idx] ?? {};
    const chosenCode = hunter.discountCode ?? "NONE";
    const matchedRule =
      config.discountRules.find((rule) => rule.code === chosenCode) ?? noneRule ?? null;

    const rateAfterVolume = pricing.baseRate - volumeDiscount;
    const earlyBirdDiscount = input.earlyBird
      ? rateAfterVolume * config.settings.earlyBirdRate
      : 0;

    let individualDiscount = 0;
    let juniorDiscount = 0;

    if (matchedRule) {
      if (matchedRule.category === "JUNIOR") {
        if (matchedRule.type === "PERCENT") {
          juniorDiscount = rateAfterVolume * (matchedRule.value / 100);
        } else {
          juniorDiscount = matchedRule.value;
        }
      }

      if (matchedRule.category === "INDIVIDUAL") {
        const postEarlyBirdBase = rateAfterVolume - earlyBirdDiscount;
        if (matchedRule.type === "PERCENT") {
          individualDiscount = postEarlyBirdBase * (matchedRule.value / 100);
        } else {
          individualDiscount = matchedRule.value;
        }
      }
    }

    const extraDays = Math.max(0, hunter.extraDays ?? 0);
    const extraNights = Math.max(0, hunter.extraNights ?? 0);
    const extraHunting = extraDays * config.settings.extraDayRate;
    const extraLodging = extraNights * config.settings.extraNightRate;

    const subtotalBeforeTax =
      rateAfterVolume -
      earlyBirdDiscount -
      individualDiscount -
      juniorDiscount +
      extraHunting +
      extraLodging;

    const taxAmount = subtotalBeforeTax * config.settings.salesTaxRate;
    const totalAmount = subtotalBeforeTax + taxAmount;

    return {
      rowIndex: idx + 1,
      name: hunter.name?.trim() || `Hunter ${idx + 1}`,
      discountCode: matchedRule?.code ?? "NONE",
      discountLabel: matchedRule?.label ?? "None",
      baseRate: round2(pricing.baseRate),
      volumeDiscount: round2(volumeDiscount),
      extraHunting: round2(extraHunting),
      extraLodging: round2(extraLodging),
      earlyBirdDiscount: round2(earlyBirdDiscount),
      individualDiscount: round2(individualDiscount),
      juniorDiscount: round2(juniorDiscount),
      subtotalBeforeTax: round2(subtotalBeforeTax),
      taxAmount: round2(taxAmount),
      totalAmount: round2(totalAmount),
    };
  });

  const subtotalBeforeTax = rows.reduce((sum, row) => sum + row.subtotalBeforeTax, 0);

  // The minimum group protects base package value while still allowing all quotes.
  const minimumRevenueFloor = pricing.baseRate * pricing.minGroupSize;
  const minimumAdjustment = Math.max(0, minimumRevenueFloor - subtotalBeforeTax);
  const taxableSubtotal = subtotalBeforeTax + minimumAdjustment;
  const taxAmount = taxableSubtotal * config.settings.salesTaxRate;
  const totalAmount = taxableSubtotal + taxAmount;

  const depositRate = calculateDepositRate(config.settings.depositSchedule, new Date());
  const depositBase = totalAmount * depositRate;
  const processingFee = depositBase * config.settings.processingFeeRate;
  const depositTotal = depositBase + processingFee;

  return {
    selected: {
      campId: selectedCamp.id,
      campName: selectedCamp.name,
      weekId: selectedWeek.id,
      weekLabel: selectedWeek.label,
      packageId: selectedPackage.id,
      packageLabel: selectedPackage.label,
      minGroupSize: pricing.minGroupSize,
    },
    rows,
    totals: {
      subtotalBeforeTax: round2(subtotalBeforeTax),
      minimumAdjustment: round2(minimumAdjustment),
      taxAmount: round2(taxAmount),
      totalAmount: round2(totalAmount),
      depositRate,
      depositBase: round2(depositBase),
      processingFeeRate: config.settings.processingFeeRate,
      processingFee: round2(processingFee),
      depositTotal: round2(depositTotal),
    },
  };
}

export function calculateQuickQuote(
  config: CalculatorConfig,
  params: { campId: string; weekId: string; earlyBird: boolean }
) {
  const candidatePackages = config.packages.filter((pkg) => pkg.days === 3 || pkg.days === 4);

  const results = candidatePackages
    .map((pkg) => {
      const calculation = calculateQuote(
        {
          campId: params.campId,
          weekId: params.weekId,
          packageId: pkg.id,
          hunterCount: 1,
          earlyBird: params.earlyBird,
          hunters: [{ discountCode: "NONE", extraDays: 0, extraNights: 0 }],
        },
        config
      );

      return {
        packageId: pkg.id,
        packageLabel: pkg.label,
        totalAmount: calculation.totals.totalAmount,
        depositAmount: calculation.totals.depositTotal,
        depositBase: calculation.totals.depositBase,
        minimumGroupSize: calculation.selected.minGroupSize,
      };
    })
    .sort((a, b) => a.totalAmount - b.totalAmount);

  return {
    cheapest: results[0] ?? null,
    options: results,
  };
}
