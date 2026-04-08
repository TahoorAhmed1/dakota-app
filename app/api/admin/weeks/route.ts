import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { assertAdminAccess } from "@/lib/server/admin-auth";

const createWeekSchema = z.object({
  label: z.string().min(1),
  slug: z.string().min(1),
  seasonLabel: z.string().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  const access = assertAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  try {
    const weeks = await prisma.huntWeek.findMany({
      orderBy: [{ displayOrder: "asc" }, { label: "asc" }],
      select: {
        id: true,
        label: true,
        slug: true,
        seasonLabel: true,
        startDate: true,
        endDate: true,
        displayOrder: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(weeks);
  } catch (error) {
    console.error("ADMIN WEEKS GET ERROR", error);
    return NextResponse.json({ error: "Unable to load weeks." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const access = assertAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  try {
    const parsed = createWeekSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid week data.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const huntWeek = await prisma.huntWeek.create({
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
      select: {
        id: true,
        label: true,
        slug: true,
        seasonLabel: true,
        startDate: true,
        endDate: true,
        displayOrder: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(huntWeek, { status: 201 });
  } catch (error) {
    console.error("ADMIN WEEKS POST ERROR", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Label or slug already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Unable to create week." }, { status: 500 });
  }
}