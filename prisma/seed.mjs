import { PrismaClient, DiscountCategory, DiscountType } from "@prisma/client";

const prisma = new PrismaClient();

// ─── CAMPS ───────────────────────────────────────────────────────────────────
const camps = [
  { name: "Faulkton Pheasant Camp",           slug: "faulkton",               displayOrder: 1 },
  { name: "Gunner's Haven Pheasant Camp",      slug: "gunners-haven",          displayOrder: 2 },
  { name: "Meadow Creek Pheasant Camp",        slug: "meadow-creek",           displayOrder: 3 },
  { name: "Pheasant Camp Lodge",               slug: "pheasant-camp-lodge",    displayOrder: 4 },
  { name: "West River Adventures Pheasant Camp", slug: "west-river-adventures", displayOrder: 5 },
];

// ─── WEEKS ───────────────────────────────────────────────────────────────────
const weeks = [
  { label: "Week 1 — Oct. 17–19",    slug: "week-1", seasonLabel: "2026 Season", displayOrder: 1 },
  { label: "Week 2 — Oct. 24–26",    slug: "week-2", seasonLabel: "2026 Season", displayOrder: 2 },
  { label: "Week 3 — Oct. 31–Nov. 2", slug: "week-3", seasonLabel: "2026 Season", displayOrder: 3 },
  { label: "Week 4 — Nov. 7–9",      slug: "week-4", seasonLabel: "2026 Season", displayOrder: 4 },
  { label: "Week 5 — Nov. 14–16",    slug: "week-5", seasonLabel: "2026 Season", displayOrder: 5 },
  { label: "Week 6 — Nov. 21–23",    slug: "week-6", seasonLabel: "2026 Season", displayOrder: 6 },
  { label: "Week 7 — Nov. 28–30",    slug: "week-7", seasonLabel: "2026 Season", displayOrder: 7 },
  { label: "Week 8 — Dec. 5–7",      slug: "week-8", seasonLabel: "2026 Season", displayOrder: 8 },
  { label: "Week 9 — Dec. 12–14",    slug: "week-9", seasonLabel: "2026 Season", displayOrder: 9 },
];

// ─── PACKAGES ─────────────────────────────────────────────────────────────────
const packages = [
  { code: "PKG_4N3D", label: "4 Nights / 3 Days (Standard)",  nights: 4, days: 3, displayOrder: 1 },
  { code: "PKG_5N4D", label: "5 Nights / 4 Days (Extended)",  nights: 5, days: 4, displayOrder: 2 },
];

// ─── BASE RATES (2026 - Final Corrected) ──────────────────────────────────────
const weekBaseRates = {
  1: { rate4n3d: 1749, rate5n4d: 2299 },
  2: { rate4n3d: 1649, rate5n4d: 2165 },
  3: { rate4n3d: 1549, rate5n4d: 2032 },
  4: { rate4n3d: 1449, rate5n4d: 1899 },
  5: { rate4n3d: 1449, rate5n4d: 1899 },
  6: { rate4n3d: 1449, rate5n4d: 1899 },
  7: { rate4n3d: 1449, rate5n4d: 1899 },
  8: { rate4n3d: 1299, rate5n4d: 1699 },
  9: { rate4n3d:  999, rate5n4d: 1299 },
};

// ─── MINIMUM GROUP SIZE & AVAILABILITY ────────────────────────────────────────
const min4n3d = {
  "faulkton":               [17, 17, 17, 17, 17, 17, 17, 17, null],
  "gunners-haven":          [ 6,  6,  6,  6,  6,  6, null,  6,  6],
  "meadow-creek":           [null,11, 11, 11, 11, 11, 11, 11, null],
  "pheasant-camp-lodge":    [12, 11, 10,  9,  8,  8,  8,  8,  8],
  "west-river-adventures":  [11, 11, 11, 11, 11, 11,  6, 11,  6],
};

const min5n4d = {
  "faulkton":               [13, 13, 13, 13, 13, 13, 13, 13, null],
  "meadow-creek":           [12, 10, 10,  8,  8,  8, 10, 10, null],
  "gunners-haven":          [null, null, null, null, null, null, null, null, null],
  "pheasant-camp-lodge":    [null, null, null, null, null, null, null, null, null],
  "west-river-adventures":  [null, null, null, null, null, null, null, null, null],
};

// ─── VOLUME DISCOUNT RULES ────────────────────────────────────────────────────
const volumeRules = [
  { minHunters: 7,  maxHunters:  7,  amountOffPerHead: 20, displayOrder: 1 },
  { minHunters: 8,  maxHunters:  8,  amountOffPerHead: 40, displayOrder: 2 },
  { minHunters: 9,  maxHunters:  9,  amountOffPerHead: 60, displayOrder: 3 },
  { minHunters: 10, maxHunters: null, amountOffPerHead: 80, displayOrder: 4 },
];

