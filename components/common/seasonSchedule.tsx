"use client"
import React, { useState, useRef } from "react";
import CampingExp from "./camping-exp";

/* ---------------- DATA ---------------- */

type CampStatusType = "sold" | "pending" | "available";

type SeasonRow = {
  week: string;
  /**
   * Optional explicit override, e.g. "Oct 17–19" or a special label like
   * "Thanksgiving Week". If omitted, the date range is calculated
   * automatically from the year group's `seasonStartDate` + the row's
   * position in the season (see `getRowDateLabel`).
   */
  date?: string;
  year?: number;
  price?: number;
  campStatuses?: CampStatusType[];
  campHoverTexts?: (string | undefined)[];
  mobileCamps?: {
    name: string;
    status: CampStatusType;
    label?: string;
    hoverText?: string;
  }[];
};

export type SeasonScheduleYearGroup = {
  year: number;
  /**
   * ISO date (YYYY-MM-DD) of the check-in day for Week 1 of this year's
   * season. Every subsequent week is assumed to start 7 days later. This is
   * what lets the "UGUIDE Season Schedule" column show real dates
   * (e.g. "Oct 15–17") instead of the year repeated on every row.
   */
  seasonStartDate?: string;
  /**
   * How many days each week's date range spans, e.g. 7 for a full
   * "Week 1: Oct 15–21" style block. Defaults to 7. Override to 3 (or any
   * number) only if a specific week should display a shorter stay window
   * instead of the full week.
   */
  dateSpanDays?: number;
  rows: SeasonRow[];
};

export type SeasonScheduleData = {
  welcomeLabel?: string;
  heading?: string;
  description?: string;
  rows?: SeasonRow[];
  groups?: SeasonScheduleYearGroup[];
  campNames?: string[];
  tableTopLeftHeader?: string;
  tableTopMiddleHeader?: string;
  tableTopRightHeader?: string;
  tableHeaders?: string[];
  pricingFootnote?: string;
  legendReservedText?: string;
  legendPendingText?: string;
  legendAvailableText?: string;
  /**
   * How many upcoming season years to show at once. Defaults to 2 (current
   * season + next season / waitlist). Older years drop off automatically
   * once the calendar rolls past them.
   */
  yearsToShow?: number;
  campingExpData?: {
    eyebrow?: string;
    titlePrefix?: string;
    titleHighlight?: string;
    description?: string;
    primaryCtaLabel?: string;
    primaryCtaHref?: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
    imageAlt?: string;
    imageUrl?: string;
  };
};

const DUMMY_CAMP_NAMES = [
  "Faulkton Pheasant Camp",
  "Gunner's Haven Pheasant Camp",
  "Meadow Creek Pheasant Camp",
  "Pheasant Camp Lodge",
  "West River Adventures Pheasant Camp",
];

const DUMMY_TABLE_HEADERS = [
  "Weeks In Season",
  "UGUIDE Season Schedule",
  "Faulkton Pheasant Camp",
  "Gunner's Haven Pheasant Camp",
  "Meadow Creek Pheasant Camp",
  "Pheasant Camp Lodge",
  "West River Adventures Pheasant Camp",
  "Rate + Tax *",
];

// Matches the pricing the client provided for the two seasons currently on
// file. `seasonStartDate` is the Week 1 check-in date for that year — change
// this one value each year and every date range in the grid recalculates.
const DUMMY_GROUPS: SeasonScheduleYearGroup[] = [
  {
    year: 2026,
    seasonStartDate: "2026-10-15",
    rows: [
      { week: "Week 1", price: 1749 },
      { week: "Week 2", price: 1649 },
      { week: "Week 3", price: 1549 },
      { week: "Week 4", price: 1449 },
      { week: "Week 5", price: 1449 },
      { week: "Week 6", price: 1449 },
      { week: "Week 7", price: 1449 },
      { week: "Week 8", price: 1299 },
      { week: "Week 9", price: 999 },
    ],
  },
  {
    year: 2027,
    seasonStartDate: "2027-10-14",
    rows: [
      { week: "Week 1", price: 1799 },
      { week: "Week 2", price: 1649 },
      { week: "Week 3", price: 1549 },
      { week: "Week 4", price: 1449 },
      { week: "Week 5", price: 1449 },
      { week: "Week 6", price: 1449 },
      { week: "Week 7", price: 1449 },
      { week: "Week 8", price: 1299 },
      { week: "Week 9", price: 999 },
    ],
  },
];

const DUMMY_DATA: Required<
  Omit<
    SeasonScheduleData,
    "rows" | "groups" | "campNames" | "tableHeaders" | "campingExpData" | "yearsToShow"
  >
