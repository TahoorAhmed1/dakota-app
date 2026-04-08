import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { assertAdminAccess } from "@/lib/server/admin-auth";

const updateVolumeRuleSchema = z.object({
  minHunters: z.number().int().min(1).optional(),
  maxHunters: z.number().int().min(1).optional().nullable(),
  amountOffPerHead: z.number().min(0).optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
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
    const parsed = updateVolumeRuleSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid volume rule data.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const volumeRule = await prisma.volumeDiscountRule.update({
      where: { id },
      data,
    });

    return NextResponse.json(volumeRule);
  } catch (error) {
    console.error("ADMIN VOLUME RULE PUT ERROR", error);
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json({ error: "Volume rule not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Unable to update volume rule." }, { status: 500 });
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
    await prisma.volumeDiscountRule.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN VOLUME RULE DELETE ERROR", error);
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return NextResponse.json({ error: "Volume rule not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Unable to delete volume rule." }, { status: 500 });
  }
}
