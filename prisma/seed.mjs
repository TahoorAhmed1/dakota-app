import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const camps = [
  { name: "Faulkton Pheasant Camp", slug: "faulkton", displayOrder: 1, nightlyLodgingRate: 100.00 },
  { name: "Gunner's Haven Pheasant Camp", slug: "gunners-haven", displayOrder: 2, nightlyLodgingRate: 100.00 },
  { name: "Meadow Creek Pheasant Camp", slug: "meadow-creek", displayOrder: 3, nightlyLodgingRate: 100.00 },
  { name: "Pheasant Camp Lodge", slug: "pheasant-camp-lodge", displayOrder: 4, nightlyLodgingRate: 100.00 },
  { name: "West River Adventures Pheasant Camp", slug: "west-river-adventures", displayOrder: 5, nightlyLodgingRate: 100.00 },
];

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

const packages = [
  { code: "PKG_5N4D", label: "5 Nights / 4 Days", nights: 5, days: 4, displayOrder: 1 },
  { code: "PKG_4N3D", label: "4 Nights / 3 Days", nights: 4, days: 3, displayOrder: 2 },
];

// FIX #1: Updated base rates per DataInputs spec (newer file)
const weekBaseRates3day = [1699, 1599, 1499, 1499, 1449, 1449, 1449, 1299, 999];
const LODGING_RATE_PER_NIGHT = 100;

function computeDailyHuntRate(threeDayBase) {
  const lodgingPortion = 4 * LODGING_RATE_PER_NIGHT;
  return Number(((threeDayBase - lodgingPortion) / 3).toFixed(2));
}

function compute4DayRate(threeDayBase) {
  const dailyHunt = computeDailyHuntRate(threeDayBase);
  return Number((5 * LODGING_RATE_PER_NIGHT + 4 * dailyHunt).toFixed(2));
}

const min3day = {
  faulkton: [17, 17, 17, 17, 17, 17, 17, 17, null],
  "gunners-haven": [6, 6, 6, 6, 6, 6, null, 6, 6],
  // FIX #2: Meadow Creek Week 1 - 3-day should be null (not offered)
  "meadow-creek": [null, 11, 11, 11, 11, 11, 11, 11, null],
  "pheasant-camp-lodge": [12, 11, 10, 9, 8, 8, 8, 8, 8],
  "west-river-adventures": [11, 11, 11, 11, 11, 11, 6, 11, 6],
};

const min4day = {
  faulkton: [13, 13, 13, 13, 13, 13, 13, 13, null],
  "gunners-haven": [null, null, null, null, null, null, null, null, null],
  "meadow-creek": [12, 10, 10, 8, 8, 8, 10, 10, null],
  "pheasant-camp-lodge": [null, null, null, null, null, null, null, null, null],
  "west-river-adventures": [null, null, null, null, null, null, null, null, null],
};

const lodgingCapacity = {
  faulkton: [17, 17, 17, 17, 17, 17, 17, 17, 17],
  "gunners-haven": [10, 10, 10, 10, 10, 10, 10, 10, 10],
  "meadow-creek": [12, 12, 12, 12, 12, 12, 12, 12, 12],
  "pheasant-camp-lodge": [12, 12, 12, 12, 12, 12, 12, 12, 12],
  "west-river-adventures": [17, 17, 17, 17, 17, 17, 17, 17, 17],
};

const avail3day2026 = {
  faulkton: ["RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","NA"],
  "gunners-haven": ["RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","NA","OPEN","RESERVED"],
  // FIX #2: Meadow Creek Week 1 - 3-day should be NA
  "meadow-creek": ["NA","RESERVED","RESERVED","RESERVED","OPEN","OPEN","RESERVED","RESERVED","NA"],
  "pheasant-camp-lodge": ["RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED"],
  "west-river-adventures": ["RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","OPEN","RESERVED","OPEN","RESERVED"],
};

const avail4day2026 = {
  faulkton: ["RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","RESERVED","NA"],
  "gunners-haven": ["NA","NA","NA","NA","NA","NA","NA","NA","NA"],
  "meadow-creek": ["RESERVED","RESERVED","RESERVED","RESERVED","OPEN","OPEN","RESERVED","RESERVED","NA"],
  "pheasant-camp-lodge": ["NA","NA","NA","NA","NA","NA","NA","NA","NA"],
  "west-river-adventures": ["NA","NA","NA","NA","NA","NA","NA","NA","NA"],
};