> = {
  welcomeLabel: "Welcome",
  heading: "UGUIDE South Dakota Pheasant Hunting",
  description:
    "Welcome to UGUIDE South Dakota Pheasant Hunting. The ultimate leader in unguided South Dakota pheasant hunting. Your best option for fair chase, private-exclusive, self-guided and unguided South Dakota Pheasant Hunting. Wild reared pheasants only!",
  tableTopLeftHeader: "Season Schedule",
  tableTopMiddleHeader: "Camps",
  tableTopRightHeader: "Pricing",
  pricingFootnote: "Based on 4-nights lodging, 3-days Hunting Per Person *",
  legendReservedText: "= Pheasant Camp Hunt RESERVED",
  legendPendingText: "= Pheasant Camp Hunt PENDING (0)",
  legendAvailableText: "= Pheasant Camp Hunt AVAILABLE (4)",
};

/* ---------------- DATE HELPERS ---------------- */

const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Builds a human friendly date range for a given week index (0-based), e.g.
 * "Oct 15–21" or "Oct 29–Nov 4" when the week crosses a month boundary.
 */
function formatWeekDateRange(seasonStartISO: string, weekIndex: number, spanDays = 7): string {
  const start = addDays(parseISODate(seasonStartISO), weekIndex * 7);
  const end = addDays(start, Math.max(spanDays - 1, 0));

  const startMonth = MONTH_ABBR[start.getMonth()];
  const endMonth = MONTH_ABBR[end.getMonth()];

  return startMonth === endMonth
    ? `${startMonth} ${start.getDate()}–${end.getDate()}`
    : `${startMonth} ${start.getDate()}–${endMonth} ${end.getDate()}`;
}

/**
 * Resolves what to display in the "UGUIDE Season Schedule" column for a row.
 * An explicit `row.date` always wins (useful for one-off labels like
 * "Thanksgiving Week"); otherwise it's calculated from the group's
 * `seasonStartDate` so every week gets its own real date range instead of
 * the year repeated on every line.
 */
function getRowDateLabel(row: SeasonRow, group: SeasonScheduleYearGroup, rowIdx: number): string {
  if (row.date) return row.date;
  if (group.seasonStartDate) {
    return formatWeekDateRange(group.seasonStartDate, rowIdx, group.dateSpanDays ?? 7);
  }
  return row.week;
}

/* ---------------- STATUS DOT ---------------- */

const StatusDot = ({ type }: { type: "sold" | "pending" | "available" }) => {
  return (
    <>
      {type !== "available" ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_21_648)">
            <circle cx="12" cy="11.9999" r="9" stroke="#F16724" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 10L10 14" stroke="#F16724" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 10L14 14" stroke="#F16724" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0_21_648">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="11.9999" r="9" fill="#29B100" stroke="#29B100" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 10L11 14L9 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </>
  );
};

/* ---------------- TOOLTIP DOT ---------------- */

