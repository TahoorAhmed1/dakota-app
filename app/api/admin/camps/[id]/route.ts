import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const camp = await prisma.camp.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        nightlyLodgingRate: true,
        isActive: true,
        displayOrder: true,
      },
    });

    if (!camp) return NextResponse.json({ error: "Not Found" }, { status: 404 });

    return NextResponse.json(camp);
  } catch (error) {
    console.error("Error fetching camp:", error);
    return NextResponse.json({ error: "Failed to fetch camp" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json().catch(() => ({}));

    // Build update payload only with fields that exist on the Camp model
    const data: any = {};
    if (typeof body.name === "string") data.name = body.name;
    if (typeof body.slug === "string") data.slug = body.slug;
    if (body.nightlyLodgingRate !== undefined && body.nightlyLodgingRate !== null)
      data.nightlyLodgingRate = Number(body.nightlyLodgingRate);
    if (typeof body.isActive === "boolean") data.isActive = body.isActive;
    if (typeof body.displayOrder === "number") data.displayOrder = body.displayOrder;

    // Note: minGroupSize and lodgingCapacity are not fields on the Camp model
    // according to prisma/schema.prisma. If you want to persist those at the
    // camp level, add them to the Camp model and run a migration.

    const updated = await prisma.camp.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating camp:", error);
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Camp update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.camp.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting camp:", error);
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
