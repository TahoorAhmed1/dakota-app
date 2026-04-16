// ─── /api/admin/availability/route.ts ────────────────────────────────────────
// GET  /api/admin/availability  → list all CampWeekPricing rows with names

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertAdminAccess } from "@/lib/server/admin-auth";

export async function GET(req: NextRequest) {
  const access = assertAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  try {
    const rows = await prisma.campWeekPricing.findMany({
      orderBy: [
        { camp: { displayOrder: "asc" } },
        { week: { displayOrder: "asc" } },
        { package: { displayOrder: "asc" } },
      ],
      select: {
        id: true,
        campId: true,
        weekId: true,
        packageId: true,
        availabilityTag: true,
        isAvailable: true,
        camp: { select: { name: true } },
        week: { select: { label: true } },
        package: { select: { label: true } },
      },
    });

    const payload = rows.map((r) => ({
      id: r.id,
      campId: r.campId,
      campName: r.camp.name,
      weekId: r.weekId,
      weekLabel: r.week.label,
      packageId: r.packageId,
      packageLabel: r.package.label,
      availabilityTag: r.availabilityTag ?? "NA",
      isAvailable: r.isAvailable,
    }));

    return NextResponse.json(payload);
  } catch (error) {
    console.error("ADMIN AVAILABILITY GET ERROR", error);
    return NextResponse.json({ error: "Unable to load availability." }, { status: 500 });
  }
}