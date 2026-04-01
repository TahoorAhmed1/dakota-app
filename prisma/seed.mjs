import { PrismaClient, DiscountCategory, DiscountType } from "@prisma/client";

const prisma = new PrismaClient();

const camps = [
  { name: "Faulkton Pheasant Camp", slug: "faulkton", displayOrder: 1 },
  { name: "Gunners Haven", slug: "gunners-haven", displayOrder: 2 },
  { name: "Meadow Creek Pheasant Camp", slug: "meadow-creek", displayOrder: 3 },
  { name: "Pheasant Camp Lodge", slug: "pheasant-camp-lodge", displayOrder: 4 },
  { name: "West River Adventures", slug: "west-river-adventures", displayOrder: 5 },
];

const weeks = [
  { label: "Week 1 - Oct. 17-19", slug: "week-1", seasonLabel: "2026 Season", displayOrder: 1 },
  { label: "Week 2 - Oct. 24-26", slug: "week-2", seasonLabel: "2026 Season", displayOrder: 2 },
  { label: "Week 3 - Oct. 31-Nov. 02", slug: "week-3", seasonLabel: "2026 Season", displayOrder: 3 },
  { label: "Week 4 - Nov. 07-09", slug: "week-4", seasonLabel: "2026 Season", displayOrder: 4 },
  { label: "Week 5 - Nov. 14-16", slug: "week-5", seasonLabel: "2026 Season", displayOrder: 5 },
  { label: "Week 6 - Nov. 21-23", slug: "week-6", seasonLabel: "2026 Season", displayOrder: 6 },
  { label: "Week 7 - Nov. 28-30", slug: "week-7", seasonLabel: "2026 Season", displayOrder: 7 },
  { label: "Week 8 - Dec. 05-07", slug: "week-8", seasonLabel: "2026 Season", displayOrder: 8 },
  { label: "Week 9 - Dec. 12-14", slug: "week-9", seasonLabel: "2026 Season", displayOrder: 9 },
];

const packages = [
  { code: "PKG_4N3D", label: "4 Nights / 3 Days", nights: 4, days: 3, displayOrder: 1 },
  { code: "PKG_3N2D", label: "3 Nights / 2 Days", nights: 3, days: 2, displayOrder: 2 },
  { code: "PKG_5N4D", label: "5 Nights / 4 Days", nights: 5, days: 4, displayOrder: 3 },
];

const volumeRules = [
  { minHunters: 7, maxHunters: 7, amountOffPerHead: 20, displayOrder: 1 },
  { minHunters: 8, maxHunters: 8, amountOffPerHead: 40, displayOrder: 2 },
  { minHunters: 9, maxHunters: 9, amountOffPerHead: 60, displayOrder: 3 },
  { minHunters: 10, maxHunters: null, amountOffPerHead: 80, displayOrder: 4 },
];

const discountRules = [
  { code: "NONE", label: "Adult", category: DiscountCategory.INDIVIDUAL, type: DiscountType.FIXED, value: 0, stackOrder: 10 },
  { code: "ADULT_COORDINATOR", label: "Adult - Group Coordinator", category: DiscountCategory.INDIVIDUAL, type: DiscountType.PERCENT, value: 10, stackOrder: 20 },
  { code: "ADULT_MILITARY", label: "Adult - Military", category: DiscountCategory.INDIVIDUAL, type: DiscountType.PERCENT, value: 5, stackOrder: 30 },
  { code: "ADULT_HANDICAP", label: "Adult - Handicap", category: DiscountCategory.INDIVIDUAL, type: DiscountType.PERCENT, value: 5, stackOrder: 40 },
  { code: "ADULT_LAW_ENFORCEMENT", label: "Adult - Law Enforcement", category: DiscountCategory.INDIVIDUAL, type: DiscountType.PERCENT, value: 5, stackOrder: 50 },
  { code: "ADULT_FIREFIGHTER", label: "Adult - Firefighter", category: DiscountCategory.INDIVIDUAL, type: DiscountType.PERCENT, value: 5, stackOrder: 60 },
  { code: "ADULT_EMT", label: "Adult - Emergency Medical Tech", category: DiscountCategory.INDIVIDUAL, type: DiscountType.PERCENT, value: 5, stackOrder: 70 },
  { code: "ADULT_SENIOR", label: "Adult - Senior (Age 65+)", category: DiscountCategory.INDIVIDUAL, type: DiscountType.PERCENT, value: 5, stackOrder: 80 },
  { code: "JUNIOR", label: "Junior (Age 16-17)", category: DiscountCategory.JUNIOR, type: DiscountType.PERCENT, value: 50, stackOrder: 90 },
  { code: "YOUTH", label: "Youth (Age 12-15)", category: DiscountCategory.JUNIOR, type: DiscountType.PERCENT, value: 100, stackOrder: 100 },
];

