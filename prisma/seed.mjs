import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ------------------------------------------------------------
//  Camps – matches "Camps" sheet
// ------------------------------------------------------------
const camps = [
  { name: "Faulkton Pheasant Camp", slug: "faulkton", displayOrder: 1, nightlyLodgingRate: 100.00 },
  { name: "Gunner's Haven Pheasant Camp", slug: "gunners-haven", displayOrder: 2, nightlyLodgingRate: 100.00 },
  { name: "Meadow Creek Pheasant Camp", slug: "meadow-creek", displayOrder: 3, nightlyLodgingRate: 100.00 },
  { name: "Pheasant Camp Lodge", slug: "pheasant-camp-lodge", displayOrder: 4, nightlyLodgingRate: 100.00 },
  { name: "West River Adventures Pheasant Camp", slug: "west-river-adventures", displayOrder: 5, nightlyLodgingRate: 100.00 },
];

// ------------------------------------------------------------
//  Weeks – matches schedule (3rd Saturday of October)
// ------------------------------------------------------------
const weeks = [
  { label: "Week 1 — Oct. 17-19, 2026", slug: "week-1-2026", seasonLabel: "2026 Season", displayOrder: 1 },
  { label: "Week 2 — Oct. 22-25, 2026", slug: "week-2-2026", seasonLabel: "2026 Season", displayOrder: 2 },
  { label: "Week 3 — Oct. 28-31, 2026", slug: "week-3-2026", seasonLabel: "2026 Season", displayOrder: 3 },
  { label: "Week 4 — Nov. 4-7, 2026", slug: "week-4-2026", seasonLabel: "2026 Season", displayOrder: 4 },
  { label: "Week 5 — Nov. 11-14, 2026", slug: "week-5-2026", seasonLabel: "2026 Season", displayOrder: 5 },
  { label: "Week 6 — Nov. 18-21, 2026", slug: "week-6-2026", seasonLabel: "2026 Season", displayOrder: 6 },
  { label: "Week 7 — Nov. 27-30, 2026", slug: "week-7-2026", seasonLabel: "2026 Season", displayOrder: 7 },
  { label: "Week 8 — Dec. 3-6, 2026", slug: "week-8-2026", seasonLabel: "2026 Season", displayOrder: 8 },
  { label: "Week 9 — Dec. 9-12, 2026", slug: "week-9-2026", seasonLabel: "2026 Season", displayOrder: 9 },

  { label: "Week 1 — Oct. 16-18, 2027", slug: "week-1-2027", seasonLabel: "2027 Season", displayOrder: 10 },
  { label: "Week 2 — Oct. 23-26, 2027", slug: "week-2-2027", seasonLabel: "2027 Season", displayOrder: 11 },
  { label: "Week 3 — Oct. 30-Nov. 2, 2027", slug: "week-3-2027", seasonLabel: "2027 Season", displayOrder: 12 },
  { label: "Week 4 — Nov. 6-9, 2027", slug: "week-4-2027", seasonLabel: "2027 Season", displayOrder: 13 },
  { label: "Week 5 — Nov. 13-16, 2027", slug: "week-5-2027", seasonLabel: "2027 Season", displayOrder: 14 },
  { label: "Week 6 — Nov. 20-23, 2027", slug: "week-6-2027", seasonLabel: "2027 Season", displayOrder: 15 },
  { label: "Week 7 — Nov. 26-29, 2027", slug: "week-7-2027", seasonLabel: "2027 Season", displayOrder: 16 },
  { label: "Week 8 — Dec. 4-7, 2027", slug: "week-8-2027", seasonLabel: "2027 Season", displayOrder: 17 },
  { label: "Week 9 — Dec. 11-14, 2027", slug: "week-9-2027", seasonLabel: "2027 Season", displayOrder: 18 },
];

// ------------------------------------------------------------
//  Packages – base durations
// ------------------------------------------------------------
const packages = [
  { code: "PKG_4N3D", label: "4 Nights / 3 Days", nights: 4, days: 3, displayOrder: 1 },
  { code: "PKG_5N4D", label: "5 Nights / 4 Days", nights: 5, days: 4, displayOrder: 2 },
];

