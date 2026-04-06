import { NextRequest, NextResponse } from "next/server";
import { assertAdminAccess } from "@/lib/server/admin-auth";
import { deleteFromCloudinary } from "@/lib/server/cloudinary";
import { prisma } from "@/lib/prisma";

// PATCH /api/admin/gallery/[id] — update image metadata
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = assertAdminAccess(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const allowed = ["alt", "caption", "category", "displayOrder", "isPublished"] as const;
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }

  if (!Object.keys(data).length) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const image = await prisma.galleryImage.update({
    where: { id },
    data,
  });

  return NextResponse.json(image);
}

// DELETE /api/admin/gallery/[id] — delete single image
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = assertAdminAccess(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;

  const image = await prisma.galleryImage.findUnique({ where: { id } });
  if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deleteFromCloudinary(image.publicId).catch(() => {});
  await prisma.galleryImage.delete({ where: { id } });

  return NextResponse.json({ deleted: true });
}
