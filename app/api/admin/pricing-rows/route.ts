import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { assertAdminAccess } from "@/lib/server/admin-auth";

const createPricingRowSchema = z.object({
  campId: z.string().min(1),
  weekId: z.string().min(1),
  packageId: z.string().min(1),
  baseRate: z.number().min(0),
  minGroupSize: z.number().int().min(1),
  isAvailable: z.boolean().default(true),
  availabilityTag: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const access = assertAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  try {
    const pricingRows = await prisma.campWeekPricing.findMany({
      orderBy: [{ weekId: "asc" }, { campId: "asc" }, { packageId: "asc" }],
      include: {
        camp: { select: { name: true } },
        week: { select: { label: true } },
        package: { select: { code: true, label: true, nights: true, days: true } },
      },
    });

    return NextResponse.json(pricingRows);
  } catch (error) {
    console.error("ADMIN PRICING ROWS GET ERROR", error);
    return NextResponse.json({ error: "Unable to load pricing rows." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const access = assertAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  try {
    const parsed = createPricingRowSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid pricing row data.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const pricingRow = await prisma.campWeekPricing.create({
      data,
      include: {
        camp: { select: { name: true } },
        week: { select: { label: true } },
        package: { select: { code: true, label: true, nights: true, days: true } },
      },
    });

    return NextResponse.json(pricingRow, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("ADMIN PRICING ROWS POST ERROR:", {
      message: errorMessage,
      error: error instanceof Error ? error : String(error),
    });
    
    // Provide more specific error messages
    if (errorMessage.includes("foreign key") || errorMessage.includes("fk_constraint")) {
      return NextResponse.json({ 
        error: "Invalid camp, week, or package ID. Please verify all selected IDs exist in the system." 
      }, { status: 400 });
    }
    
    if (errorMessage.includes("Unique constraint") || errorMessage.includes("unique")) {
      return NextResponse.json({ 
        error: "This pricing combination (Camp/Week/Package) already exists. Each combination must be unique." 
      }, { status: 409 });
    }
    
    return NextResponse.json({ error: "Unable to create pricing row. Check server logs for details." }, { status: 500 });
  }
}