// ─── INDIVIDUAL DISCOUNT RULES ────────────────────────────────────────────────
const discountRules = [
  { code: "NONE",               label: "Adult",                          category: DiscountCategory.INDIVIDUAL, type: DiscountType.FIXED,   value:   0, stackOrder: 10 },
  { code: "ADULT_COORDINATOR",  label: "Adult - Group Coordinator",      category: DiscountCategory.INDIVIDUAL, type: DiscountType.PERCENT, value:  10, stackOrder: 20 },
  { code: "ADULT_MILITARY",     label: "Adult - Military",               category: DiscountCategory.INDIVIDUAL, type: DiscountType.PERCENT, value:   5, stackOrder: 30 },
  { code: "ADULT_HANDICAP",     label: "Adult - Handicap",               category: DiscountCategory.INDIVIDUAL, type: DiscountType.PERCENT, value:   5, stackOrder: 40 },
  { code: "ADULT_LAW_ENFORCEMENT", label: "Adult - Law Enforcement",     category: DiscountCategory.INDIVIDUAL, type: DiscountType.PERCENT, value:   5, stackOrder: 50 },
  { code: "ADULT_FIREFIGHTER",  label: "Adult - Firefighter",            category: DiscountCategory.INDIVIDUAL, type: DiscountType.PERCENT, value:   5, stackOrder: 60 },
  { code: "ADULT_EMT",          label: "Adult - Emergency Medical Tech", category: DiscountCategory.INDIVIDUAL, type: DiscountType.PERCENT, value:   5, stackOrder: 70 },
  { code: "ADULT_SENIOR",       label: "Adult - Senior (Age 65+)",       category: DiscountCategory.INDIVIDUAL, type: DiscountType.PERCENT, value:   5, stackOrder: 80 },
  { code: "JUNIOR",             label: "Junior (Age 16–17)",             category: DiscountCategory.JUNIOR,     type: DiscountType.PERCENT, value:  50, stackOrder: 90 },
  { code: "YOUTH",              label: "Youth (Age 12–15) — Free",       category: DiscountCategory.JUNIOR,     type: DiscountType.PERCENT, value: 100, stackOrder: 100 },
];

// ─── CALCULATOR SETTINGS (FINAL FIXED) ────────────────────────────────────────
const defaultCalculatorSettings = {
  salesTaxRate: 0.057,
  earlyBirdRate: 0.05,
  extraDayRate: 450,            // ← Fixed to match Excel ($449.67)
  extraNightRate: 100,          // ← Fixed to match Excel ($100.00)
  processingFeeRate: 0.0299,

  hunterCountOptions: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],

  extraDayOptions:   [0, 1, 2, 3],
  extraNightOptions: [0, 1, 2, 3],

  earlyBirdOptions: [
    { label: "Yes", value: "Yes" },
    { label: "No",  value: "No"  },
  ],

  depositSchedule: [
    { label: "Up to May 1",                         startMonth: 1, startDay: 1,  endMonth: 4,  endDay: 30, rate: 0.25 },
    { label: "May 1 through August 31",             startMonth: 5, startDay: 1,  endMonth: 8,  endDay: 31, rate: 0.50 },
    { label: "September 1 through end of season",   startMonth: 9, startDay: 1,  endMonth: 12, endDay: 31, rate: 1.00 },
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
      campReference: "Reference Camps",
      weekReference: "Reference Days Here",
      hunterCountReference: "Minimums and Capacities Chart",
      packageReference: "Reference Packages Here",
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
      overviewIntro: "Thank you for quoting your group's fair chase pheasant hunt at a UGUIDE South Dakota Pheasant Hunting property. You are encouraged to forward this quote to your group for their review and consideration.",
      optionsLabel: "There are two simple options to reserve your hunt:",
      optionOneTitle: "Option 1 – One group member pays deposit",
      optionOneBullets: [
        "Check the Availability page to make sure the hunt you would like to reserve is available.",
        "Use the Booking Tool which will calculate your deposit amount and then take you to PayPal to pay with credit card or PayPal account.",
        "Upon completion of checkout, you will receive an automated itinerary for your hunt package in your email.",
      ],
      optionTwoTitle: "Option 2 – Individuals in group split up deposit",
      optionTwoBullets: [
        "Check the Availability page to make sure the hunt you would like to reserve is available.",
        "From the Quote, determine how much you would like each member of your group to pay as their portion of the deposit.",
        "Email the Individual Pay link to each member of your group with instructions on the amount you would like them to pay.",
      ],
      groupSelectionsTitle: "Group Selections",
      hunterSelectionsTitle: "Hunter Selections",
      depositTitle: "Deposit/Booking Information",
      groupFields: {
        season:       "Season Selected:",
        camp:         "Camp Selected:",
        campTier:     "Camp Tier:",
        package:      "Package Selected:",
        week:         "Week Selected:",
        totalHunters: "Total Hunters Selected:",
        earlyBird:    "Early Bird Discount:",
      },
      tableHeaders: {
        hunterNumber:      "#",
        hunterName:        "Hunter Name",
        individualDiscount:"Individual Discount",
        baseRate:          "Base Rate",
        volumeDiscount:    "Volume Discount",
        extraHunting:      "Extra Hunting",
        extraLodging:      "Extra Lodging",
        juniorDiscount:    "Junior/Youth Discount",
        adultDiscount:     "Adult Discounts",
        earlyBirdDiscount: "Early Bird Discount",
        taxes:             "Taxes 5.7%",
        total:             "Total",
      },
      totalsBadgeLabel:        "Totals",
      totalPriceLabel:         "Total price after applicable discounts and state sales tax:",
      minimumAdjustmentLabel:  "Includes minimum revenue adjustment of",
      depositDescription: "Deposit % calculated is based on the time of year that you are booking a hunt. Up to May 1st it is 25%. From May 1–August 31 it is 50%. From Sept. 1 thru end of season it is 100%. Rebooking a hunt is calculated at 25%.",
      bookingNameLabel:  "Enter name of person booking the hunt:",
      bookingEmailLabel: "Enter email address of person booking the hunt:",
      depositAmountLabel:"Deposit Amount",
      depositNote:       "Note: You will be redirected to Paypal.com to make your secure deposit.",
      backButton:        "« Back to Step 2",
      submitButton:      "To Step 4: Payment »",
    },
  },
};