// ------------------------------------------------------------
//  Week base rates (3‑day) from Rate-Price sheet
// ------------------------------------------------------------
const weekBaseRates3day = [1749, 1649, 1549, 1449, 1449, 1449, 1449, 1299, 999];

const LODGING_RATE_PER_NIGHT = 100;      // Base package lodging rate
const EXTRA_NIGHT_RATE = 105;            // Extra night rate – matches Packages & Pricing.docx

// ------------------------------------------------------------
//  Helper functions
// ------------------------------------------------------------
function computeDailyHuntRate(threeDayBase) {
  const lodgingPortion = 4 * LODGING_RATE_PER_NIGHT;
  return Number(((threeDayBase - lodgingPortion) / 3).toFixed(2));
}

function compute4DayBase(threeDayBase) {
  const dailyHunt = computeDailyHuntRate(threeDayBase);
  return Number((5 * LODGING_RATE_PER_NIGHT + 4 * dailyHunt).toFixed(2));
}

// ------------------------------------------------------------
//  Minimum Group Sizes – CORRECTED per Minimum Group Size sheet
// ------------------------------------------------------------
// 3‑day minimums (lower bound of ranges, or exact where given)
const min3day = {
  faulkton:              [17, 17, 17, 17, 17, 17, 17, 17, 17],   // All weeks = 17
  "gunners-haven":       [6,  6,  6,  6,  6,  6,  6,  6,  6],     // All weeks min 6 (range 6‑10)
  "meadow-creek":        [12, 11, 11, 11, 11, 11, 11, 12, 12],    // Week1=12, W2‑7=11, W8‑9=12
  "pheasant-camp-lodge": [12, 11, 10, 9,  8,  8,  8,  8,  8],     // As per sheet
  "west-river-adventures":[11, 11, 11, 11, 11, 11, 6,  11, 6],    // As per sheet
};

// 4‑day minimums (only Meadow Creek and Faulkton offer 4‑day)
const min4day = {
  faulkton:              [13, 13, 13, 13, 13, 13, 13, 13, 13],   // All weeks = 13‑17, use lower bound 13
  "gunners-haven":       [null, null, null, null, null, null, null, null, null],
  "meadow-creek":        [12, 10, 10, 8,  8,  8,  10, 10, 12],    // As per sheet
  "pheasant-camp-lodge": [null, null, null, null, null, null, null, null, null],
  "west-river-adventures":[null, null, null, null, null, null, null, null, null],
};

// ------------------------------------------------------------
//  Lodging capacity (beds) per camp
// ------------------------------------------------------------
const lodgingCapacity = {
  faulkton: 17,
  "gunners-haven": 10,
  "meadow-creek": 12,
  "pheasant-camp-lodge": 12,
  "west-river-adventures": 17,
};

// ------------------------------------------------------------
//  Availability status for 2026 season (from your grid)
// ------------------------------------------------------------
const avail3day2026 = {
  faulkton: ["RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED"],
  "gunners-haven": ["RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","OPEN","RESERVED"],
  "meadow-creek": ["RESERVED","RESERVED","RESERVED","RESERVED","OPEN","OPEN","RESERVED","RESERVED","RESERVED"],
  "pheasant-camp-lodge": ["RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED"],
  "west-river-adventures": ["RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","OPEN","RESERVED","OPEN","RESERVED"],
};

const avail4day2026 = {
  faulkton: ["RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED"],
  "gunners-haven": ["NA","NA","NA","NA","NA","NA","NA","NA","NA"],
  "meadow-creek": ["RESERVED","RESERVED","RESERVED","RESERVED","OPEN","OPEN","RESERVED","RESERVED","RESERVED"],
  "pheasant-camp-lodge": ["NA","NA","NA","NA","NA","NA","NA","NA","NA"],
  "west-river-adventures": ["NA","NA","NA","NA","NA","NA","NA","NA","NA"],
};

// ------------------------------------------------------------
//  Volume discount rules – matches Discounts sheet
// ------------------------------------------------------------
const volumeRules = [
  { minHunters: 7, maxHunters: 7,   amountOffPerHead: 20, displayOrder: 1 },
  { minHunters: 8, maxHunters: 8,   amountOffPerHead: 40, displayOrder: 2 },
  { minHunters: 9, maxHunters: 9,   amountOffPerHead: 60, displayOrder: 3 },
  { minHunters: 10, maxHunters: null, amountOffPerHead: 80, displayOrder: 4 },
];