const volumeRules = [
  { minHunters: 7, maxHunters: 7, amountOffPerHead: 20, displayOrder: 1 },
  { minHunters: 8, maxHunters: 8, amountOffPerHead: 40, displayOrder: 2 },
  { minHunters: 9, maxHunters: 9, amountOffPerHead: 60, displayOrder: 3 },
  { minHunters: 10, maxHunters: null, amountOffPerHead: 80, displayOrder: 4 },
];

const discountRules = [
  { code: "NONE", label: "Adult", category: "INDIVIDUAL", type: "FIXED", value: 0, stackOrder: 10, appliesTo: "SUBTOTAL", requiresHunterIndex: null, maxPerGroup: null },
  { code: "ADULT_COORDINATOR", label: "Adult - Group Coordinator", category: "INDIVIDUAL", type: "PERCENT", value: 10, stackOrder: 20, appliesTo: "SUBTOTAL", requiresHunterIndex: 1, maxPerGroup: 1 },
  { code: "ADULT_MILITARY", label: "Adult - Military", category: "INDIVIDUAL", type: "PERCENT", value: 5, stackOrder: 30, appliesTo: "SUBTOTAL", requiresHunterIndex: null, maxPerGroup: null },
  { code: "ADULT_HANDICAP", label: "Adult - Handicap", category: "INDIVIDUAL", type: "PERCENT", value: 5, stackOrder: 40, appliesTo: "SUBTOTAL", requiresHunterIndex: null, maxPerGroup: null },
  { code: "ADULT_LAW_ENFORCEMENT", label: "Adult - Law Enforcement", category: "INDIVIDUAL", type: "PERCENT", value: 5, stackOrder: 50, appliesTo: "SUBTOTAL", requiresHunterIndex: null, maxPerGroup: null },
  { code: "ADULT_FIREFIGHTER", label: "Adult - Firefighter", category: "INDIVIDUAL", type: "PERCENT", value: 5, stackOrder: 60, appliesTo: "SUBTOTAL", requiresHunterIndex: null, maxPerGroup: null },
  { code: "ADULT_EMT", label: "Adult - Emergency Medical Tech", category: "INDIVIDUAL", type: "PERCENT", value: 5, stackOrder: 70, appliesTo: "SUBTOTAL", requiresHunterIndex: null, maxPerGroup: null },
  { code: "ADULT_SENIOR", label: "Adult - Senior (Age 65+)", category: "INDIVIDUAL", type: "PERCENT", value: 5, stackOrder: 80, appliesTo: "SUBTOTAL", requiresHunterIndex: null, maxPerGroup: null },
  { code: "JUNIOR", label: "Junior (Age 16-17)", category: "JUNIOR", type: "PERCENT", value: 50, stackOrder: 90, appliesTo: "SUBTOTAL", requiresHunterIndex: null, maxPerGroup: 2 },
  { code: "YOUTH", label: "Youth (Age 12-15) — Free", category: "YOUTH", type: "PERCENT", value: 100, stackOrder: 100, appliesTo: "SUBTOTAL", requiresHunterIndex: null, maxPerGroup: 2 },
];

