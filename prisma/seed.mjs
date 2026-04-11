import { PrismaClient, DiscountCategory, DiscountType } from "@prisma/client";

const prisma = new PrismaClient();

// ─── CAMPS ───────────────────────────────────────────────────────────────────
const camps = [
  { name: "Faulkton Pheasant Camp", slug: "faulkton", displayOrder: 1 },
  { name: "Gunner's Haven Pheasant Camp", slug: "gunners-haven", displayOrder: 2 },
  { name: "Meadow Creek Pheasant Camp", slug: "meadow-creek", displayOrder: 3 },
  { name: "Pheasant Camp Lodge", slug: "pheasant-camp-lodge", displayOrder: 4 },
  { name: "West River Adventures Pheasant Camp", slug: "west-river-adventures", displayOrder: 5 },
];

// ─── WEEKS ───────────────────────────────────────────────────────────────────
const weeks = [
  { label: "Week 1 — Oct. 17–19", slug: "week-1", seasonLabel: "2026 Season", displayOrder: 1 },
  { label: "Week 2 — Oct. 24–26", slug: "week-2", seasonLabel: "2026 Season", displayOrder: 2 },
  { label: "Week 3 — Oct. 31–Nov. 2", slug: "week-3", seasonLabel: "2026 Season", displayOrder: 3 },
  { label: "Week 4 — Nov. 7–9", slug: "week-4", seasonLabel: "2026 Season", displayOrder: 4 },
  { label: "Week 5 — Nov. 14–16", slug: "week-5", seasonLabel: "2026 Season", displayOrder: 5 },
  { label: "Week 6 — Nov. 21–23", slug: "week-6", seasonLabel: "2026 Season", displayOrder: 6 },
  { label: "Week 7 — Nov. 28–30", slug: "week-7", seasonLabel: "2026 Season", displayOrder: 7 },
  { label: "Week 8 — Dec. 5–7", slug: "week-8", seasonLabel: "2026 Season", displayOrder: 8 },
  { label: "Week 9 — Dec. 12–14", slug: "week-9", seasonLabel: "2026 Season", displayOrder: 9 },
];

// ─── PACKAGES ─────────────────────────────────────────────────────────────────
const packages = [
  { code: "PKG_4N3D", label: "4 Nights / 3 Days", nights: 4, days: 3, displayOrder: 1 },
  { code: "PKG_5N4D", label: "5 Nights / 4 Days", nights: 5, days: 4, displayOrder: 2 },
];

// ─── BASE RATES FOR 4N/3D (FROM EXCEL) ───────────────────────────────────────
const weekBaseRates3day = [1699, 1599, 1499, 1449, 1449, 1449, 1499, 1299, 999];

// Compute 5N/4D rate: lodging = $100/night, hunting per day derived from 3‑day base
function compute4DayRate(threeDayBase) {
  const lodgingPerNight = 100;
  const lodging3 = 4 * lodgingPerNight;
  const huntingTotal3 = threeDayBase - lodging3;
  const huntingPerDay = huntingTotal3 / 3;
  const lodging4 = 5 * lodgingPerNight;
  const huntingTotal4 = 4 * huntingPerDay;
  return Math.round(lodging4 + huntingTotal4);
}

// ─── MINIMUM GROUP SIZES & CAPACITIES ────────────────────────────────────────
//                                        Wk1 Wk2 Wk3 Wk4 Wk5 Wk6 Wk7 Wk8 Wk9
const min3day = {
  faulkton:             [17, 17, 17, 17, 17, 17, 13, 17, null], // Wk7 = 13 (client override)
  "gunners-haven":      [6,  6,  6,  6,  6,  6,  null, 6,  6],
  "meadow-creek":       [null, 11, 11, 11, 11, 11, 11, 11, null],
  "pheasant-camp-lodge":[12, 11, 10, 9,  8,  8,  8,  8,  8],
  "west-river-adventures":[11, 11, 11, 11, 11, 11, 6,  11, 6],
};

const min4day = {
  faulkton:             [13, 13, 13, 13, 13, 13, 13, 13, null],
  "meadow-creek":       [12, 10, 10, 8,  8,  8,  10, 10, null],
  "gunners-haven":      [null, null, null, null, null, null, null, null, null],
  "pheasant-camp-lodge":[null, null, null, null, null, null, null, null, null],
  "west-river-adventures":[null, null, null, null, null, null, null, null, null],
};

const lodgingCapacity = {
  faulkton:             [17, 17, 17, 17, 17, 17, 17, 17, 17],
  "gunners-haven":      [10, 10, 10, 10, 10, 10, 10, 10, 10],
  "meadow-creek":       [12, 12, 12, 12, 12, 12, 12, 12, 12],
  "pheasant-camp-lodge":[12, 12, 12, 12, 12, 12, 12, 12, 12],
  "west-river-adventures":[17, 17, 17, 17, 17, 17, 17, 17, 17],
};

