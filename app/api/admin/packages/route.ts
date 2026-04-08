import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { assertAdminAccess } from "@/lib/server/admin-auth";

const createPackageSchema = z.object({
  code: z.string().min(1),
  label: z.string().min(1),
  nights: z.number().int().min(1),
  days: z.number().int().min(1),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  const access = assertAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  try {
    const packages = await prisma.packageOption.findMany({
      orderBy: [{ displayOrder: "asc" }, { label: "asc" }],
      select: {
        id: true,
        code: true,
        label: true,
        nights: true,
        days: true,
        displayOrder: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(packages);
  } catch (error) {
    console.error("ADMIN PACKAGES GET ERROR", error);
    return NextResponse.json({ error: "Unable to load packages." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const access = assertAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  try {
    const parsed = createPackageSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid package data.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const packageOption = await prisma.packageOption.create({
      data,
      select: {
        id: true,
        code: true,
        label: true,
        nights: true,
        days: true,
        displayOrder: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(packageOption, { status: 201 });
  } catch (error) {
    console.error("ADMIN PACKAGES POST ERROR", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Code or label already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Unable to create package." }, { status: 500 });
  }
}