// FIX #3 & #4: extraDayRate is now dynamic per week, processingFeeRate removed
const defaultCalculatorSettings = {
  salesTaxRate: 0.057,
  earlyBirdRate: 0.05,
  lodgingRatePerNight: LODGING_RATE_PER_NIGHT,
  // extraDayRate is now a function in the actual calculator, not stored here
  extraNightRate: 100,
  // FIX #4: processingFeeRate removed (wasn't in spec files)
  hunterCountOptions: Array.from({ length: 20 }, (_, i) => i + 1),
  extraDayOptions: [0, 1, 2],
  extraNightOptions: [0, 1, 2],
  earlyBirdOptions: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }],
  depositSchedule: [
    { label: "Up to May 1", startMonth: 1, startDay: 1, endMonth: 4, endDay: 30, rate: 0.25 },
    { label: "May 1 through August 31", startMonth: 5, startDay: 1, endMonth: 8, endDay: 31, rate: 0.5 },
    { label: "September 1 through end of season", startMonth: 9, startDay: 1, endMonth: 12, endDay: 31, rate: 1.0 },
  ],
  rebookingDepositRate: 0.25,
  labels: {
    stepHeadings: { step1: "Step 1: Quote–Reserve Group Options", step2: "Step 2: Quote–Reserve Enter Hunters", step3: "Step 3: Quote–Reserve Review Totals" },
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
      optionOneBullets: ["Check the Availability page to make sure the hunt you would like to reserve is available.", "Use the Booking Tool which will calculate your deposit amount and then take you to PayPal.", "Upon completion of checkout, you will receive an automated itinerary in your email."],
      optionTwoTitle: "Option 2 – Individuals in group split up deposit",
      optionTwoBullets: ["Check the Availability page to make sure the hunt you would like to reserve is available.", "From the Quote, determine how much each member should pay as their portion of the deposit.", "Email the Individual Pay link to each member with instructions on the amount to pay."],
      groupSelectionsTitle: "Group Selections",
      hunterSelectionsTitle: "Hunter Selections",
      depositTitle: "Deposit/Booking Information",
      groupFields: { season: "Season Selected:", camp: "Camp Selected:", campTier: "Camp Tier:", package: "Package Selected:", week: "Week Selected:", totalHunters: "Total Hunters Selected:", earlyBird: "Early Bird Discount:" },
      tableHeaders: { hunterNumber: "#", hunterName: "Hunter Name", individualDiscount: "Individual Discount", baseRate: "Base Rate", volumeDiscount: "Volume Discount", extraHunting: "Extra Hunting", extraLodging: "Extra Lodging", juniorDiscount: "Junior/Youth Discount", adultDiscount: "Adult Discounts", earlyBirdDiscount: "Early Bird Discount", taxes: "Taxes 5.7%", total: "Total" },
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

async function main() {
  console.log("🌱 Seeding database...");

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

  const createdCamps = await Promise.all(camps.map((c) => prisma.camp.create({ data: c })));
  const createdWeeks = await Promise.all(weeks.map((w) => prisma.huntWeek.create({ data: w })));
  const [pkg5n4d, pkg4n3d] = await Promise.all(packages.map((p) => prisma.packageOption.create({ data: p })));

  const campBySlug = Object.fromEntries(createdCamps.map((c) => [c.slug, c]));
  const weekBySlug = Object.fromEntries(createdWeeks.map((w) => [w.slug, w]));

  for (let year of [2026, 2027]) {
    for (let wk = 1; wk <= 9; wk++) {
      const idx = wk - 1;
      const weekSlug = `week-${wk}-${year}`;
      const week = weekBySlug[weekSlug];
      if (!week) continue;
      await prisma.weekBaseRate.create({
        data: { weekId: week.id, baseRate: weekBaseRates3day[idx] },
      });
    }
  }

  async function seedSeason(seasonYear, availMap3, availMap4, defaultToOpen) {
    for (const campSlug of Object.keys(min3day)) {
      const camp = campBySlug[campSlug];
      for (let wk = 1; wk <= 9; wk++) {
        const idx = wk - 1;
        const weekSlug = `week-${wk}-${seasonYear}`;
        const week = weekBySlug[weekSlug];
        if (!week) continue;

        const base3 = weekBaseRates3day[idx];
        const dailyHunt3 = computeDailyHuntRate(base3);
        const base4 = compute4DayRate(base3);
        const dailyHunt4 = computeDailyHuntRate(base3);
        const capacity = lodgingCapacity[campSlug][idx];
        const lodgingRate = LODGING_RATE_PER_NIGHT;

        const min3 = min3day[campSlug][idx];
        const status3 = defaultToOpen ? (min3 !== null ? "OPEN" : "NA") : availMap3[campSlug][idx];
        await prisma.campWeekPricing.create({
          data: {
            camp: { connect: { id: camp.id } },
            week: { connect: { id: week.id } },
            package: { connect: { id: pkg4n3d.id } },
            baseRate: base3,
            minGroupSize: min3 ?? 0,
            lodgingCapacity: capacity,
            nightlyLodgingRate: lodgingRate,
            dailyHuntRate: dailyHunt3,
            isAvailable: status3 === "OPEN",
            availabilityTag: status3,
          },
        });

        const min4 = min4day[campSlug][idx];
        const status4 = defaultToOpen ? (min4 !== null ? "OPEN" : "NA") : availMap4[campSlug][idx];
        await prisma.campWeekPricing.create({
          data: {
            camp: { connect: { id: camp.id } },
            week: { connect: { id: week.id } },
            package: { connect: { id: pkg5n4d.id } },
            baseRate: base4,
            minGroupSize: min4 ?? 0,
            lodgingCapacity: capacity,
            nightlyLodgingRate: lodgingRate,
            dailyHuntRate: dailyHunt4,
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
  await prisma.calculatorSetting.create({ data: { id: "default", config: defaultCalculatorSettings } });

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());