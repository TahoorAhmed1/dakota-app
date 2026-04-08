import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { assertAdminAccess } from "@/lib/server/admin-auth";

const updatePackageSchema = z.object({
  code: z.string().min(1).optional(),
  label: z.string().min(1).optional(),
  nights: z.number().int().min(1).optional(),
  days: z.number().int().min(1).optional(),
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
    const packageOption = await prisma.packageOption.findUnique({
      where: { id },
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

    if (!packageOption) {
      return NextResponse.json({ error: "Package not found." }, { status: 404 });
    }

    return NextResponse.json(packageOption);
  } catch (error) {
    console.error("ADMIN PACKAGE GET ERROR", error);
    return NextResponse.json({ error: "Unable to load package." }, { status: 500 });
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
    const parsed = updatePackageSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid package data.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const packageOption = await prisma.packageOption.update({
      where: { id },
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

    return NextResponse.json(packageOption);
  } catch (error) {
    console.error("ADMIN PACKAGE PUT ERROR", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Code or label already exists." }, { status: 409 });
    }
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json({ error: "Package not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Unable to update package." }, { status: 500 });
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
    await prisma.packageOption.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN PACKAGE DELETE ERROR", error);
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return NextResponse.json({ error: "Package not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Unable to delete package." }, { status: 500 });
  }
}