// ─── VOLUME DISCOUNTS ────────────────────────────────────────────────────────
const volumeRules = [
  { minHunters: 7, maxHunters: 7, amountOffPerHead: 20, displayOrder: 1 },
  { minHunters: 8, maxHunters: 8, amountOffPerHead: 40, displayOrder: 2 },
  { minHunters: 9, maxHunters: 9, amountOffPerHead: 60, displayOrder: 3 },
  { minHunters: 10, maxHunters: null, amountOffPerHead: 80, displayOrder: 4 },
];

// ─── INDIVIDUAL DISCOUNTS ────────────────────────────────────────────────────
const discountRules = [
  { code: "NONE", label: "Adult", category: DiscountCategory.INDIVIDUAL, type: DiscountType.FIXED, value: 0, stackOrder: 10 },
  { code: "ADULT_COORDINATOR", label: "Adult - Group Coordinator", category: DiscountCategory.INDIVIDUAL, type: DiscountType.PERCENT, value: 10, stackOrder: 20 },
  { code: "ADULT_MILITARY", label: "Adult - Military", category: DiscountCategory.INDIVIDUAL, type: DiscountType.PERCENT, value: 5, stackOrder: 30 },
  { code: "ADULT_HANDICAP", label: "Adult - Handicap", category: DiscountCategory.INDIVIDUAL, type: DiscountType.PERCENT, value: 5, stackOrder: 40 },
  { code: "ADULT_LAW_ENFORCEMENT", label: "Adult - Law Enforcement", category: DiscountCategory.INDIVIDUAL, type: DiscountType.PERCENT, value: 5, stackOrder: 50 },
  { code: "ADULT_FIREFIGHTER", label: "Adult - Firefighter", category: DiscountCategory.INDIVIDUAL, type: DiscountType.PERCENT, value: 5, stackOrder: 60 },
  { code: "ADULT_EMT", label: "Adult - Emergency Medical Tech", category: DiscountCategory.INDIVIDUAL, type: DiscountType.PERCENT, value: 5, stackOrder: 70 },
  { code: "ADULT_SENIOR", label: "Adult - Senior (Age 65+)", category: DiscountCategory.INDIVIDUAL, type: DiscountType.PERCENT, value: 5, stackOrder: 80 },
  { code: "JUNIOR", label: "Junior (Age 16–17)", category: DiscountCategory.JUNIOR, type: DiscountType.PERCENT, value: 50, stackOrder: 90 },
  { code: "YOUTH", label: "Youth (Age 12–15) — Free", category: DiscountCategory.JUNIOR, type: DiscountType.PERCENT, value: 100, stackOrder: 100 },
];

