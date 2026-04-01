import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ quoteId: string }>;
};

export async function GET(_req: Request, { params }: Params) {
  try {
    const { quoteId } = await params;

    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        camp: true,
        week: true,
        package: true,
        hunters: {
          orderBy: { rowIndex: "asc" },
        },
      },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found." }, { status: 404 });
    }

    const pdf = await PDFDocument.create();
    const page = pdf.addPage([612, 792]);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

    let y = 760;
    const drawLine = (text: string, opts?: { bold?: boolean; size?: number }) => {
      const size = opts?.size ?? 10;
      page.drawText(text, {
        x: 50,
        y,
        size,
        font: opts?.bold ? boldFont : font,
        color: rgb(0.1, 0.1, 0.1),
      });
      y -= size + 6;
    };

    drawLine(`Quote ${quote.quoteNumber}`, { bold: true, size: 16 });
    drawLine(`Created: ${quote.createdAt.toISOString()}`);
    drawLine(`Booking Name: ${quote.bookingName}`);
    drawLine(`Booking Email: ${quote.bookingEmail}`);
    drawLine(`Camp: ${quote.camp.name}`);
    drawLine(`Week: ${quote.week.label}`);
    drawLine(`Package: ${quote.package.label}`);
    drawLine(`Hunters: ${quote.hunterCount}`);
    drawLine(`Early Bird: ${quote.earlyBird ? "Yes" : "No"}`);
    y -= 8;
    drawLine("Totals", { bold: true, size: 12 });
    drawLine(`Subtotal before tax: $${Number(quote.subtotalBeforeTax).toFixed(2)}`);
    drawLine(`Minimum adjustment: $${Number(quote.minimumAdjustment).toFixed(2)}`);
    drawLine(`Tax: $${Number(quote.taxAmount).toFixed(2)}`);
    drawLine(`Grand Total: $${Number(quote.totalAmount).toFixed(2)}`);
    drawLine(`Deposit: $${Number(quote.depositTotal).toFixed(2)}`);

    y -= 8;
    drawLine("Hunter Rows", { bold: true, size: 12 });

    quote.hunters.slice(0, 20).forEach((hunter: (typeof quote.hunters)[number]) => {
      drawLine(
        `${hunter.rowIndex}. ${hunter.hunterName || `Hunter ${hunter.rowIndex}`} | Discount ${hunter.discountCode} | Total $${Number(hunter.totalAmount).toFixed(2)}`
      );
    });

    const bytes = await pdf.save();

    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=quote-${quote.quoteNumber}.pdf`,
      },
    });
  } catch (error) {
    console.error("QUOTE PDF ERROR", error);
    return NextResponse.json({ error: "Unable to generate quote PDF." }, { status: 500 });
  }
}
