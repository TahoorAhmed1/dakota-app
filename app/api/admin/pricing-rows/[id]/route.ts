import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { assertAdminAccess } from "@/lib/server/admin-auth";

const updatePricingRowSchema = z.object({
  baseRate: z.number().min(0).optional(),
  minGroupSize: z.number().int().min(1).optional(),
  isAvailable: z.boolean().optional(),
  availabilityTag: z.string().optional().nullable(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = assertAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  const { id } = await params;

  try {
    const parsed = updatePricingRowSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid pricing row data.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const pricingRow = await prisma.campWeekPricing.update({
      where: { id },
      data,
      include: {
        camp: { select: { name: true } },
        week: { select: { label: true } },
        package: { select: { code: true, label: true, nights: true, days: true } },
      },
    });

    return NextResponse.json(pricingRow);
  } catch (error) {
    console.error("ADMIN PRICING ROW PUT ERROR", error);
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json({ error: "Pricing row not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Unable to update pricing row." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = assertAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  const { id } = await params;

  try {
    await prisma.campWeekPricing.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN PRICING ROW DELETE ERROR", error);
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return NextResponse.json({ error: "Pricing row not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Unable to delete pricing row." }, { status: 500 });
  }
}
