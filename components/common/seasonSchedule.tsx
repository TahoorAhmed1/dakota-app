import React from "react";
import CampingExp from "./camping-exp";

/* ---------------- DATA ---------------- */

const rows = [
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
/* ---------------- COMPONENT ---------------- */

export default function SeasonSchedule() {
  return (
    <div className="bg-[#E7DCCF] pb-40 pt-10 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* TITLE */}
        <div className="text-center mb-8">
          <h2 className="text-[36px] font-bold text-black">
            UGUIDE South Dakota Pheasant Hunting - Welcome{" "}
          </h2>

          <p className="text-sm text-black mt-2 max-w-3xl mx-auto text-[16px] font-semibold leading-relaxed">
            Welcome to UGUIDE South Dakota Pheasant Hunting. The ultimate leader
            in unguided South Dakota pheasant hunting.  Your best option for
            fair chase, private-exclusive, self-guided and unguided South Dakota
            Pheasant Hunting. Wild reared pheasants only!
          </p>
        </div>

        {/* TABLE */}
        <div className="rounded-xl overflow-hidden shadow-xl border-2 border-[#3a2b20] bg-[#ecebea]">
          {/* GROUP HEADER – FIXED: now 8 columns to match everything else */}
          <div className="grid grid-cols-[1fr_350px_1fr_1fr_1fr_1fr_1fr_1fr] bg-[#6b3b16] text-white font-semibold text-sm border-b-2 border-[#3a2b20]">
            {/* Season Schedule spans Weeks + UGUIDE */}
            <div className="col-span-2 text-center py-3 border-r border-[#3a2b20]">
              Season Schedule
            </div>

            {/* Camps spans all 5 camp columns */}
            <div className="col-span-5 text-center py-3 border-r border-[#3a2b20]">
              Camps
            </div>

            {/* Pricing */}
            <div className="text-center py-3">Pricing</div>
          </div>

          {/* COLUMN HEADER – already correct (8 columns) */}
          <div className="grid grid-cols-[1fr_350px_1fr_1fr_1fr_1fr_1fr_1fr] text-[#3c2f23] text-sm font-semibold border-b border-[#3a2b20]">
            {[
              "Weeks In Season",
              "UGUIDE Season Schedule",
              "Fulkton",
              "Gunther’s Ranch",
              "Maddox Creek",
              "Pheasant Camp Lodge",
              "West River Adventures",
              "Rate + Tax *",
            ].map((h, i) => (
              <div
                key={i}
                className={`p-3 text-center border-r h-full flex justify-center items-center border-[#3a2b20] bg-white last:border-r-0`}
              >
                {h}
              </div>
            ))}
          </div>

          {/* ROWS – FIXED: now 8 columns + all 5 camps */}
          {rows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_350px_1fr_1fr_1fr_1fr_1fr_1fr] items-center text-sm border-b bg-white border-[#3a2b20]"
            >
              {/* WEEK */}
              <div className="p-3 text-center flex justify-center items-center h-full text-orange-600 font-semibold border-r border-[#3a2b20]">
                {row.week}
              </div>

              {/* DATE (UGUIDE wider column) */}
              <div className="p-3 text-[#4a3b2f] flex items-center h-full border-r border-[#3a2b20]">
                {row.date}
              </div>

              {/* CAMP 1 – Fulkton */}
              <div className="p-3 border-r border-[#3a2b20] flex justify-center items-center h-full">
                <StatusDot type="sold" />
              </div>

              {/* CAMP 2 – Gunther’s Ranch */}
              <div className="p-3 border-r border-[#3a2b20] flex justify-center items-center h-full">
                <StatusDot type={i % 2 === 0 ? "available" : "sold"} />
              </div>

              {/* CAMP 3 – Maddox Creek */}
              <div className="p-3 border-r border-[#3a2b20] flex justify-center items-center h-full">
                <StatusDot type="sold" />
              </div>

              {/* CAMP 4 – Pheasant Camp Lodge (added) */}
              <div className="p-3 border-r border-[#3a2b20] flex justify-center items-center h-full">
                <StatusDot type={i % 3 === 0 ? "available" : "sold"} />
              </div>

              {/* CAMP 5 – West River Adventures (added) */}
              <div className="p-3 border-r border-[#3a2b20] flex justify-center items-center h-full">
                <StatusDot type="available" />
              </div>

              {/* PRICE – no right border (last column) */}
              <div className="p-3 text-center text-[#b14b1a] font-semibold flex justify-center items-center h-full">
                ${1299 + i * 100}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-[20px] text-center font-bold text-black mt-10">
             Based on 4-nights lodging, 3-days Hunting Per Person *
          </h2>

          <div className="flex flex-wrap justify-center gap-10 mt-6 text-[16px] font-normal text-[#4a3b2f]">
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
              = Pheasant Camp Hunt RESERVED
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
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <rect
                  x="12"
                  y="8"
                  width="0.01"
                  height="0.01"
                  stroke="#0077FF"
                  stroke-width="3"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 12V16"
                  stroke="#0077FF"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              = Pheasant Camp Hunt PENDING (0){" "}
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
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15 10L11 14L9 12"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              = Pheasant Camp Hunt AVAILABLE (4){" "}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-48 left-0 right-0">

      <CampingExp />
      </div>

    </div>
  );
}
