import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCalculatorConfig } from "@/lib/server/calculator-data";
import { generateQuoteNumber } from "@/lib/server/quote-number";
import { quoteSubmitSchema } from "@/lib/server/quote-schemas";
import { calculateQuote } from "@/lib/server/quote-engine";
import { createPayPalOrder } from "@/lib/server/paypal";

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
        paymentStatus: "PENDING",
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

    const baseUrl = 'https://dakota.craftiqstudio.com';
    const { approvalUrl, orderId } = await createPayPalOrder(
      calculation.totals.depositTotal,
      `${baseUrl}/api/quote/paypal/capture?quoteId=${quote.id}`,
      `${baseUrl}/quote-reserve?status=cancel&quoteId=${quote.id}`
    );

    await prisma.quote.update({
      where: { id: quote.id },
      data: {
        paypalOrderId: orderId,
      },
    });

    return NextResponse.json({
      success: true,
      approvalUrl,
      quoteId: quote.id,
      quoteNumber,
    });
  } catch (error) {
    console.error("PAYPAL CHECKOUT ERROR", error);
    return NextResponse.json(
      { error: "Unable to initialize PayPal checkout right now." },
      { status: 500 }
    );
  }
}
