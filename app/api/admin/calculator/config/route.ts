import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { defaultCalculatorSettings } from "@/lib/calculator-settings";
import { prisma } from "@/lib/prisma";
import { assertAdminAccess } from "@/lib/server/admin-auth";
import { getCalculatorConfig } from "@/lib/server/calculator-data";

const labelsSchema = z.object({
  stepHeadings: z.object({
    step1: z.string().min(1),
    step2: z.string().min(1),
    step3: z.string().min(1),
  }),
  step1: z.object({
    cardTitle: z.string().min(1),
    requiredLabel: z.string().min(1),
    optionalLabel: z.string().min(1),
    seasonLabel: z.string().min(1),
    campLabel: z.string().min(1),
    weekLabel: z.string().min(1),
    hunterCountLabel: z.string().min(1),
    packageLabel: z.string().min(1),
    earlyBirdLabel: z.string().min(1),
    campReference: z.string().min(1),
    weekReference: z.string().min(1),
    hunterCountReference: z.string().min(1),
    packageReference: z.string().min(1),
    nextButton: z.string().min(1),
  }),
  step2: z.object({
    hunterNameHeader: z.string().min(1),
    individualDiscountHeader: z.string().min(1),
    extraDaysHeader: z.string().min(1),
    extraNightsHeader: z.string().min(1),
    emailLabel: z.string().min(1),
    backButton: z.string().min(1),
    nextButton: z.string().min(1),
  }),
  step3: z.object({
    overviewTitle: z.string().min(1),
    overviewIntro: z.string().min(1),
    optionsLabel: z.string().min(1),
    optionOneTitle: z.string().min(1),
    optionOneBullets: z.array(z.string().min(1)).min(1),
    optionTwoTitle: z.string().min(1),
    optionTwoBullets: z.array(z.string().min(1)).min(1),
    groupSelectionsTitle: z.string().min(1),
    hunterSelectionsTitle: z.string().min(1),
    depositTitle: z.string().min(1),
    groupFields: z.object({
      season: z.string().min(1),
      camp: z.string().min(1),
      campTier: z.string().min(1),
      package: z.string().min(1),
      totalHunters: z.string().min(1),
      earlyBird: z.string().min(1),
      week: z.string().min(1),
    }),
    tableHeaders: z.object({
      hunterNumber: z.string().min(1),
      hunterName: z.string().min(1),
      individualDiscount: z.string().min(1),
      baseRate: z.string().min(1),
      volumeDiscount: z.string().min(1),
      extraHunting: z.string().min(1),
      extraLodging: z.string().min(1),
      juniorDiscount: z.string().min(1),
      adultDiscount: z.string().min(1),
      earlyBirdDiscount: z.string().min(1),
      taxes: z.string().min(1),
      total: z.string().min(1),
    }),
    totalsBadgeLabel: z.string().min(1),
    totalPriceLabel: z.string().min(1),
    minimumAdjustmentLabel: z.string().min(1),
    depositDescription: z.string().min(1),
    bookingNameLabel: z.string().min(1),
    bookingEmailLabel: z.string().min(1),
    depositAmountLabel: z.string().min(1),
    depositNote: z.string().min(1),
    backButton: z.string().min(1),
    submitButton: z.string().min(1),
  }),
});

const settingsSchema = z.object({
  salesTaxRate: z.number().min(0).max(1),
  earlyBirdRate: z.number().min(0).max(1),
  extraDayRate: z.number().min(0),
  extraNightRate: z.number().min(0),
  processingFeeRate: z.number().min(0).max(1),
  hunterCountOptions: z.array(z.number().int().min(1)).min(1),
  extraDayOptions: z.array(z.number().int().min(0)).min(1),
  extraNightOptions: z.array(z.number().int().min(0)).min(1),
  earlyBirdOptions: z.array(
    z.object({
      label: z.string().min(1),
      value: z.enum(["Yes", "No"]),
    })
  ).min(1),
  depositSchedule: z.array(
    z.object({
      label: z.string().min(1),
      startMonth: z.number().int().min(1).max(12),
      startDay: z.number().int().min(1).max(31),
      endMonth: z.number().int().min(1).max(12),
      endDay: z.number().int().min(1).max(31),
      rate: z.number().min(0).max(1),
    })
  ).min(1),
  labels: labelsSchema,
});

