import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/gallery — public gallery images
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const where = category ? { category, isPublished: true } : { isPublished: true };

  const images = await prisma.galleryImage.findMany({
    where,
    orderBy: { displayOrder: "asc" },
  });


  return NextResponse.json(images);
}
