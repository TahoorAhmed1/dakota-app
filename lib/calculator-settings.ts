export type YesNoValue = "Yes" | "No";

export type ChoiceOption<T extends string | number> = {
  label: string;
  value: T;
};

export type DepositScheduleEntry = {
  label: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  rate: number;
};

export type CalculatorLabels = {
  stepHeadings: {
    step1: string;
    step2: string;
    step3: string;
  };
  step1: {
    cardTitle: string;
    requiredLabel: string;
    optionalLabel: string;
    seasonLabel: string;
    campLabel: string;
    weekLabel: string;
    hunterCountLabel: string;
    packageLabel: string;
    earlyBirdLabel: string;
    campReference: string;
    weekReference: string;
    hunterCountReference: string;
    packageReference: string;
    nextButton: string;
  };
  step2: {
    hunterNameHeader: string;
    individualDiscountHeader: string;
    extraDaysHeader: string;
    extraNightsHeader: string;
    emailLabel: string;
    backButton: string;
    nextButton: string;
  };
  step3: {
    overviewTitle: string;
    overviewIntro: string;
    optionsLabel: string;
    optionOneTitle: string;
    optionOneBullets: string[];
    optionTwoTitle: string;
    optionTwoBullets: string[];
    groupSelectionsTitle: string;
    hunterSelectionsTitle: string;
    depositTitle: string;
    groupFields: {
      season: string;
      camp: string;
      campTier: string;
      package: string;
      totalHunters: string;
      earlyBird: string;
      week: string;
    };
    tableHeaders: {
      hunterNumber: string;
      hunterName: string;
      individualDiscount: string;
      baseRate: string;
      volumeDiscount: string;
      extraHunting: string;
      extraLodging: string;
      juniorDiscount: string;
      adultDiscount: string;
      earlyBirdDiscount: string;
      taxes: string;
      total: string;
    };
    totalsBadgeLabel: string;
    totalPriceLabel: string;
    minimumAdjustmentLabel: string;
    depositDescription: string;
    bookingNameLabel: string;
    bookingEmailLabel: string;
    depositAmountLabel: string;
    depositNote: string;
    backButton: string;
    submitButton: string;
  };
};

export type CalculatorSettings = {
  salesTaxRate: number;
  earlyBirdRate: number;
  extraDayRate: number;
  extraNightRate: number;
  processingFeeRate: number;
  hunterCountOptions: number[];
  extraDayOptions: number[];
  extraNightOptions: number[];
  earlyBirdOptions: Array<ChoiceOption<YesNoValue>>;
  depositSchedule: DepositScheduleEntry[];
  labels: CalculatorLabels;
};

export const defaultCalculatorSettings: CalculatorSettings = {
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
    {
      label: "Up to May 1",
      startMonth: 1,
      startDay: 1,
      endMonth: 4,
      endDay: 30,
      rate: 0.25,
    },
    {
      label: "May 1 through August 31",
      startMonth: 5,
      startDay: 1,
      endMonth: 8,
      endDay: 31,
      rate: 0.5,
    },
    {
      label: "September 1 through end of season",
      startMonth: 9,
      startDay: 1,
      endMonth: 12,
      endDay: 31,
      rate: 1,
    },
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
      overviewIntro:
        "Thank you for quoting your group's fair chase pheasant hunt at a U-GUIDE South Dakota Pheasant Hunting property. Please review the reservation details and forward this quote to your group for consideration.",
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
      depositDescription:
        "Deposit % calculated is based on the time of year that you are booking a hunt. Up to May 1st it is 25%. From May 1-August 31 it is 50%. From Sept. 1 thru end of season it is 100%.",
      bookingNameLabel: "Enter name of person booking the hunt:",
      bookingEmailLabel: "Enter email address of person booking the hunt:",
      depositAmountLabel: "Deposit Amount",
      depositNote: "Note: You will be redirected to Paypal.com to make your secure deposit.",
      backButton: "Back to Step 2",
      submitButton: "To Offer A Payment »",
    },
  },
};

function asNumberArray(value: unknown, fallback: number[]): number[] {
  if (!Array.isArray(value)) return fallback;
  const parsed = value.filter((item): item is number => typeof item === "number");
  return parsed.length > 0 ? parsed : fallback;
}

function asOptionArray(value: unknown, fallback: Array<ChoiceOption<YesNoValue>>) {
  if (!Array.isArray(value)) return fallback;
  const parsed = value.filter(
    (item): item is ChoiceOption<YesNoValue> =>
      !!item &&
      typeof item === "object" &&
      typeof (item as { label?: unknown }).label === "string" &&
      (((item as { value?: unknown }).value === "Yes") || ((item as { value?: unknown }).value === "No"))
  );
  return parsed.length > 0 ? parsed : fallback;
}

