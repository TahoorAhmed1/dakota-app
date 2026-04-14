import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCalculatorConfig } from "@/lib/server/calculator-data";
import { generateQuoteNumber } from "@/lib/server/quote-number";
import { quoteSubmitSchema } from "@/lib/server/quote-schemas";
import { calculateQuote } from "@/lib/server/quote-engine";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = quoteSubmitSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid quote payload.", details: parsed.error.flatten() },
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
    const quoteNumber = generateQuoteNumber();

    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        seasonLabel: payload.seasonLabel,
        campId: payload.campId,
        weekId: payload.weekId,
        packageId: payload.packageId,
        hunterCount: payload.hunterCount,
        earlyBird: payload.earlyBird,
        quoteEmail: payload.quoteEmail || null,
        bookingName: payload.bookingName,
        bookingEmail: payload.bookingEmail,
        subtotalBeforeTax: calculation.totals.subtotalBeforeTax,
        minimumAdjustment: calculation.totals.minimumAdjustment,
        taxAmount: calculation.totals.taxAmount,
        totalAmount: calculation.totals.totalAmount,
        depositRate: calculation.totals.depositRate,
        depositAmount: calculation.totals.depositTotal,
        hunters: {
          create: calculation.rows.map((row) => ({
            rowIndex: row.rowIndex,
            hunterName: row.name,
            discountCode: row.discountCode,
            extraDays: payload.hunters[row.rowIndex - 1]?.extraDays ?? 0,
            extraNights: payload.hunters[row.rowIndex - 1]?.extraNights ?? 0,
            baseRate: row.baseRate,
            volumeDiscount: row.volumeDiscount,
            extraHunting: row.extraHunting,
            extraLodging: row.extraLodging,
            earlyBirdDiscount: row.earlyBirdDiscount,
            adultDiscount: row.individualDiscount,
            juniorDiscount: row.juniorDiscount,
            subtotalBeforeTax: row.subtotalBeforeTax,
            taxAmount: row.taxAmount,
            totalAmount: row.totalAmount,
          })),
        },
      },
    });

    if (process.env.QUOTE_WEBHOOK_URL) {
      await fetch(process.env.QUOTE_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteId: quote.id,
          quoteNumber,
          payload,
          calculation,
        }),
      });
    }

    return NextResponse.json({
      success: true,
      quoteId: quote.id,
      quoteNumber,
      pdfUrl: `/api/quote/${quote.id}/pdf`,
      totals: calculation.totals,
      message: "Quote submitted successfully.",
    });
  } catch (error) {
    console.error("QUOTE SUBMISSION ERROR", error);
    return NextResponse.json(
      { error: "Unable to submit quote right now." },
      { status: 500 }
    );
  }
}