const adminConfigSchema = z.object({
  camps: z.array(
    z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      displayOrder: z.number().int().default(0),
      isActive: z.boolean().default(true),
    })
  ),
  weeks: z.array(
    z.object({
      label: z.string().min(1),
      slug: z.string().min(1),
      seasonLabel: z.string().min(1),
      displayOrder: z.number().int().default(0),
      isActive: z.boolean().default(true),
    })
  ),
  packages: z.array(
    z.object({
      code: z.string().min(1),
      label: z.string().min(1),
      nights: z.number().int().min(1),
      days: z.number().int().min(1),
      displayOrder: z.number().int().default(0),
      isActive: z.boolean().default(true),
    })
  ),
  pricingRows: z.array(
    z.object({
      campSlug: z.string().min(1),
      weekSlug: z.string().min(1),
      packageCode: z.string().min(1),
      baseRate: z.number().min(0),
      minGroupSize: z.number().int().min(1),
      isAvailable: z.boolean().default(true),
      availabilityTag: z.string().nullable().optional(),
    })
  ),
  volumeRules: z.array(
    z.object({
      minHunters: z.number().int().min(1),
      maxHunters: z.number().int().min(1).nullable().optional(),
      amountOffPerHead: z.number().min(0),
      displayOrder: z.number().int().default(0),
      isActive: z.boolean().default(true),
    })
  ),
  discountRules: z.array(
    z.object({
      code: z.string().min(1),
      label: z.string().min(1),
      category: z.enum(["INDIVIDUAL", "JUNIOR"]),
      type: z.enum(["FIXED", "PERCENT"]),
      value: z.number().min(0),
      stackOrder: z.number().int().default(0),
      isActive: z.boolean().default(true),
    })
  ),
  settings: settingsSchema.default(defaultCalculatorSettings),
});

export async function GET(req: NextRequest) {
  const access = assertAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  try {
    const config = await getCalculatorConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error("ADMIN CONFIG GET ERROR", error);
    return NextResponse.json({ error: "Unable to load admin config." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const access = assertAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  try {
    const parsed = adminConfigSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid admin config payload.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const payload = parsed.data;

    await prisma.$transaction(async (tx) => {
      await tx.quoteHunter.deleteMany();
      await tx.quote.deleteMany();
      await tx.campWeekPricing.deleteMany();
      await tx.volumeDiscountRule.deleteMany();
      await tx.discountRule.deleteMany();
      await tx.packageOption.deleteMany();
      await tx.huntWeek.deleteMany();
      await tx.camp.deleteMany();

      const camps = await Promise.all(
        payload.camps.map((camp) =>
          tx.camp.create({
            data: camp,
          })
        )
      );

      const weeks = await Promise.all(
        payload.weeks.map((week) =>
          tx.huntWeek.create({
            data: week,
          })
        )
      );

      const packages = await Promise.all(
        payload.packages.map((pkg) =>
          tx.packageOption.create({
            data: pkg,
          })
        )
      );

      const campBySlug = new Map(camps.map((camp) => [camp.slug, camp.id]));
      const weekBySlug = new Map(weeks.map((week) => [week.slug, week.id]));
      const packageByCode = new Map(packages.map((pkg) => [pkg.code, pkg.id]));

      for (const row of payload.pricingRows) {
        const campId = campBySlug.get(row.campSlug);
        const weekId = weekBySlug.get(row.weekSlug);
        const packageId = packageByCode.get(row.packageCode);

        if (!campId || !weekId || !packageId) {
          throw new Error(
            `Pricing row references unknown camp/week/package: ${row.campSlug}/${row.weekSlug}/${row.packageCode}`
          );
        }

        await tx.campWeekPricing.create({
          data: {
            campId,
            weekId,
            packageId,
            baseRate: row.baseRate,
            minGroupSize: row.minGroupSize,
            isAvailable: row.isAvailable,
            availabilityTag: row.availabilityTag ?? null,
          },
        });
      }

      await tx.volumeDiscountRule.createMany({
        data: payload.volumeRules.map((rule) => ({
          minHunters: rule.minHunters,
          maxHunters: rule.maxHunters ?? null,
          amountOffPerHead: rule.amountOffPerHead,
          displayOrder: rule.displayOrder,
          isActive: rule.isActive,
        })),
      });

      await tx.discountRule.createMany({
        data: payload.discountRules.map((rule) => ({
          code: rule.code,
          label: rule.label,
          category: rule.category,
          type: rule.type,
          value: rule.value,
          stackOrder: rule.stackOrder,
          isActive: rule.isActive,
        })),
      });

      await tx.calculatorSetting.upsert({
        where: { id: "default" },
        update: { config: payload.settings },
        create: {
          id: "default",
          config: payload.settings,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN CONFIG PUT ERROR", error);
    return NextResponse.json({ error: "Unable to save admin config." }, { status: 500 });
  }
}
