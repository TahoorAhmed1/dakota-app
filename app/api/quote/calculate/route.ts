import { NextRequest, NextResponse } from "next/server";

import { getCalculatorConfig } from "@/lib/server/calculator-data";
import { calculateQuote } from "@/lib/server/quote-engine";
import { quoteCalculationSchema } from "@/lib/server/quote-schemas";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = quoteCalculationSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid quote calculation payload.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const payload = parsed.data;

    if (payload.hunters.length !== payload.hunterCount) {
      return NextResponse.json(
        { error: "Hunter count does not match hunter rows." },
        { status: 400 }
      );
    }

    const config = await getCalculatorConfig();
    const calculation = calculateQuote(payload, config);

    return NextResponse.json({ success: true, calculation });
  } catch (error) {
    console.error("QUOTE CALCULATE ERROR", error);
    return NextResponse.json(
      { error: "Unable to calculate quote." },
      { status: 500 }
    );
  }
}