const defaultCalculatorSettings = {
  salesTaxRate: 0.057,
  earlyBirdRate: 0.05,
  extraDayRate: 225,
  extraNightRate: 165,
  processingFeeRate: 0.0299,
  hunterCountOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  extraDayOptions: [0, 1, 2, 3],
  extraNightOptions: [0, 1, 2, 3],
  earlyBirdOptions: [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ],
  depositSchedule: [
    { label: "Up to May 1", startMonth: 1, startDay: 1, endMonth: 4, endDay: 30, rate: 0.25 },
    { label: "May 1 through August 31", startMonth: 5, startDay: 1, endMonth: 8, endDay: 31, rate: 0.5 },
    { label: "September 1 through end of season", startMonth: 9, startDay: 1, endMonth: 12, endDay: 31, rate: 1 },
  ],
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
      packageLabel: "How Many Days?",
      earlyBirdLabel: "5% Early Bird Booking Discount?",
      campReference: "Reference Camps",
      weekReference: "Reference Days Camps",
      hunterCountReference: "Minimums and Capacities Chart",
      packageReference: "Minimums and Capacities Chart",
      nextButton: "To Step 2: Enter Hunters »",
    },
    step2: {
      hunterNameHeader: "Hunter Name",
      individualDiscountHeader: "Individual Discount",
      extraDaysHeader: "Extra Days Hunting",
      extraNightsHeader: "Extra Nights Lodging",
      emailLabel: "Enter your email address to receive a copy of the quote:",
      backButton: "Back to Step 1",
      nextButton: "To Step 3: Review Total »",
    },
    step3: {
      overviewTitle: "Quote Details and Payment Options",
      overviewIntro: "Thank you for quoting your group's fair chase pheasant hunt at a U-GUIDE South Dakota Pheasant Hunting property. Please review the reservation details and forward this quote to your group for consideration.",
      optionsLabel: "There are two simple options to reserve your hunt.",
      optionOneTitle: "Option 1 - First Group Member Pays Deposit",
      optionOneBullets: [
        "Check the Availability page to make sure the hunt you would like to reserve is available.",
        "Use the Booking Tool to calculate your deposit amount and continue to Paypal using credit card or Paypal account.",
        "Upon completion of checkout, you will receive an automated itinerary for your hunt package by email.",
      ],
      optionTwoTitle: "Option 2 - Individuals In Group Split Up Deposit",
      optionTwoBullets: [
        "Check the Availability page to make sure the hunt you would like to reserve is available.",
        "From the Quote page, determine how much you would like each member of your group to pay as their portion of the deposit.",
        "Email the Individual Pay link to each member of your group with instructions on the amount you would like them to pay.",
      ],
      groupSelectionsTitle: "Group Selections",
      hunterSelectionsTitle: "Hunter Selections",
      depositTitle: "Deposit/Booking Information",
      groupFields: {
        season: "Season Selected",
        camp: "Camp Selected",
        campTier: "Camp Tier",
        package: "Package Selected",
        totalHunters: "Total Hunters Selected",
        earlyBird: "Early Bird Discount",
        week: "Week Selected",
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
        adultDiscount: "Adult Discount",
        earlyBirdDiscount: "Early Bird Discount",
        taxes: "Taxes 5.7%",
        total: "Total",
      },
      totalsBadgeLabel: "Totals",
      totalPriceLabel: "Total price after applicable discounts and state sales tax:",
      minimumAdjustmentLabel: "Includes minimum revenue adjustment of",
      depositDescription: "Deposit % calculated is based on the time of year that you are booking a hunt. Up to May 1st it is 25%. From May 1-August 31 it is 50%. From Sept. 1 thru end of season it is 100%.",
      bookingNameLabel: "Enter name of person booking the hunt:",
      bookingEmailLabel: "Enter email address of person booking the hunt:",
      depositAmountLabel: "Deposit Amount",
      depositNote: "Note: You will be redirected to Paypal.com to make your secure deposit.",
      backButton: "Back to Step 2",
      submitButton: "To Offer A Payment »",
    },
  },
};

async function main() {
  await prisma.quoteHunter.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.campWeekPricing.deleteMany();
  await prisma.volumeDiscountRule.deleteMany();
  await prisma.discountRule.deleteMany();
  await prisma.calculatorSetting.deleteMany();
  await prisma.packageOption.deleteMany();
  await prisma.huntWeek.deleteMany();
  await prisma.camp.deleteMany();

  const createdCamps = await Promise.all(camps.map((camp) => prisma.camp.create({ data: camp })));
  const createdWeeks = await Promise.all(weeks.map((week) => prisma.huntWeek.create({ data: week })));
  const createdPackages = await Promise.all(packages.map((pkg) => prisma.packageOption.create({ data: pkg })));

  for (const camp of createdCamps) {
    for (const week of createdWeeks) {
      for (const pkg of createdPackages) {
        await prisma.campWeekPricing.create({
          data: {
            campId: camp.id,
            weekId: week.id,
            packageId: pkg.id,
            baseRate: pkg.code === "PKG_3N2D" ? 1399 : pkg.code === "PKG_5N4D" ? 2099 : 1749,
            minGroupSize: pkg.code === "PKG_3N2D" ? 4 : 6,
            isAvailable: true,
            availabilityTag: null,
          },
        });
      }
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

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
