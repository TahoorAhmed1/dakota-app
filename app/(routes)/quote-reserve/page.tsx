"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { CalculatorSettings, calculateDepositRate } from "@/lib/calculator-settings";
import { InfoIcon  } from "lucide-react";

type StepOneData = {
  seasonLabel: string;
  campId: string;
  weekId: string;
  hunterCount: number;
  packageId: string;
  earlyBird: "Yes" | "No";
};

type HunterForm = {
  id: number;
  name: string;
  discountCode: string;
  extraDays: number;
  extraNights: number;
};

type ValidationErrors = Partial<{
  step1: string;
  step2: string;
  step3: string;
  quoteEmail: string;
  bookingName: string;
  bookingEmail: string;
  pricing: string;
}>;

type CalculatorConfig = {
  camps: Array<{ id: string; name: string; slug: string }>;
  weeks: Array<{ id: string; label: string; slug: string; seasonLabel: string }>;
  packages: Array<{ id: string; code: string; label: string; days: number; nights: number }>;
  pricingRows: Array<{
    id: string;
    campId: string;
    weekId: string;
    packageId: string;
    baseRate: number;
    minGroupSize: number;
    isAvailable: boolean;
    availabilityTag: string | null;
  }>;
  volumeRules: Array<{
    id: string;
    minHunters: number;
    maxHunters: number | null;
    amountOffPerHead: number;
  }>;
  discountRules: Array<{
    id: string;
    code: string;
    label: string;
    category: "INDIVIDUAL" | "JUNIOR";
    type: "FIXED" | "PERCENT";
    value: number;
    stackOrder: number;
  }>;
  settings: CalculatorSettings;
};

const makeHunter = (id: number): HunterForm => ({
  id,
  name: "",
  discountCode: "NONE",
  extraDays: 0,
  extraNights: 0,
});

const getVolumeDiscount = (
  rules: CalculatorConfig["volumeRules"],
  count: number
) => {
  const matched = rules.find((rule) => {
    if (count < rule.minHunters) return false;
    if (rule.maxHunters == null) return true;
    return count <= rule.maxHunters;
  });
  return matched ? matched.amountOffPerHead : 0;
};

const formatCampOptionLabel = (name: string) =>
  name
    .replace(/ Pheasant Camp$/i, "")
    .replace(/^Faulkton Pheasant Camp$/i, "Faulkton");

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 py-5">
      <div className="h-px flex-1 bg-[#d7b299]" />
      <span className="text-[12px] font-normal uppercase tracking-[0.15em] text-[#e97933]">
        {label}
      </span>
      <div className="h-px flex-1 bg-[#d7b299]" />
    </div>
  );
}

