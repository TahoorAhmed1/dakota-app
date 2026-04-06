import { NextRequest, NextResponse } from "next/server";

import { assertAdminAccess } from "@/lib/server/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  assertAdminAccess(req);
  const entries = await prisma.waitlistEntry.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(entries);
}
