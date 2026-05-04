export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const images = await prisma.imageCatalog.findMany({
    where: { isPublished: true },
  });
  return NextResponse.json(images);
}
