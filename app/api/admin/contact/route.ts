import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { assertAdminAccess } from "@/lib/server/admin-auth";

export async function GET(req: NextRequest) {
  const auth = assertAdminAccess(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const subscribers = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(subscribers);
  } catch {
    return NextResponse.json({ error: "Failed to fetch newsletter subscribers" }, { status: 500 });
  }
}