function asDepositSchedule(value: unknown, fallback: DepositScheduleEntry[]): DepositScheduleEntry[] {
  if (!Array.isArray(value)) return fallback;
  const parsed = value.filter(
    (item): item is DepositScheduleEntry =>
      !!item &&
      typeof item === "object" &&
      typeof (item as { label?: unknown }).label === "string" &&
      typeof (item as { startMonth?: unknown }).startMonth === "number" &&
      typeof (item as { startDay?: unknown }).startDay === "number" &&
      typeof (item as { endMonth?: unknown }).endMonth === "number" &&
      typeof (item as { endDay?: unknown }).endDay === "number" &&
      typeof (item as { rate?: unknown }).rate === "number"
  );
  return parsed.length > 0 ? parsed : fallback;
}

function mergeLabels(value: unknown): CalculatorLabels {
  if (!value || typeof value !== "object") return defaultCalculatorSettings.labels;

  const labels = value as Partial<CalculatorLabels>;

  return {
    stepHeadings: {
      ...defaultCalculatorSettings.labels.stepHeadings,
      ...labels.stepHeadings,
    },
    step1: {
      ...defaultCalculatorSettings.labels.step1,
      ...labels.step1,
    },
    step2: {
      ...defaultCalculatorSettings.labels.step2,
      ...labels.step2,
    },
    step3: {
      ...defaultCalculatorSettings.labels.step3,
      ...labels.step3,
      groupFields: {
        ...defaultCalculatorSettings.labels.step3.groupFields,
        ...labels.step3?.groupFields,
      },
      tableHeaders: {
        ...defaultCalculatorSettings.labels.step3.tableHeaders,
        ...labels.step3?.tableHeaders,
      },
      optionOneBullets:
        labels.step3?.optionOneBullets?.length
          ? labels.step3.optionOneBullets
          : defaultCalculatorSettings.labels.step3.optionOneBullets,
      optionTwoBullets:
        labels.step3?.optionTwoBullets?.length
          ? labels.step3.optionTwoBullets
          : defaultCalculatorSettings.labels.step3.optionTwoBullets,
    },
  };
}

export function normalizeCalculatorSettings(value: unknown): CalculatorSettings {
  if (!value || typeof value !== "object") return defaultCalculatorSettings;

  const raw = value as Partial<CalculatorSettings>;

  return {
    salesTaxRate:
      typeof raw.salesTaxRate === "number" ? raw.salesTaxRate : defaultCalculatorSettings.salesTaxRate,
    earlyBirdRate:
      typeof raw.earlyBirdRate === "number" ? raw.earlyBirdRate : defaultCalculatorSettings.earlyBirdRate,
    extraDayRate:
      typeof raw.extraDayRate === "number" ? raw.extraDayRate : defaultCalculatorSettings.extraDayRate,
    extraNightRate:
      typeof raw.extraNightRate === "number" ? raw.extraNightRate : defaultCalculatorSettings.extraNightRate,
    processingFeeRate:
      typeof raw.processingFeeRate === "number"
        ? raw.processingFeeRate
        : defaultCalculatorSettings.processingFeeRate,
    hunterCountOptions: asNumberArray(raw.hunterCountOptions, defaultCalculatorSettings.hunterCountOptions),
    extraDayOptions: asNumberArray(raw.extraDayOptions, defaultCalculatorSettings.extraDayOptions),
    extraNightOptions: asNumberArray(raw.extraNightOptions, defaultCalculatorSettings.extraNightOptions),
    earlyBirdOptions: asOptionArray(raw.earlyBirdOptions, defaultCalculatorSettings.earlyBirdOptions),
    depositSchedule: asDepositSchedule(raw.depositSchedule, defaultCalculatorSettings.depositSchedule),
    labels: mergeLabels(raw.labels),
  };
}

export function calculateDepositRate(schedule: DepositScheduleEntry[], now: Date): number {
  for (const entry of schedule) {
    const start = new Date(now.getFullYear(), entry.startMonth - 1, entry.startDay, 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), entry.endMonth - 1, entry.endDay, 23, 59, 59, 999);
    if (now >= start && now <= end) {
      return entry.rate;
    }
  }

  return schedule.at(-1)?.rate ?? defaultCalculatorSettings.depositSchedule.at(-1)?.rate ?? 1;
}