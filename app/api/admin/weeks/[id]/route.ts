import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { assertAdminAccess } from "@/lib/server/admin-auth";

const updateWeekSchema = z.object({
  label: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  seasonLabel: z.string().min(1).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = assertAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  const { id } = await params;

  try {
    const huntWeek = await prisma.huntWeek.findUnique({
      where: { id },
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

    if (!huntWeek) {
      return NextResponse.json({ error: "Week not found." }, { status: 404 });
    }

    return NextResponse.json(huntWeek);
  } catch (error) {
    console.error("ADMIN WEEK GET ERROR", error);
    return NextResponse.json({ error: "Unable to load week." }, { status: 500 });
  }
}

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
    const parsed = updateWeekSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid week data.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const huntWeek = await prisma.huntWeek.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
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

    return NextResponse.json(huntWeek);
  } catch (error) {
    console.error("ADMIN WEEK PUT ERROR", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Label or slug already exists." }, { status: 409 });
    }
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json({ error: "Week not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Unable to update week." }, { status: 500 });
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
    await prisma.huntWeek.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN WEEK DELETE ERROR", error);
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return NextResponse.json({ error: "Week not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Unable to delete week." }, { status: 500 });
  }
}