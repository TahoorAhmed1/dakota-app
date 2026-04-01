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
  { minHunters: 4, maxHunters: 5, amountOffPerHead: 20, displayOrder: 1 },
  { minHunters: 6, maxHunters: 7, amountOffPerHead: 40, displayOrder: 2 },
  { minHunters: 8, maxHunters: null, amountOffPerHead: 60, displayOrder: 3 },
];

const discountRules = [
  { code: "NONE", label: "None", category: DiscountCategory.INDIVIDUAL, type: DiscountType.FIXED, value: 0, stackOrder: 10 },
  { code: "ADULT_COORDINATOR", label: "Adult - Group Coordinator", category: DiscountCategory.INDIVIDUAL, type: DiscountType.FIXED, value: 175, stackOrder: 20 },
  { code: "ADULT_MILITARY", label: "Adult - Military", category: DiscountCategory.INDIVIDUAL, type: DiscountType.FIXED, value: 125, stackOrder: 30 },
  { code: "ADULT_VETERAN", label: "Adult - Veteran", category: DiscountCategory.INDIVIDUAL, type: DiscountType.FIXED, value: 100, stackOrder: 40 },
  { code: "ADULT_SENIOR", label: "Adult - Senior", category: DiscountCategory.INDIVIDUAL, type: DiscountType.PERCENT, value: 5, stackOrder: 50 },
  { code: "JUNIOR_YOUTH", label: "Junior / Youth", category: DiscountCategory.JUNIOR, type: DiscountType.PERCENT, value: 50, stackOrder: 60 },
];

async function main() {
  await prisma.quoteHunter.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.campWeekPricing.deleteMany();
  await prisma.volumeDiscountRule.deleteMany();
  await prisma.discountRule.deleteMany();
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
