import { NextResponse } from "next/server";

import { getCalculatorConfig } from "@/lib/server/calculator-data";

export async function GET() {
  try {
    const config = await getCalculatorConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error("CALCULATOR CONFIG ERROR", error);
    return NextResponse.json(
      { error: "Unable to load calculator configuration." },
      { status: 500 }
    );
  }
}
