import { NextRequest } from "next/server";

export function assertAdminAccess(req: NextRequest): { ok: true } | { ok: false; status: number; error: string } {
  const expectedKey = process.env.ADMIN_API_KEY;

  // Allow local admin use without key when not configured.
  if (!expectedKey) {
    return { ok: true };
  }

  const provided = req.headers.get("x-admin-key");

  if (!provided || provided !== expectedKey) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  return { ok: true };
}
