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
  earlyBirdOptions: ChoiceOption<YesNoValue>[];
  depositSchedule: DepositScheduleEntry[];
  labels: CalculatorLabels;
};

// Default settings - Strictly from your documents
export const defaultCalculatorSettings: CalculatorSettings = {
  salesTaxRate: 0.057,           // 5.7% SD sales tax
  earlyBirdRate: 0.05,           // 5% early bird
  extraDayRate: 150,             // Extra day rate per day
  extraNightRate: 105,           // From Packages & Pricing.docx
  processingFeeRate: 0.0,        // No processing fee by default
  hunterCountOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15],
  extraDayOptions: [0, 1, 2, 3, 4, 5],
  extraNightOptions: [0, 1, 2, 3, 4, 5],
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
      rate: 0.50,
    },
    {
      label: "September 1 through end of season",
      startMonth: 9,
      startDay: 1,
      endMonth: 12,
      endDay: 31,
      rate: 1.00,
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
      packageLabel: "What Package?",
      earlyBirdLabel: "Does Your Group Qualify For 5% Early Bird Booking Discount?",
      campReference: "Camp",
      weekReference: "Week",
      hunterCountReference: "Hunter Count",
      packageReference: "Package",
      nextButton: "To Step 2: Enter Hunters »",
    },
    step2: {
      hunterNameHeader: "Hunter Name (Optional)",
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
        totalHunters: "Total Hunters Selected:",
        earlyBird: "Early Bird Discount:",
        week: "Week Selected:",
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
      minimumAdjustmentLabel: "Includes minimum revenue adjustment of",
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

// Normalization function
export function normalizeCalculatorSettings(value: unknown): CalculatorSettings {
  if (!value || typeof value !== "object") return defaultCalculatorSettings;

  const raw = value as Partial<CalculatorSettings>;

  return {
    salesTaxRate: typeof raw.salesTaxRate === "number" ? raw.salesTaxRate : defaultCalculatorSettings.salesTaxRate,
    earlyBirdRate: typeof raw.earlyBirdRate === "number" ? raw.earlyBirdRate : defaultCalculatorSettings.earlyBirdRate,
    extraDayRate: typeof raw.extraDayRate === "number" ? raw.extraDayRate : defaultCalculatorSettings.extraDayRate,
    extraNightRate: typeof raw.extraNightRate === "number" ? raw.extraNightRate : defaultCalculatorSettings.extraNightRate,
    processingFeeRate: typeof raw.processingFeeRate === "number" ? raw.processingFeeRate : defaultCalculatorSettings.processingFeeRate,
    hunterCountOptions: Array.isArray(raw.hunterCountOptions) ? raw.hunterCountOptions : defaultCalculatorSettings.hunterCountOptions,
    extraDayOptions: Array.isArray(raw.extraDayOptions) ? raw.extraDayOptions : defaultCalculatorSettings.extraDayOptions,
    extraNightOptions: Array.isArray(raw.extraNightOptions) ? raw.extraNightOptions : defaultCalculatorSettings.extraNightOptions,
    earlyBirdOptions: Array.isArray(raw.earlyBirdOptions) ? raw.earlyBirdOptions : defaultCalculatorSettings.earlyBirdOptions,
    depositSchedule: Array.isArray(raw.depositSchedule) ? raw.depositSchedule : defaultCalculatorSettings.depositSchedule,
    labels: raw.labels && typeof raw.labels === "object" 
      ? { ...defaultCalculatorSettings.labels, ...raw.labels } 
      : defaultCalculatorSettings.labels,
  };
}

export function calculateDepositRate(schedule: DepositScheduleEntry[], now: Date): number {
  for (const entry of schedule) {
    const start = new Date(now.getFullYear(), entry.startMonth - 1, entry.startDay);
    const end = new Date(now.getFullYear(), entry.endMonth - 1, entry.endDay, 23, 59, 59, 999);
    if (now >= start && now <= end) return entry.rate;
  }
  return schedule.at(-1)?.rate ?? 1.0;
}