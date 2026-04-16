import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { assertAdminAccess } from "@/lib/server/admin-auth";

const discountRuleSchema = z.object({
  code: z.string().min(1),
  label: z.string().min(1),
  category: z.enum(["INDIVIDUAL", "JUNIOR"]),
  type: z.enum(["FIXED", "PERCENT"]),
  value: z.number().min(0),
  stackOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  const access = assertAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }
  try {
    const discountRules = await prisma.discountRule.findMany({
      orderBy: [{ stackOrder: "asc" }, { label: "asc" }],
    });
    return NextResponse.json(discountRules);
  } catch (error) {
    return NextResponse.json({ error: "Unable to fetch discount rules." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const access = assertAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }
  try {
    const discountRules = await req.json();
    if (!Array.isArray(discountRules)) {
      return NextResponse.json({ error: "Payload must be an array of discount rules." }, { status: 400 });
    }
    const parsed = z.array(discountRuleSchema).safeParse(discountRules);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid discount rules payload.", details: parsed.error.flatten() }, { status: 400 });
    }
    // Replace all discount rules
    await prisma.discountRule.deleteMany();
    await prisma.discountRule.createMany({ data: parsed.data });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Unable to update discount rules." }, { status: 500 });
  }
}
