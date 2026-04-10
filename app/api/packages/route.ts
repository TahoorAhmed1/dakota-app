import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const packages = await prisma.packageOption.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      select: {
        id: true,
        label: true,
        nights: true,
        days: true,
      },
    });

    const camps = await prisma.camp.findMany({
      where: { isActive: true },
      select: {
        name: true,
        pricingRows: {
          where: { isAvailable: true },
          select: { minGroupSize: true },
          orderBy: { minGroupSize: "asc" },
          take: 1,
        },
      },
      orderBy: { displayOrder: "asc" },
    });

    const minGroupData = camps
      .filter((camp) => camp.pricingRows.length > 0)
      .map((camp) => ({
        name: camp.name,
        minGroupSize: camp.pricingRows[0].minGroupSize,
      }));

    return NextResponse.json({ packages, minGroupData });
  } catch (error) {
    console.error("PACKAGES GET ERROR", error);
    return NextResponse.json({ packages: [], minGroupData: [] });
  }
}