// ─── MAIN SEED ────────────────────────────────────────────────────────────────
async function main() {
  // Wipe in dependency order
  await prisma.quoteHunter.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.campWeekPricing.deleteMany();
  await prisma.volumeDiscountRule.deleteMany();
  await prisma.discountRule.deleteMany();
  await prisma.calculatorSetting.deleteMany();
  await prisma.packageOption.deleteMany();
  await prisma.huntWeek.deleteMany();
  await prisma.camp.deleteMany();

  // Create base records
  const createdCamps    = await Promise.all(camps.map((c) => prisma.camp.create({ data: c })));
  const createdWeeks    = await Promise.all(weeks.map((w) => prisma.huntWeek.create({ data: w })));
  const createdPackages = await Promise.all(packages.map((p) => prisma.packageOption.create({ data: p })));

  const campBySlug    = Object.fromEntries(createdCamps.map((c) => [c.slug, c]));
  const weekByOrder   = Object.fromEntries(createdWeeks.map((w) => [w.displayOrder, w]));
  const pkgByCode     = Object.fromEntries(createdPackages.map((p) => [p.code, p]));

  // Build campWeekPricing
  for (const campSlug of Object.keys(min4n3d)) {
    const camp = campBySlug[campSlug];

    for (let weekNum = 1; weekNum <= 9; weekNum++) {
      const week  = weekByOrder[weekNum];
      const rates = weekBaseRates[weekNum];

      // 4N/3D Package
      const min3 = min4n3d[campSlug][weekNum - 1];
      await prisma.campWeekPricing.create({
        data: {
          campId:          camp.id,
          weekId:          week.id,
          packageId:       pkgByCode["PKG_4N3D"].id,
          baseRate:        rates.rate4n3d,
          minGroupSize:    min3 ?? 1,
          isAvailable:     min3 !== null,
          availabilityTag: min3 === null ? "NA" : null,
        },
      });

      // 5N/4D Package
      const min4 = min5n4d[campSlug][weekNum - 1];
      await prisma.campWeekPricing.create({
        data: {
          campId:          camp.id,
          weekId:          week.id,
          packageId:       pkgByCode["PKG_5N4D"].id,
          baseRate:        rates.rate5n4d,
          minGroupSize:    min4 ?? 1,
          isAvailable:     min4 !== null,
          availabilityTag: min4 === null ? "NA" : null,
        },
      });
    }
  }

  await prisma.volumeDiscountRule.createMany({ data: volumeRules });
  await prisma.discountRule.createMany({ data: discountRules });

  await prisma.calculatorSetting.create({
    data: {
      id: "default",
      config: defaultCalculatorSettings,
    },
  });

  console.log("✅ Seed complete — Final corrected version with accurate 2026 pricing.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });