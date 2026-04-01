import { NextRequest, NextResponse } from "next/server";

import { getCalculatorConfig } from "@/lib/server/calculator-data";
import { calculateQuickQuote } from "@/lib/server/quote-engine";
import { quickQuoteSchema } from "@/lib/server/quote-schemas";

export async function POST(req: NextRequest) {
  try {
    const parsed = quickQuoteSchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid quick quote request.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const config = await getCalculatorConfig();
    const result = calculateQuickQuote(config, parsed.data);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("QUICK QUOTE ERROR", error);
    return NextResponse.json({ error: "Unable to generate quick quote." }, { status: 500 });
  }
}