// ------------------------------------------------------------
//  Individual discount rules – matches Discounts sheet
// ------------------------------------------------------------
const discountRules = [
  { code: "NONE",                  label: "Adult",                            category: "INDIVIDUAL", type: "FIXED",   value: 0,   stackOrder: 10, requiresHunterIndex: null, maxPerGroup: null },
  { code: "ADULT_COORDINATOR",     label: "Adult - Group Coordinator",        category: "INDIVIDUAL", type: "PERCENT", value: 10,  stackOrder: 20, requiresHunterIndex: 1,    maxPerGroup: 1 },
  { code: "ADULT_MILITARY",        label: "Adult - Military",                 category: "INDIVIDUAL", type: "PERCENT", value: 5,   stackOrder: 30, requiresHunterIndex: null, maxPerGroup: null },
  { code: "ADULT_HANDICAP",        label: "Adult - Handicap",                 category: "INDIVIDUAL", type: "PERCENT", value: 5,   stackOrder: 40, requiresHunterIndex: null, maxPerGroup: null },
  { code: "ADULT_LAW_ENFORCEMENT", label: "Adult - Law Enforcement",          category: "INDIVIDUAL", type: "PERCENT", value: 5,   stackOrder: 50, requiresHunterIndex: null, maxPerGroup: null },
  { code: "ADULT_FIREFIGHTER",     label: "Adult - Firefighter",              category: "INDIVIDUAL", type: "PERCENT", value: 5,   stackOrder: 60, requiresHunterIndex: null, maxPerGroup: null },
  { code: "ADULT_EMT",             label: "Adult - Emergency Medical Tech",   category: "INDIVIDUAL", type: "PERCENT", value: 5,   stackOrder: 70, requiresHunterIndex: null, maxPerGroup: null },
  { code: "ADULT_SENIOR",          label: "Adult - Senior (Age 65+)",         category: "INDIVIDUAL", type: "PERCENT", value: 5,   stackOrder: 80, requiresHunterIndex: null, maxPerGroup: null },
  { code: "JUNIOR",                label: "Junior (Age 16-17)",               category: "JUNIOR",     type: "PERCENT", value: 50,  stackOrder: 90, requiresHunterIndex: null, maxPerGroup: null },
  { code: "YOUTH",                 label: "Youth (Age 12-15) — Free",         category: "YOUTH",      type: "PERCENT", value: 100, stackOrder: 100, requiresHunterIndex: null, maxPerGroup: null },
];

// ------------------------------------------------------------
//  Calculator global settings
// ------------------------------------------------------------
const defaultCalculatorSettings = {
  salesTaxRate: 0.057,
  earlyBirdRate: 0.05,
  lodgingRatePerNight: LODGING_RATE_PER_NIGHT,
  extraNightRate: EXTRA_NIGHT_RATE,
  depositSchedule: [
    { label: "Up to May 1", startMonth: 1, startDay: 1, endMonth: 4, endDay: 30, rate: 0.25 },
    { label: "May 1 through August 31", startMonth: 5, startDay: 1, endMonth: 8, endDay: 31, rate: 0.50 },
    { label: "September 1 through end of season", startMonth: 9, startDay: 1, endMonth: 12, endDay: 31, rate: 1.00 },
  ],
  rebookingDepositRate: 0.25,
  labels: {
    // Default labels – customize as needed
    stepHeadings: { step1: "Camp & Dates", step2: "Hunter Details", step3: "Quote Summary" },
    step1: { campLabel: "Select Camp", weekLabel: "Select Week", packageLabel: "Select Package", groupSizeLabel: "Number of Hunters", earlyBirdLabel: "Early Bird Discount?" },
    step2: { hunterNameLabel: "Name", discountLabel: "Discount", extraDaysLabel: "Extra Hunting Days", extraNightsLabel: "Extra Lodging Nights" },
    step3: { quoteTitle: "Your Custom Quote", taxLabel: "Sales Tax (5.7%)", totalLabel: "Total", depositLabel: "Deposit Required" },
  },
};

