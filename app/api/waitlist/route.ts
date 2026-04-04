import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(50).optional().default(""),
  weekPref: z.string().max(200).optional().default(""),
  notes: z.string().max(1000).optional().default(""),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    await prisma.waitlistEntry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        weekPref: data.weekPref || null,
        notes: data.notes || null,
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