function TooltipDot({ type, hoverText }: { type: "sold" | "pending" | "available"; hoverText?: string }) {
  if (!hoverText) return <StatusDot type={type} />;
  return (
    <div className="group relative flex items-center justify-center">
      <StatusDot type={type} />
      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-48 -translate-x-1/2 scale-95 rounded-xl bg-[#2b1a0e] px-3 py-2 text-center text-xs leading-snug text-white opacity-0 shadow-xl transition-all group-hover:scale-100 group-hover:opacity-100">
        {hoverText}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#2b1a0e]" />
      </div>
    </div>
  );
}

/* ---------------- MOBILE HELPERS ---------------- */

function getCampStatus(campIdx: number, rowIdx: number): "sold" | "available" {
  if (campIdx === 0) return "sold";
  if (campIdx === 1) return rowIdx % 2 === 0 ? "available" : "sold";
  if (campIdx === 2) return "sold";
  if (campIdx === 3) return rowIdx % 3 === 0 ? "available" : "sold";
  return "available";
}

/* ---------------- MOBILE CAROUSEL ---------------- */

function MobileCarousel({
  rows,
  dateLabels,
  getMobileCampEntries,
}: {
  rows: SeasonRow[];
  dateLabels: string[];
  getMobileCampEntries: (row: SeasonRow, rowIdx: number) => {
    name: string;
    status: CampStatusType;
    label?: string;
    hoverText?: string;
  }[];
}) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goTo = (idx: number) =>
    setCurrent(Math.max(0, Math.min(rows.length - 1, idx)));

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  return (
    <div className="md:hidden">
      {/* Track */}
      <div
        className="overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {rows.map((row, i) => {
            const camps = getMobileCampEntries(row, i);
            return (
              <div key={i} className="min-w-full px-1">
                <div className="overflow-hidden rounded-xl border-2 border-[#3a2b20] bg-white">
                  <div className="flex items-center justify-between bg-[#6b3b16] px-4 py-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-300">
                      {row.week}
                    </span>
                    <span className="text-sm font-bold text-white">
                      ${row.price ?? 1299 + i * 100}
                    </span>
                  </div>
                  <div className="px-4 py-3">
                    <p className="mb-3 text-[13px] font-medium text-[#4a3b2f]">{dateLabels[i] || row.week}</p>
                    <div className="space-y-2">
                      {camps.map((camp) => {
                        const status = camp.status;
                        const statusLabel =
                          camp.label ??
                          (status === "available"
                            ? "Available"
                            : status === "pending"
                            ? "Pending"
                            : "Sold Out");
                        return (
                          <div
                            key={camp.name}
                            className="flex items-center justify-between"
                            title={camp.hoverText || undefined}
                          >
                            <span className="text-[13px] font-medium text-[#3c2f23]">
                              {camp.name}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                status === "available"
                                  ? "bg-green-50 text-green-700"
                                  : status === "pending"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-red-50 text-red-600"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  status === "available"
                                    ? "bg-green-500"
                                    : status === "pending"
                                    ? "bg-blue-500"
                                    : "bg-red-400"
                                }`}
                              />
                              {statusLabel}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          aria-label="Previous week"
          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#3a2b20] bg-[#6b3b16] text-white disabled:opacity-30 transition-opacity"
        >
          ‹
        </button>

        <div className="flex items-center gap-1.5">
          {rows.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to week ${i + 1}`}
              className={`rounded-full transition-all duration-200 ${
                i === current
                  ? "h-2.5 w-2.5 scale-110 bg-[#6b3b16]"
                  : "h-2 w-2 bg-[#c8a98a]"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(current + 1)}
          disabled={current === rows.length - 1}
          aria-label="Next week"
          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#3a2b20] bg-[#6b3b16] text-white disabled:opacity-30 transition-opacity"
        >
          ›
        </button>
      </div>

      {/* Counter */}
      <p className="mt-2 text-center text-xs text-[#7a5c44]">
        {current + 1} / {rows.length}
      </p>
    </div>
  );
}

/* ---------------- YEAR GROUP HELPERS ---------------- */

// Fallback path: if the caller only passes a flat `rows` array (legacy
// shape) instead of `groups`, bucket them by `row.year` the same way the
// original component did.
function getScheduleGroupsFromFlatRows(rows: SeasonRow[]): SeasonScheduleYearGroup[] {
  const grouped = new Map<number, SeasonRow[]>();

  rows.forEach((row) => {
    const year = row.year ?? new Date().getFullYear();
    const existing = grouped.get(year) ?? [];
    existing.push(row);
    grouped.set(year, existing);
  });

  return Array.from(grouped.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, yearRows]) => ({ year, rows: yearRows }));
}

/**
 * Keeps only the current season year and the following one(s), so the grid
 * stays relevant as the calendar rolls forward. Concretely: once it's 2028,
 * a leftover 2026 group in the data source will simply stop rendering
 * without needing any manual cleanup — just append a 2028 group whenever
 * it's ready.
 */
function getVisibleYearGroups(
  groups: SeasonScheduleYearGroup[],
  referenceDate: Date,
  yearsToShow: number
): SeasonScheduleYearGroup[] {
  const currentYear = referenceDate.getFullYear();
  return groups
    .filter((g) => g.year >= currentYear)
    .sort((a, b) => a.year - b.year)
    .slice(0, yearsToShow);
}

/* ---------------- COMPONENT ---------------- */

export default function SeasonSchedule({ data }: { data?: SeasonScheduleData }) {
  const campNames = data?.campNames?.length ? data.campNames : DUMMY_CAMP_NAMES;
  const tableHeaders = data?.tableHeaders?.length ? data.tableHeaders : DUMMY_TABLE_HEADERS;

  const allGroups: SeasonScheduleYearGroup[] = data?.groups?.length
    ? data.groups
    : data?.rows?.length
    ? getScheduleGroupsFromFlatRows(data.rows)
    : DUMMY_GROUPS;

  const yearGroups = getVisibleYearGroups(allGroups, new Date(), data?.yearsToShow ?? 2);

  const content = { ...DUMMY_DATA, ...data };

  const getStatusForCamp = (row: SeasonRow, campIdx: number, rowIdx: number) => {
    const explicitStatus = row.campStatuses?.[campIdx];
    return explicitStatus ?? getCampStatus(campIdx, rowIdx);
  };

  const getHoverTextForCamp = (row: SeasonRow, campIdx: number) =>
    row.campHoverTexts?.[campIdx];

  const getMobileCampEntries = (row: SeasonRow, rowIdx: number) => {
    if (row.mobileCamps?.length) return row.mobileCamps;
    return campNames.map((name, campIdx) => ({
      name,
      status: getStatusForCamp(row, campIdx, rowIdx),
      label: undefined,
      hoverText: getHoverTextForCamp(row, campIdx),
    }));
  };

  return (
    <div className="relative bg-[#E7DCCF] px-4 py-8 md:px-6 md:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-2">
            {content.welcomeLabel}
          </p>
          <h2 className="text-3xl font-bold text-black sm:text-4xl">
            {content.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-black/70 sm:text-base">
            {content.description}
          </p>
        </div>

        {yearGroups.map((group) => {
          const yearRows = group.rows;
          const dateLabels = yearRows.map((row, i) => getRowDateLabel(row, group, i));

          return (
            <div
              key={group.year}
              className="mb-10 last:mb-0 rounded-2xl border-2 border-[#3a2b20] bg-[#f7f2ea] p-4 shadow-xl md:p-6"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center rounded-lg bg-[#6b3b16] px-4 py-2 text-xl font-bold text-white shadow-sm sm:text-2xl">
                  {group.year} Season
                </span>
                <p className="text-sm font-medium text-[#6f5845]">
                  {yearRows.length} week{yearRows.length === 1 ? "" : "s"}
                </p>
              </div>

              {/* ── Mobile: carousel (hidden md+) ── */}
              <MobileCarousel
                rows={yearRows}
                dateLabels={dateLabels}
                getMobileCampEntries={getMobileCampEntries}
              />

              {/* ── Desktop: full grid table (hidden below md) ── */}
              <div className="hidden overflow-x-auto rounded-xl border-2 border-[#3a2b20] bg-[#ecebea] shadow-xl md:block">
                <div className="min-w-230 lg:min-w-245">
                  <div className="grid grid-cols-[1fr_350px_1fr_1fr_1fr_1fr_1fr_1fr] bg-[#6b3b16] text-white font-semibold text-sm border-b-2 border-[#3a2b20]">
                    <div className="col-span-2 text-center py-3 border-r border-[#3a2b20]">
                      {content.tableTopLeftHeader}
                    </div>
                    <div className="col-span-5 text-center py-3 border-r border-[#3a2b20]">
                      {content.tableTopMiddleHeader}
                    </div>
                    <div className="text-center py-3">{content.tableTopRightHeader}</div>
                  </div>

                  <div className="grid grid-cols-[1fr_350px_1fr_1fr_1fr_1fr_1fr_1fr] text-[#3c2f23] text-sm font-semibold border-b border-[#3a2b20]">
                    {tableHeaders.map((h, i) => (
                      <div
                        key={i}
                        className="p-3 text-center border-r h-full flex justify-center items-center border-[#3a2b20] bg-white last:border-r-0"
                      >
                        {h}
                      </div>
                    ))}
                  </div>

                  {yearRows.map((row, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1fr_350px_1fr_1fr_1fr_1fr_1fr_1fr] items-center text-sm border-b bg-white border-[#3a2b20]"
                    >
                      <div className="p-3 text-center flex justify-center items-center h-full text-orange-600 font-semibold border-r border-[#3a2b20]">
                        {row.week}
                      </div>
                      <div className="p-3 text-[#4a3b2f] flex items-center h-full border-r border-[#3a2b20]">
                        {dateLabels[i]}
                      </div>
                      {[0, 1, 2, 3, 4].map((campIdx) => (
                        <div
                          key={campIdx}
                          className="p-3 border-r border-[#3a2b20] flex justify-center items-center h-full"
                        >
                          <TooltipDot
                            type={getStatusForCamp(row, campIdx, i)}
                            hoverText={getHoverTextForCamp(row, campIdx)}
                          />
                        </div>
                      ))}
                      <div className="p-3 text-center text-[#b14b1a] font-semibold flex justify-center items-center h-full">
                        ${row.price ?? 1299 + i * 100}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        <div>
          <h2 className="mt-8 text-center text-[18px] font-bold text-black sm:mt-10 sm:text-[20px]">
            {content.pricingFootnote}
          </h2>

          <div className="mt-6 flex flex-col items-start justify-center gap-4 text-[14px] font-normal text-[#4a3b2f] sm:flex-row sm:flex-wrap sm:items-center sm:gap-8 sm:text-[16px]">
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_21_648)">
                  <circle cx="12" cy="11.9999" r="9" stroke="#F16724" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 10L10 14" stroke="#F16724" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 10L14 14" stroke="#F16724" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs>
                  <clipPath id="clip0_21_648">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              {content.legendReservedText}
            </div>

            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="#0077FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="12" y="8" width="0.01" height="0.01" stroke="#0077FF" strokeWidth="3" strokeLinejoin="round" />
                <path d="M12 12V16" stroke="#0077FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {content.legendPendingText}
            </div>

            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="11.9999" r="9" fill="#29B100" stroke="#29B100" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 10L11 14L9 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {content.legendAvailableText}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 lg:absolute lg:-bottom-56 lg:left-0 lg:right-0 lg:mt-0">
        <CampingExp data={data?.campingExpData} />
      </div>
    </div>
  );
}