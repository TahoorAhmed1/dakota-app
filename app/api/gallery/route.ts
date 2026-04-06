import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/gallery — public gallery images
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const where: Record<string, unknown> = { isPublished: true };
  if (category) where.category = category;

  const images = await prisma.galleryImage.findMany({
    where,
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      url: true,
      alt: true,
      caption: true,
      category: true,
      width: true,
      height: true,
    },
  });

  return NextResponse.json(images);
}
