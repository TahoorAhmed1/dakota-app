import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { getCalculatorConfig } from "@/lib/server/calculator-data";

export async function GET() {
  try {
    const config = await getCalculatorConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error("CALCULATOR CONFIG ERROR", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2024") {
      return NextResponse.json(
        { error: "Calculator configuration is temporarily unavailable. Please try again." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Unable to load calculator configuration." },
      { status: 500 }
    );
  }
}