// ------------------------------------------------------------
//  Main seed function
// ------------------------------------------------------------
async function main() {
  console.log("🌱 Seeding UGUIDE database with corrected minimum group sizes...");

  // Clear existing data (respect foreign key order)
  await prisma.quoteHunter.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.campWeekPricing.deleteMany();
  await prisma.weekBaseRate.deleteMany();
  await prisma.volumeDiscountRule.deleteMany();
  await prisma.discountRule.deleteMany();
  await prisma.calculatorSetting.deleteMany();
  await prisma.packageOption.deleteMany();
  await prisma.huntWeek.deleteMany();
  await prisma.camp.deleteMany();

  // Create camps, weeks, packages
  const createdCamps = await Promise.all(camps.map(c => prisma.camp.create({ data: c })));
  const createdWeeks = await Promise.all(weeks.map(w => prisma.huntWeek.create({ data: w })));
  const [pkg4n3d, pkg5n4d] = await Promise.all(packages.map(p => prisma.packageOption.create({ data: p })));

  const campBySlug = Object.fromEntries(createdCamps.map(c => [c.slug, c]));
  const weekBySlug = Object.fromEntries(createdWeeks.map(w => [w.slug, w]));

  // Seed week base rates (3‑day)
  for (const year of [2026, 2027]) {
    for (let wk = 1; wk <= 9; wk++) {
      const weekSlug = `week-${wk}-${year}`;
      const week = weekBySlug[weekSlug];
      if (week) {
        await prisma.weekBaseRate.create({
          data: { weekId: week.id, baseRate: weekBaseRates3day[wk - 1] },
        });
      }
    }
  }

  // Helper to seed a season
  async function seedSeason(
    seasonYear,
    availMap3,
    availMap4,
    defaultToOpen = false
  ) {
    for (const campSlug of Object.keys(min3day)) {
      const camp = campBySlug[campSlug];
      if (!camp) continue;

      for (let wk = 1; wk <= 9; wk++) {
        const idx = wk - 1;
        const weekSlug = `week-${wk}-${seasonYear}`;
        const week = weekBySlug[weekSlug];
        if (!week) continue;

        const base3 = weekBaseRates3day[idx];
        const dailyHunt = computeDailyHuntRate(base3);
        const base4 = compute4DayBase(base3);
        const capacity = lodgingCapacity[campSlug];

        // 3‑Day Package
        const min3 = min3day[campSlug][idx];
        let status3 = "NA";
        if (min3 !== null && min3 !== undefined && min3 > 0) {
          status3 = defaultToOpen ? "OPEN" : (availMap3[campSlug]?.[idx] ?? "OPEN");
        } else {
          status3 = "NA";
        }

        await prisma.campWeekPricing.create({
          data: {
            campId: camp.id,
            weekId: week.id,
            packageId: pkg4n3d.id,
            baseRate: base3,
            minGroupSize: min3 ?? 0,
            lodgingCapacity: capacity,
            nightlyLodgingRate: LODGING_RATE_PER_NIGHT,
            dailyHuntRate: dailyHunt,
            isAvailable: status3 === "OPEN",
            availabilityTag: status3,
          },
        });

        // 4‑Day Package
        const min4 = min4day[campSlug]?.[idx] ?? null;
        let status4 = "NA";
        if (min4 !== null && min4 > 0) {
          status4 = defaultToOpen ? "OPEN" : (availMap4[campSlug]?.[idx] ?? "OPEN");
        } else {
          status4 = "NA";
        }

        await prisma.campWeekPricing.create({
          data: {
            campId: camp.id,
            weekId: week.id,
            packageId: pkg5n4d.id,
            baseRate: base4,
            minGroupSize: min4 ?? 0,
            lodgingCapacity: capacity,
            nightlyLodgingRate: LODGING_RATE_PER_NIGHT,
            dailyHuntRate: dailyHunt,
            isAvailable: status4 === "OPEN",
            availabilityTag: status4,
          },
        });
      }
    }
  }

  await seedSeason(2026, avail3day2026, avail4day2026, false);
  await seedSeason(2027, {}, {}, true);

  await prisma.volumeDiscountRule.createMany({ data: volumeRules });

  await prisma.discountRule.createMany({ data: discountRules });

  await prisma.calculatorSetting.create({
    data: { id: "default", config: defaultCalculatorSettings },
  });

  console.log("✅ UGUIDE seed completed successfully with corrected minimum group sizes!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });