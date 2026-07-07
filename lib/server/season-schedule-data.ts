import { prisma } from "@/lib/prisma";
import type { SeasonScheduleData } from "@/components/common/seasonSchedule";

type CampStatus = "available" | "pending" | "sold";

function formatWeekDateRange(startDate: Date | null, endDate: Date | null, fallbackLabel: string) {
  if (!startDate || !endDate) return fallbackLabel;

  const sameYear = startDate.getUTCFullYear() === endDate.getUTCFullYear();
  const fmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: sameYear ? undefined : "numeric",
    timeZone: "UTC",
  });

  return `${fmt.format(startDate)} – ${fmt.format(endDate)}`;
}

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

    const year = week.startDate?.getUTCFullYear() ?? week.endDate?.getUTCFullYear() ?? new Date().getUTCFullYear();
    const date = formatWeekDateRange(week.startDate, week.endDate, week.seasonLabel);

    return {
      week: week.label,
      date,
      year,
      price: priceMap.get(week.id),
      campStatuses,
      campHoverTexts,
      mobileCamps,
    };
  });

  const groupedRows = rows.reduce<Record<number, typeof rows>>((acc, row) => {
    const year = row.year ?? new Date().getUTCFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(row);
    return acc;
  }, {});

  const groups = Object.entries(groupedRows)
    .map(([year, yearRows]) => ({
      year: Number(year),
      rows: yearRows,
    }))
    .sort((a, b) => a.year - b.year);

  const tableHeaders = [
    "Weeks In Season",
    "UGUIDE Season Schedule",
    ...campNames,
    "Rate + Tax *",
  ];

  return { rows, groups, campNames, tableHeaders };
}
