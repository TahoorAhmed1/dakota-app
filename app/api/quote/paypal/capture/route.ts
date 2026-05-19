import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { capturePayPalOrder } from "@/lib/server/paypal";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get("token");
    const quoteId = url.searchParams.get("quoteId");

    if (!orderId || !quoteId) {
      const redirectUrl = `${url.origin}/quote-reserve/paypal-confirmation?status=error&message=Missing+PayPal+token+or+quote+reference.`;
      return NextResponse.redirect(redirectUrl);
    }

    const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
    if (!quote) {
      const redirectUrl = `${url.origin}/quote-reserve/paypal-confirmation?status=error&message=Quote+not+found.`;
      return NextResponse.redirect(redirectUrl);
    }

    if (quote.paypalOrderId && quote.paypalOrderId !== orderId) {
      const redirectUrl = `${url.origin}/quote-reserve/paypal-confirmation?status=error&message=PayPal+token+does+not+match+quote+record.`;
      return NextResponse.redirect(redirectUrl);
    }

    if (quote.paymentStatus === "PAID") {
      const redirectUrl = `${url.origin}/quote-reserve/paypal-confirmation?status=success&quoteNumber=${quote.quoteNumber}`;
      return NextResponse.redirect(redirectUrl);
    }

    const captureResult = await capturePayPalOrder(orderId);
    if (captureResult.status !== "COMPLETED") {
      const redirectUrl = `${url.origin}/quote-reserve/paypal-confirmation?status=error&message=PayPal+checkout+was+not+completed.`;
      return NextResponse.redirect(redirectUrl);
    }

    await prisma.quote.update({
      where: { id: quote.id },
      data: {
        paymentStatus: "PAID",
        paypalOrderId: orderId,
        depositPaidAt: new Date(),
      },
    });

    const redirectUrl = `${url.origin}/quote-reserve/paypal-confirmation?status=success&quoteNumber=${quote.quoteNumber}`;
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("PAYPAL CAPTURE ERROR", error);
    const url = new URL(req.url);
    const redirectUrl = `${url.origin}/quote-reserve/paypal-confirmation?status=error&message=Unable+to+capture+PayPal+payment.`;
    return NextResponse.redirect(redirectUrl);
  }
}
