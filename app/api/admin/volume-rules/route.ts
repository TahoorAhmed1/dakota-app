import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { assertAdminAccess } from "@/lib/server/admin-auth";

const createVolumeRuleSchema = z.object({
  minHunters: z.number().int().min(1),
  maxHunters: z.number().int().min(1).optional().nullable(),
  amountOffPerHead: z.number().min(0),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  const access = assertAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  try {
    const volumeRules = await prisma.volumeDiscountRule.findMany({
      orderBy: [{ displayOrder: "asc" }, { minHunters: "asc" }],
    });

    return NextResponse.json(volumeRules);
  } catch (error) {
    console.error("ADMIN VOLUME RULES GET ERROR", error);
    return NextResponse.json({ error: "Unable to load volume rules." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const access = assertAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  try {
    const parsed = createVolumeRuleSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid volume rule data.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const volumeRule = await prisma.volumeDiscountRule.create({
      data,
    });

    return NextResponse.json(volumeRule, { status: 201 });
  } catch (error) {
    console.error("ADMIN VOLUME RULES POST ERROR", error);
    return NextResponse.json({ error: "Unable to create volume rule." }, { status: 500 });
  }
}