function FieldRow({
  label,
  children,
  reference,
}: {
  label: string;
  children: React.ReactNode;
  reference?: string;
}) {
  return (
    <div className="grid grid-cols-1 border-b border-[#d9d9d9] px-8 py-5 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-10">
      <label className="text-[15px] font-semibold text-[#2b1a0f]">
        <span className="mr-1 text-[#f26f2d]">*</span>
        {label}
        <span className="ml-1 text-[#f26f2d]">●</span>
      </label>

      <div className="mt-3 flex items-center gap-2 md:mt-0">

        {children}
        {reference ? (
          <span className="text-[12px] w-fit font-semibold text-[#f26f2d]">
            ({reference})
          </span>
        ) : null}
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] border-b border-[#d9d9d9] px-8 py-4 text-[14px] font-semibold text-[#2b1a0f]">
      <span>{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function QuoteReservePage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [quotePdfUrl, setQuotePdfUrl] = useState("");

  const [config, setConfig] = useState<CalculatorConfig | null>(null);
  const [configError, setConfigError] = useState("");

  const [groupData, setGroupData] = useState<StepOneData>({
    seasonLabel: "",
    campId: "",
    weekId: "",
    hunterCount: 8,
    packageId: "",
    earlyBird: "No",
  });

  const [hunters, setHunters] = useState<HunterForm[]>(
    Array.from({ length: 8 }, (_, i) => makeHunter(i + 1))
  );

  const [quoteEmail, setQuoteEmail] = useState("");
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    async function loadConfig() {
      try {
        let data: CalculatorConfig | null = null;

        for (let attempt = 0; attempt < 3; attempt += 1) {
          const response = await fetch("/api/calculator/config", {
            cache: "no-store",
          });
          const payload = (await response.json().catch(() => ({}))) as
            | CalculatorConfig
            | { error?: string; message?: string };

          if (response.ok) {
            data = payload as CalculatorConfig;
            break;
          }

          if (response.status === 503 && attempt < 2) {
            await delay(500 * (attempt + 1));
            continue;
          }

          const message =
            (typeof (payload as { error?: string }).error === "string" &&
              (payload as { error?: string }).error) ||
            (typeof (payload as { message?: string }).message === "string" &&
              (payload as { message?: string }).message) ||
            "Failed to load calculator configuration.";

          throw new Error(message);
        }

        if (!data) {
          throw new Error("Failed to load calculator configuration.");
        }

        setConfig(data);

        const firstSeason = data.weeks[0]?.seasonLabel ?? "";
        const firstWeek = data.weeks.find((week) => week.seasonLabel === firstSeason)?.id ?? "";

        setGroupData((prev) => ({
          ...prev,
          seasonLabel: firstSeason,
          campId: data.camps[0]?.id ?? "",
          weekId: firstWeek,
          packageId: data.packages[0]?.id ?? "",
        }));
      } catch (error) {
        console.error(error);
        setConfigError(
          error instanceof Error
            ? error.message
            : "Unable to load quote data right now. Please refresh and try again."
        );
      }
    }

    loadConfig();
  }, []);

  useEffect(() => {
    setHunters((prev) =>
      Array.from({ length: groupData.hunterCount }, (_, i) => {
        const prior = prev[i];
        if (!prior) return makeHunter(i + 1);
        return { ...prior, id: i + 1 };
      })
    );
  }, [groupData.hunterCount]);

  const seasonOptions = useMemo(() => {
    if (!config) return [];
    return Array.from(new Set(config.weeks.map((week) => week.seasonLabel)));
  }, [config]);

  const weekOptions = useMemo(() => {
    if (!config) return [];
    return config.weeks.filter((week) => week.seasonLabel === groupData.seasonLabel);
  }, [config, groupData.seasonLabel]);

  const selectedCamp = useMemo(
    () => config?.camps.find((camp) => camp.id === groupData.campId),
    [config, groupData.campId]
  );

  const selectedWeek = useMemo(
    () => config?.weeks.find((week) => week.id === groupData.weekId),
    [config, groupData.weekId]
  );

  const selectedPackage = useMemo(
    () => config?.packages.find((pkg) => pkg.id === groupData.packageId),
    [config, groupData.packageId]
  );

  const selectedCampLabel = useMemo(
    () => (selectedCamp ? formatCampOptionLabel(selectedCamp.name) : "-"),
    [selectedCamp]
  );

  const selectedPackageLabel = useMemo(() => {
    if (!selectedPackage) return "-";

    return `${selectedPackage.nights} Night${selectedPackage.nights === 1 ? "" : "s"} / ${selectedPackage.days} Day${selectedPackage.days === 1 ? "" : "s"}`;
  }, [selectedPackage]);

  const discountMap = useMemo(() => {
    const map = new Map<string, CalculatorConfig["discountRules"][number]>();
    (config?.discountRules ?? []).forEach((rule) => map.set(rule.code, rule));
    return map;
  }, [config]);

  const discountOptions = useMemo(() => {
    if (!config) {
      return [
        { code: "NONE", label: "Adult - Group Coordinator" },
        { code: "JUNIOR", label: "Junior Discount" },
      ];
    }

    const options = config.discountRules
      .slice()
      .sort((a, b) => a.stackOrder - b.stackOrder)
      .map((rule) => ({ code: rule.code, label: rule.label }));

    if (!options.length) {
      return [
        { code: "NONE", label: "Adult - Group Coordinator" },
        { code: "JUNIOR", label: "Junior Discount" },
      ];
    }

    const withDefault = [{ code: "NONE", label: "Adult - Group Coordinator" }, ...options];
    return withDefault.reduce((acc, option) => {
      if (!acc.some((item) => item.code === option.code)) acc.push(option);
      return acc;
    }, [] as { code: string; label: string }[]);
  }, [config]);

  const dayOptions = useMemo(() => {
    if (!config) return [];

    return config.packages
      .slice()
      .sort((a, b) => a.days - b.days)
      .map((pkg) => ({ id: pkg.id, days: pkg.days }));
  }, [config]);

  const selectedPricing = useMemo(() => {
    if (!config) return null;
    return (
      config.pricingRows.find(
        (row) =>
          row.campId === groupData.campId &&
          row.weekId === groupData.weekId &&
          row.packageId === groupData.packageId
      ) ?? null
    );
  }, [config, groupData]);

  const settings = config?.settings;

  const pricingRows = useMemo(() => {
    if (!config || !selectedPricing) return [];

    const volumeDiscount = getVolumeDiscount(config.volumeRules, groupData.hunterCount);

    return hunters.map((hunter, idx) => {
      const baseRate = selectedPricing.baseRate;
      const rule = discountMap.get(hunter.discountCode) ?? discountMap.get("NONE");
      const extraHunting = hunter.extraDays * (settings?.extraDayRate ?? 225);
      const extraLodging = hunter.extraNights * (settings?.extraNightRate ?? 165);
      const rateAfterVolume = baseRate - volumeDiscount;
      const earlyBirdDiscount =
        groupData.earlyBird === "Yes" ? rateAfterVolume * (settings?.earlyBirdRate ?? 0.05) : 0;

      let individualDiscount = 0;
      let juniorDiscount = 0;

      if (rule?.category === "INDIVIDUAL") {
        const baseForIndividual = rateAfterVolume - earlyBirdDiscount;
        if (rule.type === "PERCENT") {
          individualDiscount = baseForIndividual * (rule.value / 100);
        } else {
          individualDiscount = rule.value;
        }
      }

      if (rule?.category === "JUNIOR") {
        if (rule.type === "PERCENT") {
          juniorDiscount = rateAfterVolume * (rule.value / 100);
        } else {
          juniorDiscount = rule.value;
        }
      }

      const subtotalBeforeTax =
        rateAfterVolume -
        earlyBirdDiscount -
        individualDiscount -
        juniorDiscount +
        extraHunting +
        extraLodging;
      const tax = subtotalBeforeTax * (settings?.salesTaxRate ?? 0.057);
      const total = subtotalBeforeTax + tax;

      return {
        ...hunter,
        rowIndex: idx + 1,
        discountLabel: rule?.label ?? "None",
        baseRate,
        volumeDiscount,
        extraHunting,
        extraLodging,
        earlyBirdDiscount,
        individualDiscount,
        juniorDiscount,
        tax,
        subtotalBeforeTax,
        total,
      };
    });
  }, [config, selectedPricing, groupData, hunters, discountMap]);

  const subtotalBeforeTax = pricingRows.reduce((sum, row) => sum + row.subtotalBeforeTax, 0);
  const minimumRevenueFloor = selectedPricing
    ? selectedPricing.baseRate * selectedPricing.minGroupSize
    : 0;
  const minimumAdjustment = Math.max(0, minimumRevenueFloor - subtotalBeforeTax);
  const taxableSubtotal = subtotalBeforeTax + minimumAdjustment;
  const totalTax = taxableSubtotal * (settings?.salesTaxRate ?? 0.057);
  const grandSubtotal = taxableSubtotal + totalTax;

  const today = new Date();
  const depositRate = config
    ? calculateDepositRate(config.settings.depositSchedule, today)
    : 1;

  const depositBase = grandSubtotal * depositRate;
  const processingFee = depositBase * (config?.settings.processingFeeRate ?? 0.0299);
  const depositTotal = depositBase + processingFee;

  const labels = settings?.labels;
  const taxLabel = `Taxes ${((settings?.salesTaxRate ?? 0.057) * 100).toFixed(1)}%`;

  const validateStepOne = (): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!config) {
      errors.step1 = "Configuration is still loading. Please wait a moment.";
      return errors;
    }

    if (!groupData.seasonLabel || !groupData.campId || !groupData.weekId || !groupData.packageId) {
      errors.step1 = "Complete all required group selections before continuing.";
    }

    if (!selectedPricing) {
      errors.pricing = "The selected camp, week, and day combination does not have pricing configured yet.";
    } else if (!selectedPricing.isAvailable) {
      errors.pricing = "The selected camp, week, and day combination is currently unavailable.";
    }

    return errors;
  };

  const validateStepTwo = (): ValidationErrors => {
    const errors = validateStepOne();

    // Hunter names are now optional, so we do not check for missing names.
    const overlongHunter = hunters.find((hunter) => hunter.name.trim().length > 120);
    if (overlongHunter) {
      errors.step2 = `Hunter ${overlongHunter.id} name must be 120 characters or less.`;
    }

    if (quoteEmail.trim() && !isValidEmail(quoteEmail.trim())) {
      errors.quoteEmail = "Enter a valid email address to send a copy of the quote.";
    }

    return errors;
  };

  const validateStepThree = (): ValidationErrors => {
    const errors = validateStepTwo();

    if (!bookingName.trim()) {
      errors.bookingName = "Enter the booking name.";
    } else if (bookingName.trim().length > 120) {
      errors.bookingName = "Booking name must be 120 characters or less.";
    }

    if (!bookingEmail.trim()) {
      errors.bookingEmail = "Enter the booking email address.";
    } else if (!isValidEmail(bookingEmail.trim())) {
      errors.bookingEmail = "Enter a valid booking email address.";
    }

    if (!errors.step3 && (errors.bookingName || errors.bookingEmail)) {
      errors.step3 = "Fix the booking details before submitting the quote.";
    }

    return errors;
  };

  const goToStep2 = () => {
    const errors = validateStepOne();
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setStep(2);
  };

  const goToStep3 = () => {
    const errors = validateStepTwo();
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setStep(3);
  };

  const handleSubmit = async () => {
    const errors = validateStepThree();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setSubmitMessage("Please fix the highlighted form errors and try again.");
      return;
    }

    if (!config || !groupData.campId || !groupData.weekId || !groupData.packageId) {
      setSubmitMessage("Configuration not loaded yet. Please wait and try again.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");
    setQuotePdfUrl("");

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seasonLabel: groupData.seasonLabel,
          campId: groupData.campId,
          weekId: groupData.weekId,
          packageId: groupData.packageId,
          hunterCount: groupData.hunterCount,
          earlyBird: groupData.earlyBird === "Yes",
          hunters: hunters.map((hunter) => ({
            name: hunter.name,
            discountCode: hunter.discountCode,
            extraDays: hunter.extraDays,
            extraNights: hunter.extraNights,
          })),
          quoteEmail,
          bookingName,
          bookingEmail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage(`Quote submitted successfully! Quote #: ${data.quoteNumber}`);
        if (typeof data.pdfUrl === "string") {
          setQuotePdfUrl(data.pdfUrl);
        }
      } else {
        setSubmitMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Quote submission error:", error);
      setSubmitMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col">
      <section className="QuoteReserveImage relative flex min-h-[340px] items-center justify-center px-4 pb-20 pt-24 sm:min-h-[420px] sm:px-6 sm:pb-24 sm:pt-28 md:min-h-[520px] lg:min-h-[620px]">
        <div className="absolute inset-0 " />
        <div className="absolute inset-0 " />

        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="text-[38px] font-bold uppercase leading-none tracking-[-0.03em] text-[#281703] sm:text-[54px] md:text-[68px] lg:text-[76px]">
            Quote-Reserve
          </h1>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#281703] sm:mt-6 sm:gap-3 sm:text-[12px]">
            <Link
              href="/"
              className="flex items-center gap-2 transition-colors hover:text-[#F16724]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3.172 3 10.2V21h6v-6h6v6h6V10.2l-9-7.028Z" />
              </svg>
              <span>Home</span>
            </Link>

            <span>›</span>
            <span>Quote-Reserve</span>
          </div>
        </div>

       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/70 animate-bounce">
          <span className="text-[11px] tracking-widest uppercase">Scroll</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </section>

      <section className="bg-[#E7DCCF] px-4 pb-20 pt-14 sm:pt-16 md:px-6 md:pb-24 md:pt-20">
        <div className="mx-auto max-w-295">
          <h2 className="text-center text-[24px] font-bold uppercase tracking-[0.04em] text-[#281703] underline decoration-[3px] underline-offset-[6px] sm:text-[30px] md:text-[54px]">
            {step === 1 && (labels?.stepHeadings.step1 ?? "Step 1: Quote\u2013Reserve Group Options")}
            {step === 2 && (labels?.stepHeadings.step2 ?? "Step 2: Quote\u2013Reserve Enter Hunters")}
            {step === 3 && (labels?.stepHeadings.step3 ?? "Step 3: Quote\u2013Reserve Review Totals")}
          </h2>

          {configError ? (
            <div className="mt-8 rounded-md bg-red-100 px-6 py-4 text-center font-semibold text-red-800">
              {configError}
            </div>
          ) : null}

          {validationErrors.pricing ? (
            <div className="mt-6 rounded-md bg-red-100 px-6 py-4 text-center text-sm font-semibold text-red-800">
              {validationErrors.pricing}
            </div>
          ) : null}

          {validationErrors.step1 ? (
            <div className="mt-6 rounded-md bg-red-100 px-6 py-4 text-center text-sm font-semibold text-red-800">
              {validationErrors.step1}
            </div>
          ) : null}

          <div className="mt-8 overflow-hidden rounded-[18px] bg-[#f5f5f5] shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
         {step === 1 && (
              <div className="overflow-hidden rounded-b-[18px] border border-[#d9d9d9] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.13)]">
    {/* Header */}
    <div className="bg-[#4c2c11] px-4 py-5 text-center font-normal uppercase text-white md:py-6">
      <h1 className="text-[20px] tracking-tight sm:text-[26px] md:text-[34px]">
        {labels?.step1.cardTitle ?? "Price Your Own Hunt in 3 Simple Steps"}
      </h1>
    </div>

    <div className="bg-white px-4 py-6 md:px-12">
      {/* Required Fields Section */}
      <div className="mb-4">
        <SectionDivider label={labels?.step1.requiredLabel ?? "REQUIRED FIELDS"} />
      </div>

      <div className="divide-y divide-[#d9d9d9] border border-[#d9d9d9]">
        {/* Field Row: Season */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_0.8fr] items-center">
          <label className="flex items-center px-6 py-4 text-[15px] font-bold text-[#2b1a0f]">
            <span className="mr-1 text-[#f26f2d]">*</span>
            {labels?.step1.seasonLabel ?? "What Season Is Your Group Hunting In?"}
            <InfoIcon className="ml-1 h-4 w-4 text-[#f26f2d]"  />
          </label>
          <div className="border-l border-[#d9d9d9] p-3 md:col-span-2">
            <select
              value={groupData.seasonLabel}
              onChange={(e) => {
                const newSeason = e.target.value;
                const firstWeek = config?.weeks.find((w) => w.seasonLabel === newSeason)?.id ?? "";
                setGroupData((prev) => ({ ...prev, seasonLabel: newSeason, weekId: firstWeek }));
              }}
              className="h-10 w-full rounded border border-[#9f9f9f] bg-white px-3 text-[14px] text-[#5a5a5a] outline-none"
            >
              {seasonOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Field Row: Camp */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_0.8fr] items-center">
          <label className="flex items-center px-6 py-4 text-[15px] font-bold text-[#2b1a0f]">
            <span className="mr-1 text-[#f26f2d]">*</span>
            {labels?.step1.campLabel ?? "What Camp Is Your Group Going To?"}
            <InfoIcon className="ml-1 h-4 w-4 text-[#f26f2d]"  />
          </label>
          <div className="flex items-center border-l border-[#d9d9d9] p-3 md:col-span-2">
            <select
              value={groupData.campId}
              onChange={(e) => setGroupData((prev) => ({ ...prev, campId: e.target.value }))}
              className="h-10 w-full rounded border border-[#9f9f9f] bg-white px-3 text-[14px] text-[#5a5a5a] outline-none"
            >
              <option value="">Select a Camp</option>
              {(config?.camps ?? []).map((camp) => (
                <option key={camp.id} value={camp.id}>{formatCampOptionLabel(camp.name)}</option>
              ))}
            </select>
            <span className="ml-3 whitespace-nowrap text-[12px] text-[#f26f2d] underline cursor-pointer">
              (Reference Camps)
            </span>
          </div>
        </div>

        {/* Field Row: Week */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_0.8fr] items-center">
          <label className="flex items-center px-6 py-4 text-[15px] font-bold text-[#2b1a0f]">
            <span className="mr-1 text-[#f26f2d]">*</span>
            {labels?.step1.weekLabel ?? "What Week Is Your Group Going?"}
            <InfoIcon className="ml-1 h-4 w-4 text-[#f26f2d]" />
          </label>
          <div className="flex items-center border-l border-[#d9d9d9] p-3 md:col-span-2">
            <select
              value={groupData.weekId}
              onChange={(e) => setGroupData((prev) => ({ ...prev, weekId: e.target.value }))}
              className="h-10 w-full rounded border border-[#9f9f9f] bg-white px-3 text-[14px] text-[#5a5a5a] outline-none"
            >
              <option value="">Select Which Week</option>
              {weekOptions.map((week) => (
                <option key={week.id} value={week.id}>{week.label}</option>
              ))}
            </select>
            <span className="ml-3 whitespace-nowrap text-[12px] text-[#f26f2d] underline cursor-pointer">
              (Reference Days Camps)
            </span>
          </div>
        </div>

        {/* Field Row: Hunters */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_0.8fr] items-center">
          <label className="flex items-center px-6 py-4 text-[15px] font-bold text-[#2b1a0f]">
            <span className="mr-1 text-[#f26f2d]">*</span>
            {labels?.step1.hunterCountLabel ?? "How Many Hunters In Your Group?"}
            <InfoIcon className="ml-1 h-4 w-4 text-[#f26f2d]"  />
          </label>
          <div className="flex items-center border-l border-[#d9d9d9] p-3 md:col-span-2">
            <select
              value={groupData.hunterCount}
              onChange={(e) => setGroupData((prev) => ({ ...prev, hunterCount: Number(e.target.value) }))}
              className="h-10 w-full rounded border border-[#9f9f9f] bg-white px-3 text-[14px] text-[#5a5a5a] outline-none"
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? "Hunter" : "Hunters"}</option>
              ))}
            </select>
            <span className="ml-3 whitespace-nowrap text-[12px] text-[#f26f2d] underline cursor-pointer">
              (Minimums and Capacities Chart)
            </span>
          </div>
        </div>

        {/* Field Row: Package */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_0.8fr] items-center">
          <label className="flex items-center px-6 py-4 text-[15px] font-bold text-[#2b1a0f]">
            <span className="mr-1 text-[#f26f2d]">*</span>
            {labels?.step1.packageLabel ?? "What Package?"}
            <InfoIcon className="ml-1 h-4 w-4 text-[#f26f2d]"  />
          </label>
          <div className="flex items-center border-l border-[#d9d9d9] p-3 md:col-span-2">
            <select
              value={groupData.packageId}
              onChange={(e) => setGroupData((prev) => ({ ...prev, packageId: e.target.value }))}
              className="h-10 w-full rounded border border-[#9f9f9f] bg-white px-3 text-[14px] text-[#5a5a5a] outline-none"
            >
              <option value="">Select Package</option>
              {(config?.packages ?? []).map((pkg) => (
                <option key={pkg.id} value={pkg.id}>{pkg.label}</option>
              ))}
            </select>
            <span className="ml-3 whitespace-nowrap text-[12px] text-[#f26f2d] underline cursor-pointer">
              (Minimums and Capacities Chart)
            </span>
          </div>
        </div>
      </div>

      {/* Optional Fields Section */}
      <div className="mt-10 mb-6">
        <SectionDivider label={labels?.step1.optionalLabel ?? "OPTIONAL FIELDS"} />
      </div>

      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
        <label className="flex items-center text-[15px] font-bold text-[#2b1a0f]">
          <span className="mr-1 text-[#f26f2d]">*</span>
          {labels?.step1.earlyBirdLabel ?? "Does Your Group Qualify For 5% Early Bird Booking Discount?"}
          <InfoIcon className="ml-1 h-4 w-4 text-[#f26f2d]"  />
        </label>
        <select
          value={groupData.earlyBird}
          onChange={(e) => setGroupData((prev) => ({ ...prev, earlyBird: e.target.value as "Yes" | "No" }))}
          className="h-10 w-24 rounded border border-[#9f9f9f] bg-white px-3 text-[14px] text-[#5a5a5a] outline-none"
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      {/* Navigation Button */}
      <div className="mt-12 flex justify-center md:justify-end">
        <button
          onClick={goToStep2}
          className="w-full rounded-md bg-[#f26f2d] px-10 py-4 text-[18px] font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-[#e16528] md:w-auto"
        >
          {labels?.step1.nextButton ?? "To Step 2: Enter Hunters »"}
        </button>
      </div>
    </div>
  </div>
)}  

            {step === 2 && (
              <div className="overflow-hidden rounded-b-[18px] border border-[#d9d9d9] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.13)]">
                <div className="overflow-x-auto">
                  <div className="min-w-[760px]">
                    <div className="grid grid-cols-[70px_1.5fr_1.5fr_1.3fr_1.3fr] gap-2 bg-[#4c2c11] px-5 py-4 text-[13px] font-bold uppercase tracking-[0.06em] text-white md:px-6 md:text-[15px]">
                      <div className="text-center">#</div>
                      <div>{labels?.step2.hunterNameHeader ?? "Hunter Name"}</div>
                      <div>{labels?.step2.individualDiscountHeader ?? "Individual Discount"}</div>
                      <div>{labels?.step2.extraDaysHeader ?? "Extra Days Hunting"}</div>
                      <div>{labels?.step2.extraNightsHeader ?? "Extra Nights Lodging"}</div>
                    </div>

                    <div className="bg-[#ffffff]">
                      {hunters.map((hunter, index) => (
                        <div
                          key={hunter.id}
                          className={`grid grid-cols-[70px_1.5fr_1.5fr_1.3fr_1.3fr] items-center gap-2 border-b border-[#d9d9d9] px-5 py-4 text-[14px] md:px-6 ${index % 2 === 0 ? "bg-[#fff7ee]" : "bg-white"}`}
                        >
                          <div className="text-center text-[14px] font-bold text-[#4c2c11]">{`${index + 1})`}</div>

                          <input
                            value={hunter.name}
                            onChange={(e) =>
                              setHunters((prev) =>
                                prev.map((item, i) =>
                                  i === index ? { ...item, name: e.target.value } : item
                                )
                              )
                            }
                            placeholder="Hunter Name (Optional)"
                            maxLength={120}
                            className="h-10 w-full rounded-sm border border-[#b5a090] bg-white px-3 text-[14px] text-[#4c2c11] outline-none focus:border-[#f26f2d] focus:ring-2 focus:ring-[#f26f2d]/40"
                          />

                          <select
                            value={hunter.discountCode}
                            onChange={(e) =>
                              setHunters((prev) =>
                                prev.map((item, i) =>
                                  i === index ? { ...item, discountCode: e.target.value } : item
                                )
                              )
                            }
                            className="h-10 w-full rounded-sm border border-[#b5a090] bg-white px-3 text-[14px] text-[#4c2c11] outline-none focus:border-[#f26f2d] focus:ring-2 focus:ring-[#f26f2d]/40"
                          >
                            {discountOptions.map((option) => (
                              <option key={option.code} value={option.code}>
                                {option.label}
                              </option>
                            ))}
                          </select>

                          <select
                            value={hunter.extraDays}
                            onChange={(e) =>
                              setHunters((prev) =>
                                prev.map((item, i) =>
                                  i === index ? { ...item, extraDays: Number(e.target.value) } : item
                                )
                              )
                            }
                            className="h-10 w-full rounded-sm border border-[#b5a090] bg-white px-3 text-[14px] text-[#4c2c11] outline-none focus:border-[#f26f2d] focus:ring-2 focus:ring-[#f26f2d]/40"
                          >
                            {(config?.settings.extraDayOptions ?? [0, 1, 2, 3]).map((value) => (
                              <option key={value} value={value}>
                                {value === 0 ? "Extra Days Hunting" : `${value} Extra Day`}
                              </option>
                            ))}
                          </select>

                          <select
                            value={hunter.extraNights}
                            onChange={(e) =>
                              setHunters((prev) =>
                                prev.map((item, i) =>
                                  i === index ? { ...item, extraNights: Number(e.target.value) } : item
                                )
                              )
                            }
                            className="h-10 w-full rounded-sm border border-[#b5a090] bg-white px-3 text-[14px] text-[#4c2c11] outline-none focus:border-[#f26f2d] focus:ring-2 focus:ring-[#f26f2d]/40"
                          >
                            {(config?.settings.extraNightOptions ?? [0, 1, 2, 3]).map((value) => (
                              <option key={value} value={value}>
                                {value === 0 ? "Extra Nights Lodging" : `${value} Extra Night`}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 items-center gap-4 px-4 py-6 sm:px-6 md:grid-cols-[auto_340px] md:px-8 md:py-7">
                  <label className="text-[15px] font-semibold text-[#2b1a0f]">
                    {labels?.step2.emailLabel ?? "Enter your email address to receive a copy of the quote:"}
                  </label>

                  <input
                    type="email"
                    value={quoteEmail}
                    onChange={(e) => setQuoteEmail(e.target.value)}
                    maxLength={254}
                    autoCapitalize="none"
                    autoComplete="email"
                    spellCheck={false}
                    className="h-10 rounded-md border border-[#9f9f9f] bg-white px-3 text-[14px] outline-none"
                  />
                </div>

                {validationErrors.quoteEmail ? (
                  <div className="px-4 pb-2 text-sm font-semibold text-red-700 sm:px-6 md:px-8">
                    {validationErrors.quoteEmail}
                  </div>
                ) : null}

                {validationErrors.step2 ? (
                  <div className="px-4 pb-4 text-sm font-semibold text-red-700 sm:px-6 md:px-8">
                    {validationErrors.step2}
                  </div>
                ) : null}

                <div className="flex flex-col-reverse gap-4 px-4 pb-8 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8">
                  <button
                    onClick={() => setStep(1)}
                    className="text-[14px] font-bold uppercase text-[#4c2c11] underline underline-offset-4"
                  >
                    {labels?.step2.backButton ?? "Back to Step 1"}
                  </button>

                  <button
                    onClick={goToStep3}
                    className="w-full rounded-md bg-[#f26f2d] px-8 py-4 text-[15px] font-bold uppercase tracking-[0.05em] text-white shadow-md transition hover:brightness-95 md:w-auto"
                  >
                    {labels?.step2.nextButton ?? "To Step 3: Review Total »"}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-[#f5f5f5]">
                <div className="overflow-hidden">
                  <div className="bg-[#4c2c11] px-8 py-5 text-[18px] font-bold uppercase text-white">
                    {labels?.step3.overviewTitle ?? "Quote Details and Payment Options"}
                  </div>

                  <div className="border-b border-[#d9d9d9] px-8 py-8 text-center text-[14px] leading-7 text-[#2b1a0f]">
                    <p className="font-semibold">
                      {labels?.step3.overviewIntro ?? "Thank you for quoting your groups fair chase pheasant hunt at a UGUIDE South Dakota Pheasant Hunting property. You are encouraged to forward this quote to your group for their review and consideration."}
                    </p>

                    <p className="mt-6 font-semibold">
                      {labels?.step3.optionsLabel ?? "There are two simple options to reserve your hunt:"}
                    </p>

                    <p className="mt-4 text-[18px] font-black">
                      {labels?.step3.optionOneTitle ?? "Option 1 - One group member pays deposit"}
                    </p>

                    <div className="mt-3 space-y-2">
                      {(labels?.step3.optionOneBullets ?? [
                        "Check the Availability page to make sure the hunt you would like to reserve is available.",
                        "Use the Booking Tool which will calculate your deposit amount and then take you to Paypal to pay with credit card or Paypal account, whichever you prefer.",
                        "Upon completion of checkout, you will receive an automated itinerary for your hunt package in your email.",
                      ]).map((bullet) => (
                        <p key={bullet}>✓ {bullet}</p>
                      ))}
                    </div>

                    <p className="mt-6 text-[18px] font-black">
                      {labels?.step3.optionTwoTitle ?? "Option 2 - Individuals in group split up deposit"}
                    </p>

                    <div className="mt-3 space-y-2">
                      {(labels?.step3.optionTwoBullets ?? [
                        "Check the Availability page to make sure the hunt you would like to reserve is available.",
                        "From the Quote page, determine how much you would like each member of your group to pay as their portion of the deposit.",
                        "Email the Individual Pay link to each member of your group with instructions on the amount you would like them to pay.",
                      ]).map((bullet) => (
                        <p key={bullet}>✓ {bullet}</p>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#4c2c11] px-8 py-5 text-[18px] font-bold uppercase text-white">
                    {labels?.step3.groupSelectionsTitle ?? "Group Selections"}
                  </div>

                  <SummaryRow label={`${labels?.step3.groupFields.season ?? "Season Selected"}:`} value={groupData.seasonLabel || "-"} />
                  <SummaryRow label={`${labels?.step3.groupFields.camp ?? "Camp Selected"}:`} value={selectedCamp?.name || "-"} />
                  <SummaryRow label={`${labels?.step3.groupFields.campTier ?? "Camp Tier"}:`} value="Tier 1" />
                  <SummaryRow label={`${labels?.step3.groupFields.package ?? "Package Selected"}:`} value={selectedPackage?.label || "-"} />
                  <SummaryRow
                    label={`${labels?.step3.groupFields.totalHunters ?? "Total Hunters Selected"}:`}
                    value={`${groupData.hunterCount} Hunters`}
                  />
                  <SummaryRow label={`${labels?.step3.groupFields.earlyBird ?? "Early Bird Discount"}:`} value={groupData.earlyBird} />
                  <SummaryRow
                    label="Minimum Group Revenue Rule:"
                    value={selectedPricing ? `${selectedPricing.minGroupSize} minimum` : "-"}
                  />

                  <div className="border-b border-[#d9d9d9] px-8 py-5 text-center text-[14px] font-medium text-[#2b1a0f]">
                    ✓ {(labels?.step3.groupFields.week ?? "Week Selected")}: {selectedWeek?.label || "-"}
                  </div>

                  <div className="bg-[#4c2c11] px-8 py-5 text-[18px] font-bold uppercase text-white">
                    {labels?.step3.hunterSelectionsTitle ?? "Hunter Selections"}
                  </div>

                  <div className="overflow-x-auto px-4 py-4">
                    <table className="min-w-full border border-[#d9d9d9] bg-white text-[12px] text-[#2b1a0f]">
                      <thead>
                        <tr className="bg-[#f26f2d] text-left text-white">
                          <th className="border border-[#d9d9d9] px-2 py-2">{labels?.step3.tableHeaders.hunterNumber ?? "#"}</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">{labels?.step3.tableHeaders.hunterName ?? "Hunter Name"}</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">{labels?.step3.tableHeaders.individualDiscount ?? "Individual Discount"}</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">{labels?.step3.tableHeaders.baseRate ?? "Base Rate"}</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">{labels?.step3.tableHeaders.volumeDiscount ?? "Volume Discount"}</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">{labels?.step3.tableHeaders.extraHunting ?? "Extra Hunting"}</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">{labels?.step3.tableHeaders.extraLodging ?? "Extra Lodging"}</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">{labels?.step3.tableHeaders.juniorDiscount ?? "Junior Discount"}</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">{labels?.step3.tableHeaders.adultDiscount ?? "Adult Discount"}</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">{labels?.step3.tableHeaders.earlyBirdDiscount ?? "Early Bird Discount"}</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">{labels?.step3.tableHeaders.taxes ?? taxLabel}</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">{labels?.step3.tableHeaders.total ?? "Total"}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pricingRows.map((row, index) => (
                          <tr key={row.id}>
                            <td className="border border-[#d9d9d9] px-2 py-2">{index + 1}</td>
                            <td className="border border-[#d9d9d9] px-2 py-2">
                              {row.name?.trim() || `Hunter ${index + 1}`}
                            </td>
                            <td className="border border-[#d9d9d9] px-2 py-2">{row.discountLabel}</td>
                            <td className="border border-[#d9d9d9] px-2 py-2">${row.baseRate.toFixed(2)}</td>
                            <td className="border border-[#d9d9d9] px-2 py-2">-${row.volumeDiscount.toFixed(2)}</td>
                            <td className="border border-[#d9d9d9] px-2 py-2">${row.extraHunting.toFixed(2)}</td>
                            <td className="border border-[#d9d9d9] px-2 py-2">${row.extraLodging.toFixed(2)}</td>
                            <td className="border border-[#d9d9d9] px-2 py-2">-${row.juniorDiscount.toFixed(2)}</td>
                            <td className="border border-[#d9d9d9] px-2 py-2">-${row.individualDiscount.toFixed(2)}</td>
                            <td className="border border-[#d9d9d9] px-2 py-2">-${row.earlyBirdDiscount.toFixed(2)}</td>
                            <td className="border border-[#d9d9d9] px-2 py-2">${row.tax.toFixed(2)}</td>
                            <td className="border border-[#d9d9d9] px-2 py-2 font-bold">${row.total.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="mt-4 flex justify-center md:justify-end">
                      <button className="rounded-md bg-[#f26f2d] px-8 py-3 text-[15px] font-bold uppercase text-white">
                        {labels?.step3.totalsBadgeLabel ?? "Totals"}
                      </button>
                    </div>

                    <div className="mt-5 text-center text-[16px] font-semibold text-[#2b1a0f] md:text-right md:text-[18px]">
                      Subtotal before tax: <span className="text-[24px] font-black">${subtotalBeforeTax.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 text-center text-[16px] font-semibold text-[#2b1a0f] md:text-right md:text-[18px]">
                      Minimum adjustment: <span className="text-[24px] font-black">${minimumAdjustment.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 text-center text-[16px] font-semibold text-[#2b1a0f] md:text-right md:text-[18px]">
                      {labels?.step3.totalPriceLabel ?? "Total price after applicable discounts and state sales tax:"}{" "}
                      <span className="text-[28px] font-black">${grandSubtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-[#4c2c11] px-8 py-5 text-[18px] font-bold uppercase text-white">
                    {labels?.step3.depositTitle ?? "Deposit/Booking Information"}
                  </div>

                  <div className="px-4 py-6 text-[14px] text-[#2b1a0f] sm:px-6 md:px-8">
                    <p className="mb-5 font-semibold">
                      {labels?.step3.depositDescription ?? "Deposit % calculated is based on the time of year that you are booking a hunt. Up to May 1st it is 25%. From May 1-August 31 it is 50%. From Sept. 1 thru end of season it is 100%."}
                    </p>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_320px] md:items-center">
                      <label className="font-semibold">
                        <span className="mr-1 text-[#f26f2d]">*</span>
                        {labels?.step3.bookingNameLabel ?? "Enter name of person booking the hunt:"}
                      </label>
                      <input
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        maxLength={120}
                        autoComplete="name"
                        className="h-10 rounded-md border border-[#9f9f9f] bg-white px-3 outline-none"
                      />

                      {validationErrors.bookingName ? (
                        <div className="md:col-start-2 text-sm font-semibold text-red-700">
                          {validationErrors.bookingName}
                        </div>
                      ) : null}

                      <label className="font-semibold">
                        <span className="mr-1 text-[#f26f2d]">*</span>
                        {labels?.step3.bookingEmailLabel ?? "Enter email address of person booking the hunt:"}
                      </label>
                      <input
                        type="email"
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                        maxLength={254}
                        autoCapitalize="none"
                        autoComplete="email"
                        spellCheck={false}
                        className="h-10 rounded-md border border-[#9f9f9f] bg-white px-3 outline-none"
                      />

                      {validationErrors.bookingEmail ? (
                        <div className="md:col-start-2 text-sm font-semibold text-red-700">
                          {validationErrors.bookingEmail}
                        </div>
                      ) : null}

                      <label className="font-semibold">
                        {labels?.step3.depositAmountLabel ?? "Deposit Amount"} ({Math.round(depositRate * 100)}%):
                      </label>
                      <div className="text-[18px] font-black">
                        ${depositBase.toFixed(2)} + 2.99% (${processingFee.toFixed(2)}) = ${depositTotal.toFixed(2)}
                      </div>
                    </div>

                    <p className="mt-4 text-[13px] italic text-[#4e4e4e]">
                      {labels?.step3.depositNote ?? "Note: You will be redirected to Paypal.com to make your secure deposit."}
                    </p>

                    {validationErrors.step3 ? (
                      <div className="mt-4 text-sm font-semibold text-red-700">
                        {validationErrors.step3}
                      </div>
                    ) : null}

                    <div className="mt-8 flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between">
                      <button
                        onClick={() => setStep(2)}
                        className="text-[14px] font-bold uppercase text-[#4c2c11] underline underline-offset-4"
                      >
                        {labels?.step3.backButton ?? "Back to Step 2"}
                      </button>

                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full rounded-md bg-[#f26f2d] px-8 py-4 text-[15px] font-bold uppercase tracking-[0.05em] text-white shadow-md transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
                      >
                        {isSubmitting ? "Submitting..." : (labels?.step3.submitButton ?? "Submit Quote Request »")}
                      </button>
                    </div>

                    {submitMessage && (
                      <div
                        className={`mt-4 rounded-md p-4 text-center ${
                          submitMessage.includes("successfully")
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {submitMessage}
                        {quotePdfUrl ? (
                          <div className="mt-3">
                            <a
                              href={quotePdfUrl}
                              className="font-bold underline"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Download PDF Copy
                            </a>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}