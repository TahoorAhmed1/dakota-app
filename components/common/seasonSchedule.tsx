import React from "react";
import CampingExp from "./camping-exp";

/* ---------------- DATA ---------------- */

type CampStatusType = "sold" | "pending" | "available";

type SeasonRow = {
  week: string;
  date: string;
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

export type SeasonScheduleData = {
  welcomeLabel?: string;
  heading?: string;
  description?: string;
  rows?: SeasonRow[];
  campNames?: string[];
  tableTopLeftHeader?: string;
  tableTopMiddleHeader?: string;
  tableTopRightHeader?: string;
  tableHeaders?: string[];
  pricingFootnote?: string;
  legendReservedText?: string;
  legendPendingText?: string;
  legendAvailableText?: string;
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

const DUMMY_ROWS: SeasonRow[] = [
  { week: "Week 1", date: "Oct. 17–19, 2025 Pheasant Opener Sold Out" },
  { week: "Week 2", date: "Oct. 24–26 Sold Out" },
  { week: "Week 3", date: "Oct. 31–Nov. 02 Sold Out" },
  { week: "Week 4", date: "Nov. 07–09 Sold Out" },
  { week: "Week 5", date: "Nov. 14–16 Sold Out" },
  { week: "Week 6", date: "Nov. 21–23 Available" },
  { week: "Week 7", date: "Nov. 28–30 Thanksgiving Sold Out" },
  { week: "Week 8", date: "Dec. 05–07 Available" },
  { week: "Week 9", date: "Dec. 12–14 Sold Out" },
];

const DUMMY_CAMP_NAMES = [
  "Fulkton",
  "Gunther's Ranch",
  "Maddox Creek",
  "Pheasant Camp Lodge",
  "West River Adventures",
];

const DUMMY_TABLE_HEADERS = [
  "Weeks In Season",
  "UGUIDE Season Schedule",
  "Fulkton",
  "Gunther’s Ranch",
  "Maddox Creek",
  "Pheasant Camp Lodge",
  "West River Adventures",
  "Rate + Tax *",
];

const DUMMY_DATA: Required<
  Omit<SeasonScheduleData, "rows" | "campNames" | "tableHeaders" | "campingExpData">
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

/* ---------------- STATUS DOT ---------------- */

const StatusDot = ({ type }: { type: "sold" | "pending" | "available" }) => {
  return (
    <>
      {type === "available" ? (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_21_648)">
            <circle
              cx="12"
              cy="11.9999"
              r="9"
              stroke="#F16724"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 10L10 14"
              stroke="#F16724"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 10L14 14"
              stroke="#F16724"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_21_648">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ) : (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="11.9999"
            r="9"
            fill="#29B100"
            stroke="#29B100"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 10L11 14L9 12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </>
  );
};
/* ---------------- TOOLTIP DOT ---------------- */

function TooltipDot({
  type,
  hoverText,
}: {
  type: "sold" | "pending" | "available";
  hoverText?: string;
}) {
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

/* ---------------- COMPONENT ---------------- */

export default function SeasonSchedule({ data }: { data?: SeasonScheduleData }) {
  const rows = data?.rows?.length ? data.rows : DUMMY_ROWS;
  const campNames = data?.campNames?.length ? data.campNames : DUMMY_CAMP_NAMES;
  const tableHeaders = data?.tableHeaders?.length
    ? data.tableHeaders
    : DUMMY_TABLE_HEADERS;

  const content = {
    ...DUMMY_DATA,
    ...data,
  };

  const getStatusForCamp = (row: SeasonRow, campIdx: number, rowIdx: number) => {
    const explicitStatus = row.campStatuses?.[campIdx];
    return explicitStatus ?? getCampStatus(campIdx, rowIdx);
  };

  const getHoverTextForCamp = (row: SeasonRow, campIdx: number) =>
    row.campHoverTexts?.[campIdx];

  const getMobileCampEntries = (row: SeasonRow, rowIdx: number) => {
    if (row.mobileCamps?.length) {
      return row.mobileCamps;
    }

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
          <p className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-2">{content.welcomeLabel}</p>
          <h2 className="text-3xl font-bold text-black sm:text-4xl">
            {content.heading}
          </h2>

          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-black/70 sm:text-base">
            {content.description}
          </p>
        </div>

        {/* ── Mobile: week cards (hidden md+) ── */}
        <div className="space-y-3 md:hidden">
          {rows.map((row, i) => (
            <div key={i} className="overflow-hidden rounded-xl border-2 border-[#3a2b20] bg-white">
              <div className="flex items-center justify-between bg-[#6b3b16] px-4 py-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-300">{row.week}</span>
                <span className="text-sm font-bold text-white">${row.price ?? 1299 + i * 100}</span>
              </div>
              <div className="px-4 py-3">
                <p className="mb-3 text-[13px] font-medium text-[#4a3b2f]">{row.date}</p>
                <div className="space-y-2">
                  {getMobileCampEntries(row, i)?.map((camp) => {
                    const status = camp?.status;
                    const statusLabel =
                      camp?.label ??
                      (status === "available"
                        ? "Available"
                        : status === "pending"
                          ? "Pending"
                          : "Sold Out");

                    return (
                      <div key={camp?.name} className="flex items-center justify-between" title={camp?.hoverText || undefined}>
                        <span className="text-[13px] font-medium text-[#3c2f23]">{camp?.name}</span>
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
          ))}
        </div>

        {/* ── Desktop: full grid table (hidden below md) ── */}
        <div className="hidden overflow-x-auto rounded-xl border-2 border-[#3a2b20] bg-[#ecebea] shadow-xl md:block">
          <div className="min-w-230">
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
                className={`p-3 text-center border-r h-full flex justify-center items-center border-[#3a2b20] bg-white last:border-r-0`}
              >
                {h}
              </div>
            ))}
          </div>

          {rows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_350px_1fr_1fr_1fr_1fr_1fr_1fr] items-center text-sm border-b bg-white border-[#3a2b20]"
            >
              <div className="p-3 text-center flex justify-center items-center h-full text-orange-600 font-semibold border-r border-[#3a2b20]">
                {row.week}
              </div>

              <div className="p-3 text-[#4a3b2f] flex items-center h-full border-r border-[#3a2b20]">
                {row.date}
              </div>

              <div className="p-3 border-r border-[#3a2b20] flex justify-center items-center h-full">
                <TooltipDot type={getStatusForCamp(row, 0, i)} hoverText={getHoverTextForCamp(row, 0)} />
              </div>

              <div className="p-3 border-r border-[#3a2b20] flex justify-center items-center h-full">
                <TooltipDot type={getStatusForCamp(row, 1, i)} hoverText={getHoverTextForCamp(row, 1)} />
              </div>

              <div className="p-3 border-r border-[#3a2b20] flex justify-center items-center h-full">
                <TooltipDot type={getStatusForCamp(row, 2, i)} hoverText={getHoverTextForCamp(row, 2)} />
              </div>

              <div className="p-3 border-r border-[#3a2b20] flex justify-center items-center h-full">
                <TooltipDot type={getStatusForCamp(row, 3, i)} hoverText={getHoverTextForCamp(row, 3)} />
              </div>

              <div className="p-3 border-r border-[#3a2b20] flex justify-center items-center h-full">
                <TooltipDot type={getStatusForCamp(row, 4, i)} hoverText={getHoverTextForCamp(row, 4)} />
              </div>

              <div className="p-3 text-center text-[#b14b1a] font-semibold flex justify-center items-center h-full">
                ${row.price ?? 1299 + i * 100}
              </div>
            </div>
          ))}
          </div>
        </div>

        <div>
          <h2 className="mt-8 text-center text-[18px] font-bold text-black sm:mt-10 sm:text-[20px]">
             {content.pricingFootnote}
          </h2>

          <div className="mt-6 flex flex-col items-start justify-center gap-4 text-[14px] font-normal text-[#4a3b2f] sm:flex-row sm:flex-wrap sm:items-center sm:gap-8 sm:text-[16px]">
            <div className="flex items-center gap-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_21_648)">
                  <circle
                    cx="12"
                    cy="11.9999"
                    r="9"
                    stroke="#F16724"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 10L10 14"
                    stroke="#F16724"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 10L14 14"
                    stroke="#F16724"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="#0077FF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <rect
                  x="12"
                  y="8"
                  width="0.01"
                  height="0.01"
                  stroke="#0077FF"
                  strokeWidth="3"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 12V16"
                  stroke="#0077FF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {content.legendPendingText}{" "}
            </div>

            <div className="flex items-center gap-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="11.9999"
                  r="9"
                  fill="#29B100"
                  stroke="#29B100"
                  strokeWidth="2"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15 10L11 14L9 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {content.legendAvailableText}{" "}
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
