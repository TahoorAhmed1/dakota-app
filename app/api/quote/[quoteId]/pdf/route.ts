import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ quoteId: string }>;
};

// ─── Theme ────────────────────────────────────────────────────────────────────
const ORANGE      = rgb(0.95, 0.45, 0.05);   
const DARK_ORANGE = rgb(0.75, 0.32, 0.02);   // #BF5205
const BLACK       = rgb(0.08, 0.08, 0.08);   // #141414
const DARK_GRAY   = rgb(0.25, 0.25, 0.25);   // #404040
const MID_GRAY    = rgb(0.55, 0.55, 0.55);   // #8C8C8C
const LIGHT_GRAY  = rgb(0.93, 0.93, 0.93);   // #EDEDED
const WHITE       = rgb(1, 1, 1);
const PAGE_W      = 612;
const PAGE_H      = 792;
const MARGIN      = 48;
const COL_W       = PAGE_W - MARGIN * 2;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function drawRect(
  page: ReturnType<PDFDocument["addPage"]>,
  x: number, y: number, w: number, h: number,
  color: ReturnType<typeof rgb>,
) {
  page.drawRectangle({ x, y, width: w, height: h, color });
}

function fmt(n: unknown) {
  return `$${Number(n).toFixed(2)}`;
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const { quoteId } = await params;

    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        camp:    true,
        week:    true,
        package: true,
        hunters: { orderBy: { rowIndex: "asc" } },
      },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found." }, { status: 404 });
    }

    // ── Document setup ──────────────────────────────────────────────────────
    const pdf  = await PDFDocument.create();
    const page = pdf.addPage([PAGE_W, PAGE_H]);

    const regular = await pdf.embedFont(StandardFonts.Helvetica);
    const bold    = await pdf.embedFont(StandardFonts.HelveticaBold);

    // ── Header band ─────────────────────────────────────────────────────────
    drawRect(page, 0, PAGE_H - 90, PAGE_W, 90, BLACK);

    // Accent stripe at very top
    drawRect(page, 0, PAGE_H - 6, PAGE_W, 6, ORANGE);

    // Company / brand label (top-left)
    page.drawText("HUNT BOOKING SYSTEM", {
      x: MARGIN, y: PAGE_H - 38,
      size: 9, font: regular, color: MID_GRAY,
    });

    // "QUOTE" large label
    page.drawText("QUOTE", {
      x: MARGIN, y: PAGE_H - 66,
      size: 26, font: bold, color: WHITE,
    });

    // Quote number badge (top-right)
    const badgeLabel = `#${quote.quoteNumber}`;
    const badgeW     = bold.widthOfTextAtSize(badgeLabel, 14) + 24;
    const badgeX     = PAGE_W - MARGIN - badgeW;
    drawRect(page, badgeX, PAGE_H - 72, badgeW, 28, ORANGE);
    page.drawText(badgeLabel, {
      x: badgeX + 12, y: PAGE_H - 62,
      size: 14, font: bold, color: WHITE,
    });

    // ── Meta row (date / status) ─────────────────────────────────────────────
    const metaY = PAGE_H - 102;
    page.drawText("DATE ISSUED", {
      x: MARGIN, y: metaY,
      size: 7, font: regular, color: MID_GRAY,
    });
    page.drawText(
      new Date(quote.createdAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      }),
      { x: MARGIN, y: metaY - 13, size: 10, font: bold, color: BLACK },
    );

    page.drawText("EARLY BIRD", {
      x: MARGIN + 140, y: metaY,
      size: 7, font: regular, color: MID_GRAY,
    });
    const ebLabel = quote.earlyBird ? "YES" : "NO";
    const ebColor = quote.earlyBird ? ORANGE : DARK_GRAY;
    page.drawText(ebLabel, {
      x: MARGIN + 140, y: metaY - 13,
      size: 10, font: bold, color: ebColor,
    });

    // ── Section: Booking Details ─────────────────────────────────────────────
    let y = PAGE_H - 152;

    const sectionHeader = (label: string) => {
      drawRect(page, MARGIN, y - 2, COL_W, 22, ORANGE);
      page.drawText(label.toUpperCase(), {
        x: MARGIN + 8, y: y + 5,
        size: 9, font: bold, color: WHITE,
      });
      y -= 26;
    };

    const infoRow = (
      label: string, value: string,
      opts?: { valueColor?: ReturnType<typeof rgb>; shade?: boolean },
    ) => {
      if (opts?.shade) drawRect(page, MARGIN, y - 4, COL_W, 18, LIGHT_GRAY);
      page.drawText(label, {
        x: MARGIN + 6, y,
        size: 9, font: regular, color: MID_GRAY,
      });
      page.drawText(value, {
        x: MARGIN + 180, y,
        size: 9, font: bold, color: opts?.valueColor ?? BLACK,
      });
      y -= 18;
    };

    // Thin divider helper
    const divider = () => {
      page.drawLine({
        start: { x: MARGIN, y },
        end:   { x: MARGIN + COL_W, y },
        thickness: 0.4,
        color: LIGHT_GRAY,
      });
      y -= 6;
    };

    // ── Booking Details block ────────────────────────────────────────────────
    sectionHeader("Booking Details");
    infoRow("Booking Name",  quote.bookingName,  { shade: true });
    infoRow("Booking Email", quote.bookingEmail);
    infoRow("Camp",          quote.camp.name,    { shade: true });
    infoRow("Week",          quote.week.label);
    infoRow("Package",       quote.package.label, { shade: true });
    infoRow("Number of Hunters", String(quote.hunterCount));
    y -= 10;

    // ── Financial Summary block ──────────────────────────────────────────────
    sectionHeader("Financial Summary");
    infoRow("Subtotal (before tax)", fmt(quote.subtotalBeforeTax), { shade: true });
    infoRow("Minimum Adjustment",    fmt(quote.minimumAdjustment));
    infoRow("Tax Amount",            fmt(quote.taxAmount), { shade: true });
    infoRow("Deposit Required",      fmt(quote.depositAmount));
    y -= 4;

    // Grand total highlight bar
    drawRect(page, MARGIN, y - 6, COL_W, 28, BLACK);
    page.drawText("GRAND TOTAL", {
      x: MARGIN + 8, y: y + 7,
      size: 10, font: bold, color: MID_GRAY,
    });
    page.drawText(fmt(quote.totalAmount), {
      x: PAGE_W - MARGIN - bold.widthOfTextAtSize(fmt(quote.totalAmount), 14) - 10,
      y: y + 5,
      size: 14, font: bold, color: ORANGE,
    });
    y -= 38;

    // ── Hunter Roster ────────────────────────────────────────────────────────
    if (quote.hunters.length > 0) {
      y -= 6;
      sectionHeader(`Hunter Roster  (${quote.hunters.length})`);

      // Table header row
      drawRect(page, MARGIN, y - 4, COL_W, 18, DARK_GRAY);
      const cols = { idx: 6, name: 30, discount: 270, total: 410 };
      const headerItems: [string, number][] = [
        ["#",            cols.idx],
        ["Hunter Name",  cols.name],
        ["Discount Code",cols.discount],
        ["Total",        cols.total],
      ];
      for (const [label, cx] of headerItems) {
        page.drawText(label, {
          x: MARGIN + cx, y,
          size: 8, font: bold, color: WHITE,
        });
      }
      y -= 20;

      const maxRows = Math.min(quote.hunters.length, 22);
      quote.hunters.slice(0, maxRows).forEach(
        (h: (typeof quote.hunters)[number], i: number) => {
          const shade = i % 2 === 0;
          if (shade) drawRect(page, MARGIN, y - 4, COL_W, 16, LIGHT_GRAY);

          const nameLabel     = h.hunterName || `Hunter ${h.rowIndex}`;
          const discountLabel = h.discountCode || "—";
          const totalLabel    = fmt(h.totalAmount);

          page.drawText(String(h.rowIndex), {
            x: MARGIN + cols.idx, y,
            size: 8, font: regular, color: DARK_GRAY,
          });
          page.drawText(nameLabel, {
            x: MARGIN + cols.name, y,
            size: 8, font: regular, color: BLACK,
          });
          page.drawText(discountLabel, {
            x: MARGIN + cols.discount, y,
            size: 8, font: regular,
            color: discountLabel !== "—" ? DARK_ORANGE : MID_GRAY,
          });
          page.drawText(totalLabel, {
            x: MARGIN + cols.total, y,
            size: 8, font: bold, color: BLACK,
          });
          y -= 16;
        },
      );

      if (quote.hunters.length > maxRows) {
        page.drawText(
          `+ ${quote.hunters.length - maxRows} more hunters not shown`,
          { x: MARGIN, y, size: 8, font: regular, color: MID_GRAY },
        );
        y -= 14;
      }
    }

    // ── Footer band ──────────────────────────────────────────────────────────
    const footerH = 36;
    drawRect(page, 0, 0, PAGE_W, footerH, BLACK);
    drawRect(page, 0, footerH - 2, PAGE_W, 2, ORANGE);

    page.drawText("This document is system-generated and valid without a signature.", {
      x: MARGIN, y: 14,
      size: 7, font: regular, color: MID_GRAY,
    });
    page.drawText(`Quote ${quote.quoteNumber}`, {
      x: PAGE_W - MARGIN - bold.widthOfTextAtSize(`Quote ${quote.quoteNumber}`, 8),
      y: 14,
      size: 8, font: bold, color: ORANGE,
    });

    // ── Output ───────────────────────────────────────────────────────────────
    const bytes = await pdf.save();
    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type":        "application/pdf",
        "Content-Disposition": `attachment; filename=quote-${quote.quoteNumber}.pdf`,
      },
    });
  } catch (error) {
    console.error("QUOTE PDF ERROR", error);
    return NextResponse.json({ error: "Unable to generate quote PDF." }, { status: 500 });
  }
}