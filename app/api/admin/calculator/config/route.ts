import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { assertAdminAccess } from "@/lib/server/admin-auth";
import { getCalculatorConfig } from "@/lib/server/calculator-data";

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
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN CONFIG PUT ERROR", error);
    return NextResponse.json({ error: "Unable to save admin config." }, { status: 500 });
  }
}
