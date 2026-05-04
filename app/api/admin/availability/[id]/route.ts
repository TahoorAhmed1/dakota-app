// ─── /api/admin/availability/[id]/route.ts ───────────────────────────────────
// PATCH /api/admin/availability/:id  → update availabilityTag + isAvailable

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { assertAdminAccess } from "@/lib/server/admin-auth";

const patchSchema = z.object({
  availabilityTag: z.enum(["OPEN", "RESERVED", "PENDING", "NA"]),
  minGroupSize: z.number().int().min(1).optional(),
  lodgingCapacity: z.number().int().min(0).optional(),
  hoverText: z.string().max(500).optional().nullable(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const access = assertAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  const { id } = await params;

  const parsed = patchSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { availabilityTag, minGroupSize, lodgingCapacity, hoverText } = parsed.data;

  try {
    const existing = await prisma.campWeekPricing.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Row not found." }, { status: 404 });
    }

    const updated = await prisma.campWeekPricing.update({
      where: { id },
      data: {
        availabilityTag,
        isAvailable: availabilityTag === "OPEN",
        ...(minGroupSize !== undefined && { minGroupSize }),
        ...(lodgingCapacity !== undefined && { lodgingCapacity }),
        ...(hoverText !== undefined && { hoverText }),
      },
      select: {
        id: true,
        campId: true,
        weekId: true,
        packageId: true,
        availabilityTag: true,
        isAvailable: true,
        minGroupSize: true,
        lodgingCapacity: true,
        hoverText: true,
        camp: { select: { name: true } },
        week: { select: { label: true } },
        package: { select: { label: true, code: true } },
      },
    });

    return NextResponse.json({
      id: updated.id,
      campId: updated.campId,
      campName: updated.camp.name,
      weekId: updated.weekId,
      weekLabel: updated.week.label,
      packageId: updated.packageId,
      packageLabel: updated.package.label,
      packageCode: updated.package.code,
      availabilityTag: updated.availabilityTag ?? "NA",
      isAvailable: updated.isAvailable,
      minGroupSize: updated.minGroupSize,
      lodgingCapacity: updated.lodgingCapacity,
      hoverText: updated.hoverText ?? "",
    });
  } catch (error) {
    console.error("ADMIN AVAILABILITY PATCH ERROR", error);
    return NextResponse.json({ error: "Unable to update availability." }, { status: 500 });
  }
}