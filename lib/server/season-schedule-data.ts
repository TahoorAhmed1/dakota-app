import { prisma } from "@/lib/prisma";
import type { SeasonScheduleData } from "@/components/common/seasonSchedule";

type CampStatus = "available" | "pending" | "sold";

export async function getSeasonScheduleData(): Promise<SeasonScheduleData> {
  const [camps, weeks, pricingRows] = await Promise.all([
    prisma.camp.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.huntWeek.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.campWeekPricing.findMany({
      select: {
        campId: true,
        weekId: true,
        baseRate: true,
        isAvailable: true,
        availabilityTag: true,
        hoverText: true,
      },
    }),
  ]);

  // weekId:campId => best status (available > pending > sold) + hoverText
  const statusMap = new Map<string, CampStatus>();
  const hoverTextMap = new Map<string, string>();

  for (const row of pricingRows) {
    const key = `${row.weekId}:${row.campId}`;
    const existing = statusMap.get(key);

    let status: CampStatus;
    if (row.availabilityTag === "PENDING") {
      status = "pending";
    } else if (row.isAvailable && row.availabilityTag !== "RESERVED") {
      status = "available";
    } else {
      status = "sold";
    }

    // Upgrade: available > pending > sold
    if (
      !existing ||
      (existing === "sold" && (status === "available" || status === "pending")) ||
      (existing === "pending" && status === "available")
    ) {
      statusMap.set(key, status);
      if (row.hoverText) hoverTextMap.set(key, row.hoverText);
    }
  }

  // weekId => min base rate
  const priceMap = new Map<string, number>();
  for (const row of pricingRows) {
    const rate = Number(row.baseRate);
    const existing = priceMap.get(row.weekId);
    if (existing === undefined || rate < existing) {
      priceMap.set(row.weekId, rate);
    }
  }

  const campNames = camps.map((c) => c.name);

  const rows = weeks.map((week) => {
    const campStatuses = camps.map(
      (camp) => (statusMap.get(`${week.id}:${camp.id}`) ?? "sold") as CampStatus
    );

    const campHoverTexts = camps.map((camp) =>
      hoverTextMap.get(`${week.id}:${camp.id}`)
    );

    const mobileCamps = camps.map((camp, idx) => ({
      name: camp.name,
      status: campStatuses[idx],
      hoverText: campHoverTexts[idx],
    }));

    // Format date range
    let date = week.seasonLabel;
    if (week.startDate && week.endDate) {
      const fmtShort = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      });
      const fmtLong = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      });
      date = `${fmtShort.format(week.startDate)}–${fmtLong.format(week.endDate)}`;
    }

    return {
      week: week.label,
      date,
      price: priceMap.get(week.id),
      campStatuses,
      campHoverTexts,
      mobileCamps,
    };
  });

  const tableHeaders = [
    "Weeks In Season",
    "UGUIDE Season Schedule",
    ...campNames,
    "Rate + Tax *",
  ];

  return { rows, campNames, tableHeaders };
}