// ─── CALCULATOR SETTINGS ─────────────────────────────────────────────────────
// NOTE: extraDayRate should be computed dynamically from the selected week's
// hunting per day + $100 lodging. The value below is a placeholder; ensure your
// calculator logic overrides it per week.
const defaultCalculatorSettings = {
  salesTaxRate: 0.057,
  earlyBirdRate: 0.05,
  extraDayRate: 449.67,        // ⚠️ DYNAMIC PER WEEK – override in calculation
  extraNightRate: 100,
  processingFeeRate: 0.0299,
  hunterCountOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  extraDayOptions: [0, 1, 2, 3],
  extraNightOptions: [0, 1, 2, 3],
  earlyBirdOptions: [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ],
  depositSchedule: [
    { label: "Up to May 1", startMonth: 1, startDay: 1, endMonth: 4, endDay: 30, rate: 0.25 },
    { label: "May 1 through August 31", startMonth: 5, startDay: 1, endMonth: 8, endDay: 31, rate: 0.50 },
    { label: "September 1 through end of season", startMonth: 9, startDay: 1, endMonth: 12, endDay: 31, rate: 1.00 },
  ],
  rebookingDepositRate: 0.25,
  labels: {
    stepHeadings: {
      step1: "Step 1: Quote–Reserve Group Options",
      step2: "Step 2: Quote–Reserve Enter Hunters",
      step3: "Step 3: Quote–Reserve Review Totals",
    },
    step1: {
      cardTitle: "Price Your Own Hunt in 3 Simple Steps",
      requiredLabel: "Required Fields",
      optionalLabel: "Optional Fields",
      seasonLabel: "What Season Is Your Group Hunting In?",
      campLabel: "What Camp Is Your Group Going To?",
      weekLabel: "What Week Is Your Group Going?",
      hunterCountLabel: "How Many Hunters In Your Group?",
      packageLabel: "What Package?",
      earlyBirdLabel: "Does Your Group Qualify For 5% Early Bird Booking Discount?",
      nextButton: "To Step 2: Enter Hunters »",
    },
    step2: {
      hunterNameHeader: "Hunter Name",
      individualDiscountHeader: "Individual Discount",
      extraDaysHeader: "Extra Days Hunting",
      extraNightsHeader: "Extra Nights Lodging",
      emailLabel: "Enter your email address to receive a copy of the quote:",
      backButton: "« Back to Step 1",
      nextButton: "To Step 3: Review Totals »",
    },
    step3: {
      overviewTitle: "Quote Details and Payment Options",
      overviewIntro: "Thank you for quoting your group's fair chase pheasant hunt at a UGUIDE South Dakota Pheasant Hunting property.",
      optionsLabel: "There are two simple options to reserve your hunt:",
      optionOneTitle: "Option 1 – One group member pays deposit",
      optionOneBullets: [
        "Check the Availability page to make sure the hunt you would like to reserve is available.",
        "Use the Booking Tool which will calculate your deposit amount and then take you to PayPal.",
        "Upon completion of checkout, you will receive an automated itinerary in your email.",
      ],
      optionTwoTitle: "Option 2 – Individuals in group split up deposit",
      optionTwoBullets: [
        "Check the Availability page to make sure the hunt you would like to reserve is available.",
        "From the Quote, determine how much each member should pay as their portion of the deposit.",
        "Email the Individual Pay link to each member with instructions on the amount to pay.",
      ],
      groupSelectionsTitle: "Group Selections",
      hunterSelectionsTitle: "Hunter Selections",
      depositTitle: "Deposit/Booking Information",
      groupFields: {
        season: "Season Selected:",
        camp: "Camp Selected:",
        campTier: "Camp Tier:",
        package: "Package Selected:",
        week: "Week Selected:",
        totalHunters: "Total Hunters Selected:",
        earlyBird: "Early Bird Discount:",
      },
      tableHeaders: {
        hunterNumber: "#",
        hunterName: "Hunter Name",
        individualDiscount: "Individual Discount",
        baseRate: "Base Rate",
        volumeDiscount: "Volume Discount",
        extraHunting: "Extra Hunting",
        extraLodging: "Extra Lodging",
        juniorDiscount: "Junior/Youth Discount",
        adultDiscount: "Adult Discounts",
        earlyBirdDiscount: "Early Bird Discount",
        taxes: "Taxes 5.7%",
        total: "Total",
      },
      totalsBadgeLabel: "Totals",
      totalPriceLabel: "Total price after applicable discounts and state sales tax:",
      depositDescription: "Deposit % is based on booking date. Up to May 1: 25%. May 1–Aug 31: 50%. Sept 1–end of season: 100%.",
      bookingNameLabel: "Enter name of person booking the hunt:",
      bookingEmailLabel: "Enter email address of person booking the hunt:",
      depositAmountLabel: "Deposit Amount",
      depositNote: "Note: You will be redirected to Paypal.com to make your secure deposit.",
      backButton: "« Back to Step 2",
      submitButton: "Submit Quote Request »",
    },
  },
};

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🌱 Seeding database...");

  await prisma.quoteHunter.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.campWeekPricing.deleteMany();
  await prisma.volumeDiscountRule.deleteMany();
  await prisma.discountRule.deleteMany();
  await prisma.calculatorSetting.deleteMany();
  await prisma.packageOption.deleteMany();
  await prisma.huntWeek.deleteMany();
  await prisma.camp.deleteMany();

  const createdCamps = await Promise.all(camps.map((c) => prisma.camp.create({ data: c })));
  const createdWeeks = await Promise.all(weeks.map((w) => prisma.huntWeek.create({ data: w })));
  const [pkg3day, pkg4day] = await Promise.all(packages.map((p) => prisma.packageOption.create({ data: p })));

  const campBySlug = Object.fromEntries(createdCamps.map((c) => [c.slug, c]));
  const weekByOrder = Object.fromEntries(createdWeeks.map((w) => [w.displayOrder, w]));

  for (const campSlug of Object.keys(min3day)) {
    const camp = campBySlug[campSlug];
    const capacityRow = lodgingCapacity[campSlug];

    for (let weekNum = 1; weekNum <= 9; weekNum++) {
      const week = weekByOrder[weekNum];
      const base3 = weekBaseRates3day[weekNum - 1];
      const base4 = compute4DayRate(base3);
      // const capacity = capacityRow[weekNum - 1];  // if needed later

      const min3 = min3day[campSlug][weekNum - 1];
      await prisma.campWeekPricing.create({
        data: {
          campId: camp.id,
          weekId: week.id,
          packageId: pkg3day.id,
          baseRate: base3,
          minGroupSize: min3 ?? 1,
          isAvailable: min3 !== null,
          availabilityTag: min3 === null ? "NA" : null,
        },
      });

      const min4 = min4day[campSlug][weekNum - 1];
      await prisma.campWeekPricing.create({
        data: {
          campId: camp.id,
          weekId: week.id,
          packageId: pkg4day.id,
          baseRate: base4,
          minGroupSize: min4 ?? 1,
          isAvailable: min4 !== null,
          availabilityTag: min4 === null ? "NA" : null,
        },
      });
    }
  }

  await prisma.volumeDiscountRule.createMany({ data: volumeRules });
  await prisma.discountRule.createMany({ data: discountRules });
  await prisma.calculatorSetting.create({ data: { id: "default", config: defaultCalculatorSettings } });

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());