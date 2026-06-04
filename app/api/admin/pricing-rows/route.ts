import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { assertAdminAccess } from "@/lib/server/admin-auth";
import { invalidateCalculatorConfigCache } from "@/lib/server/calculator-data";
import { invalidateCalculatorConfigCache } from "@/lib/server/calculator-data";

const createPricingRowSchema = z.object({
  campId: z.string().min(1),
  weekId: z.string().min(1),
  packageId: z.string().min(1),

  baseRate: z.number().min(0),

  minGroupSize: z.number().int().min(1),

  lodgingCapacity: z.number().int().min(1).default(1),

  nightlyLodgingRate: z.number().min(0).optional(),
  dailyHuntRate: z.number().min(0).optional(),

  isAvailable: z.boolean().default(true),

  availabilityTag: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const access = assertAdminAccess(req);

  if (!access.ok) {
    return NextResponse.json(
      { error: access.error },
      { status: access.status },
    );
  }

  try {
    const pricingRows = await prisma.campWeekPricing.findMany({
      orderBy: {
        createdAt: "asc",
      },
      include: {
        camp: {
          select: {
            name: true,
          },
        },
        week: {
          select: {
            label: true,
          },
        },
        package: {
          select: {
            code: true,
            label: true,
            nights: true,
            days: true,
          },
        },
      },
    });

    return NextResponse.json(pricingRows);
  } catch (error) {
    console.error("ADMIN PRICING ROWS GET ERROR", error);

    return NextResponse.json(
      {
        error: "Unable to load pricing rows.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(req: NextRequest) {
  const access = assertAdminAccess(req);

  if (!access.ok) {
    return NextResponse.json(
      { error: access.error },
      { status: access.status },
    );
  }

  try {
    const body = await req.json();

    const parsed = createPricingRowSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid pricing row data.",
          details: parsed.error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    const data = parsed.data;

    const [campExists, weekExists, packageExists] = await prisma.$transaction([
      prisma.camp.findUnique({
        where: { id: data.campId },
        select: { id: true },
      }),
      prisma.huntWeek.findUnique({
        where: { id: data.weekId },
        select: { id: true },
      }),
      prisma.packageOption.findUnique({
        where: { id: data.packageId },
        select: { id: true, days: true, nights: true },
      }),
    ]);

    const missingIds = [];
    if (!campExists) missingIds.push("campId");
    if (!weekExists) missingIds.push("weekId");
    if (!packageExists) missingIds.push("packageId");

    if (missingIds.length > 0) {
      return NextResponse.json(
        {
          error: `Invalid ${missingIds.join(", ")}. Please verify all selected IDs exist in the system.`,
        },
        {
          status: 400,
        },
      );
    }
    const existingPricingRow = await prisma.campWeekPricing.findFirst({
      where: {
        campId: data.campId,
        weekId: data.weekId,
        packageId: data.packageId,
      },
    });

    if (existingPricingRow) {
      return NextResponse.json(
        {
          error:
            "Pricing row already exists for this Camp / Week / Package combination.",
        },
        {
          status: 409,
        },
      );
    }

    const packageOption = packageExists;
    const nightlyLodgingRate = data.nightlyLodgingRate ?? 100;
    const computedDailyHuntRate = data.dailyHuntRate ??
      Number((Number(data.baseRate) - nightlyLodgingRate * (packageOption?.nights ?? 0)) / Math.max(1, packageOption?.days ?? 1));

    const pricingRow = await prisma.campWeekPricing.create({
      data: {
        ...data,
        nightlyLodgingRate: nightlyLodgingRate,
        dailyHuntRate: Number(computedDailyHuntRate.toFixed(2)),
      },

      include: {
        camp: {
          select: {
            name: true,
          },
        },

        week: {
          select: {
            label: true,
          },
        },

        package: {
          select: {
            code: true,
            label: true,
            nights: true,
            days: true,
          },
        }, 
      },
    });

    invalidateCalculatorConfigCache();
    return NextResponse.json(pricingRow, {
      status: 201,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.error("ADMIN PRICING ROWS POST ERROR:", {
      message: errorMessage,
      error: error instanceof Error ? error : String(error),
    });

    if (
      errorMessage.includes("foreign key") ||
      errorMessage.includes("fk_constraint")
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid camp, week, or package ID. Please verify all selected IDs exist in the system.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      errorMessage.includes("Unique constraint") ||
      errorMessage.includes("unique")
    ) {
      return NextResponse.json(
        {
          error: "This pricing combination already exists.",
        },
        {
          status: 409,
        },
      );
    }

    return NextResponse.json(
      {
        error: "Unable to create pricing row. Check server logs for details.",
      },
      {
        status: 500,
      },
    );
  }
}
