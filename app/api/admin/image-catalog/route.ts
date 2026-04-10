import { NextRequest, NextResponse } from "next/server";
import { assertAdminAccess } from "@/lib/server/admin-auth";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/server/cloudinary";
import { prisma } from "@/lib/prisma";

// GET /api/admin/image-catalog — list all catalog images
export async function GET(req: NextRequest) {
  const auth = assertAdminAccess(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const images = await prisma.imageCatalog.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(images);
}

// POST /api/admin/image-catalog — upload image(s)
// Accepts multipart/form-data with field "files" (one or more)
// OR JSON body with { url: string } for URL-based upload
export async function POST(req: NextRequest) {
  const auth = assertAdminAccess(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const contentType = req.headers.get("content-type") ?? "";

  // ---------- URL upload ----------
  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => null);
    if (!body?.url || typeof body.url !== "string") {
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }

    try {
      const result = await uploadToCloudinary(body.url, {
        folder: body.folder || "dakota-app/image-catalog",
      });

      const image = await prisma.imageCatalog.create({
        data: {
          publicId: result.publicId,
          url: result.url,
          alt: body.alt ?? "",
          caption: body.caption ?? "",
          category: body.category ?? "catalog",
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        },
      });

      return NextResponse.json(image, { status: 201 });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  // ---------- File upload (multipart) ----------
  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const category = (formData.get("category") as string) ?? "catalog";

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

    const uploaded: Array<Record<string, unknown>> = [];
    const errors: Array<{ name: string; error: string }> = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push({ name: file.name, error: `Unsupported type: ${file.type}` });
        continue;
      }
      if (file.size > MAX_SIZE) {
        errors.push({ name: file.name, error: "File exceeds 10 MB limit" });
        continue;
      }

      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await uploadToCloudinary(buffer, {
          folder: "dakota-app/image-catalog",
        });

        const image = await prisma.imageCatalog.create({
          data: {
            publicId: result.publicId,
            url: result.url,
            alt: "",
            caption: "",
            category,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
          },
        });

        uploaded.push(image);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        errors.push({ name: file.name, error: message });
      }
    }

    return NextResponse.json({ uploaded, errors }, { status: uploaded.length ? 201 : 400 });
  }

  return NextResponse.json({ error: "Unsupported Content-Type" }, { status: 400 });
}

// PUT /api/admin/image-catalog — update image
// Body: { id: string, ...updates }
export async function PUT(req: NextRequest) {
  const auth = assertAdminAccess(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await req.json().catch(() => null);
  if (!body?.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { id, ...updates } = body;

  try {
    const image = await prisma.imageCatalog.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(image);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/admin/image-catalog — bulk delete
// Body: { ids: string[] }
export async function DELETE(req: NextRequest) {
  const auth = assertAdminAccess(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await req.json().catch(() => null);
  if (!body?.ids || !Array.isArray(body.ids) || !body.ids.length) {
    return NextResponse.json({ error: "Missing ids array" }, { status: 400 });
  }

  const images = await prisma.imageCatalog.findMany({
    where: { id: { in: body.ids } },
  });

  // Delete from Cloudinary
  const deleteResults = await Promise.allSettled(
    images.map((img) => deleteFromCloudinary(img.publicId))
  );

  // Delete from database regardless of Cloudinary outcome
  await prisma.imageCatalog.deleteMany({
    where: { id: { in: body.ids } },
  });

  const failed = deleteResults.filter((r) => r.status === "rejected").length;

  return NextResponse.json({
    deleted: images.length,
    cloudinaryErrors: failed,
  });
}