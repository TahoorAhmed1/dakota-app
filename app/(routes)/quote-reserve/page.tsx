"use client";

const round2 = (n: number) => Math.round(n * 100) / 100;

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalculatorSettings, calculateDepositRate } from "@/lib/calculator-settings";
import { InfoIcon } from "lucide-react";

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
    lodgingCapacity: number;
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
    category: "INDIVIDUAL" | "JUNIOR" | "YOUTH";
    type: "FIXED" | "PERCENT";
    value: number;
    stackOrder: number;
  }>;
  settings: CalculatorSettings;
};

const getVolumeDiscount = (rules: CalculatorConfig["volumeRules"], count: number): number => {
  const matched = rules.find((rule) => {
    if (count < rule.minHunters) return false;
    if (rule.maxHunters === null) return true;
    return count <= rule.maxHunters;
  });
  return matched ? matched.amountOffPerHead : 0;
};

const formatCampOptionLabel = (name: string) =>
  name.replace(/ Pheasant Camp$/i, "").replace(/^Faulkton Pheasant Camp$/i, "Faulkton");

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

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[1fr_auto] border-b border-[#d9d9d9] px-4 py-3 text-[14px] font-semibold text-[#2b1a0f] sm:px-8 sm:py-4">
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
  const [groupCoordinatorId, setGroupCoordinatorId] = useState<number>(1);

  const [groupData, setGroupData] = useState<StepOneData>({
    seasonLabel: "",
    campId: "",
    weekId: "",
    hunterCount: 0,
    packageId: "",
    earlyBird: "No",
  });

  const [hunters, setHunters] = useState<HunterForm[]>([]);
  const [quoteEmail, setQuoteEmail] = useState("");
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Load config
  useEffect(() => {
    async function loadConfig() {
      try {
        let data: CalculatorConfig | null = null;
        for (let attempt = 0; attempt < 3; attempt++) {
          const response = await fetch("/api/calculator/config", { cache: "no-store" });
          const payload = await response.json().catch(() => ({}));
          if (response.ok) {
            data = payload as CalculatorConfig;
            break;
          }
          if (response.status === 503 && attempt < 2) {
            await delay(500 * (attempt + 1));
            continue;
          }
          throw new Error(payload.error || "Failed to load configuration.");
        }
        if (!data) throw new Error("Failed to load calculator configuration.");
        setConfig(data);

        const firstSeason = data.weeks[0]?.seasonLabel ?? "";
        const firstWeek = data.weeks.find((w) => w.seasonLabel === firstSeason)?.id ?? "";
        const firstCamp = data.camps[0]?.id ?? "";
        const firstPackage = data.packages[0]?.id ?? "";

        setGroupData((prev) => ({
          ...prev,
          seasonLabel: firstSeason,
          campId: firstCamp,
          weekId: firstWeek,
          packageId: firstPackage,
          hunterCount: 0,
        }));
      } catch (error) {
        console.error(error);
        setConfigError(error instanceof Error ? error.message : "Unable to load quote data.");
      }
    }
    loadConfig();
  }, []);

  // Sync hunters when hunterCount changes
  useEffect(() => {
    setHunters((prev) =>
      Array.from({ length: groupData.hunterCount }, (_, i) => {
        const prior = prev[i];
        const isFirst = i === 0;
        if (!prior) {
          return {
            id: i + 1,
            name: "",
            discountCode: isFirst ? "ADULT_COORDINATOR" : "NONE",
            extraDays: 0,
            extraNights: 0,
          };
        }
        if (i === 0 && prior.discountCode === "NONE") {
          return { ...prior, discountCode: "ADULT_COORDINATOR" };
        }
        return { ...prior, id: i + 1 };
      })
    );
    setGroupCoordinatorId(1);
  }, [groupData.hunterCount]);

  const seasonOptions = useMemo(() => {
    if (!config) return [];
    return Array.from(new Set(config.weeks.map((w) => w.seasonLabel)));
  }, [config]);

  const weekOptions = useMemo(() => {
    if (!config) return [];
    return config.weeks.filter((w) => w.seasonLabel === groupData.seasonLabel);
  }, [config, groupData.seasonLabel]);

  const selectedCamp = useMemo(
    () => config?.camps.find((c) => c.id === groupData.campId),
    [config, groupData.campId]
  );

  const selectedWeek = useMemo(
    () => config?.weeks.find((w) => w.id === groupData.weekId),
    [config, groupData.weekId]
  );

  const availablePricingRows = useMemo(() => {
    if (!config || !groupData.campId || !groupData.weekId) return [];
    return config.pricingRows.filter(
      (row) =>
        row.campId === groupData.campId &&
        row.weekId === groupData.weekId &&
        row.isAvailable === true
    );
  }, [config, groupData.campId, groupData.weekId]);

  const packageOptions = useMemo(() => {
    if (!config) return [];
    const availablePackageIds = new Set(availablePricingRows.map((row) => row.packageId));
    return config.packages.filter((pkg) => availablePackageIds.has(pkg.id));
  }, [config, availablePricingRows]);

  useEffect(() => {
    if (packageOptions.length > 0 && !packageOptions.some((p) => p.id === groupData.packageId)) {
      setGroupData((prev) => ({ ...prev, packageId: packageOptions[0].id }));
    }
  }, [packageOptions, groupData.packageId]);

  const selectedPricing = useMemo(() => {
    if (!config || !groupData.campId || !groupData.weekId || !groupData.packageId) return null;
    return config.pricingRows.find(
      (row) =>
        row.campId === groupData.campId &&
        row.weekId === groupData.weekId &&
        row.packageId === groupData.packageId
    ) ?? null;
  }, [config, groupData]);

  const hunterCountOptions = useMemo(() => {
    if (!selectedPricing) return [];
    const min = selectedPricing.minGroupSize;
    const max = selectedPricing.lodgingCapacity;
    const options: number[] = [];
    for (let i = min; i <= max; i++) options.push(i);
    return options;
  }, [selectedPricing]);

  useEffect(() => {
    if (hunterCountOptions.length > 0 && !hunterCountOptions.includes(groupData.hunterCount)) {
      setGroupData((prev) => ({ ...prev, hunterCount: hunterCountOptions[0] }));
    }
  }, [hunterCountOptions, groupData.hunterCount]);

  const discountMap = useMemo(() => {
    const map = new Map<string, CalculatorConfig["discountRules"][number]>();
    config?.discountRules.forEach((r) => map.set(r.code, r));
    return map;
  }, [config]);

  const discountOptions = useMemo(() => {
    if (!config) return [];
    return config.discountRules
      .slice()
      .sort((a, b) => a.stackOrder - b.stackOrder)
      .map((r) => ({ code: r.code, label: r.label }));
  }, [config]);

  const getDiscountOptionsForHunter = (hunterId: number) => {
    const isCoordinator = hunterId === groupCoordinatorId;
    return discountOptions.filter((opt) => {
      if (opt.code === "NONE") return true;
      if (opt.code === "ADULT_COORDINATOR") return isCoordinator;
      if (isCoordinator) return false;
      return true;
    });
  };

  const settings = config?.settings;

  const base3Rate = useMemo(() => {
    if (!config || !groupData.campId || !groupData.weekId) return 0;
    const pkg3 = config.packages.find((p) => p.days === 3);
    if (!pkg3) return 0;
    return (
      config.pricingRows.find(
        (row) =>
          row.campId === groupData.campId &&
          row.weekId === groupData.weekId &&
          row.packageId === pkg3.id
      )?.baseRate ?? 0
    );
  }, [config, groupData.campId, groupData.weekId]);

  // Core Pricing Calculation - 100% compliant with documents
  const pricingRows = useMemo(() => {
    if (!config || !selectedPricing || !settings || base3Rate === 0) return [];

    const volumePerHunter = getVolumeDiscount(config.volumeRules, groupData.hunterCount);
    const isEarlyBird = groupData.earlyBird === "Yes";

    const selectedPackage = config.packages.find((p) => p.id === groupData.packageId);
    const packageExtraDays = selectedPackage?.days === 4 ? 1 : 0;
    const packageExtraNights = selectedPackage?.nights === 5 ? 1 : 0;

    const dailyHuntRate = (base3Rate - 4 * 100) / 3;
    const extraNightRate = settings.extraNightRate ?? 105;
    const earlyBirdRate = settings.earlyBirdRate ?? 0.05;
    const taxRate = settings.salesTaxRate ?? 0.057;

    return hunters.map((hunter) => {
      const rule = discountMap.get(hunter.discountCode) ?? discountMap.get("NONE")!;

      const baseRate = base3Rate;
      const volumeDiscount = -volumePerHunter;

      const totalExtraDays = packageExtraDays + hunter.extraDays;
      const totalExtraNights = packageExtraNights + hunter.extraNights;

      const extraHunting = totalExtraDays * dailyHuntRate;
      const extraLodging = totalExtraNights * extraNightRate;

      const subtotalForPct = baseRate + volumeDiscount + extraHunting + extraLodging;

      // Youth: Hunting free only (lodging charged)
      // Junior: 50% off full subtotal
      let juniorYouthDiscount = 0;
      if (rule.category === "JUNIOR") {
        juniorYouthDiscount = -subtotalForPct * 0.5;
      } else if (rule.category === "YOUTH") {
  const huntingOnlyBase = base3Rate - 4 * 100; 
  const huntPortion = huntingOnlyBase + totalExtraDays * dailyHuntRate;
  juniorYouthDiscount = -huntPortion;
}

      // Adult / Coordinator discount
      let adultDiscount = 0;
      if (rule.category === "INDIVIDUAL" && rule.code !== "NONE") {
        adultDiscount = -subtotalForPct * (rule.value / 100);
      }

      const earlyBirdDiscount = isEarlyBird ? -subtotalForPct * earlyBirdRate : 0;

      const taxable = subtotalForPct + juniorYouthDiscount + adultDiscount + earlyBirdDiscount;
      const tax = taxable * taxRate;
      const total = taxable + tax;

      return {
        ...hunter,
        discountLabel: rule.label,
        baseRate: round2(baseRate),
        volumeDiscount: round2(volumeDiscount),
        extraHunting: round2(extraHunting),
        extraLodging: round2(extraLodging),
        juniorDiscount: round2(juniorYouthDiscount),
        individualDiscount: round2(adultDiscount),
        earlyBirdDiscount: round2(earlyBirdDiscount),
        tax: round2(tax),
        total: round2(total),
      };
    });
  }, [config, selectedPricing, groupData, hunters, discountMap, settings, base3Rate]);

  const grandTotal = pricingRows.reduce((sum, row) => sum + row.total, 0);
  const today = new Date();
  const depositRate = config ? calculateDepositRate(config.settings.depositSchedule, today) : 1;
  const depositTotal = round2(grandTotal * depositRate);

  const labels = settings?.labels;
  const taxLabel = `Taxes ${((settings?.salesTaxRate ?? 0.057) * 100).toFixed(1)}%`;

  // Validation
  const validateStepOne = (): ValidationErrors => {
    const errors: ValidationErrors = {};
    if (!selectedPricing) {
      errors.step1 = "Pricing not configured for this selection.";
      return errors;
    }
    if (groupData.hunterCount < selectedPricing.minGroupSize) {
      errors.step1 = `Minimum group size for this package is ${selectedPricing.minGroupSize} hunters.`;
    }
    return errors;
  };

  const validateStepTwo = () => {
    const errors = validateStepOne();
    if (quoteEmail.trim() && !isValidEmail(quoteEmail.trim())) {
      errors.quoteEmail = "Enter a valid email address.";
    }
    return errors;
  };

  const validateStepThree = () => {
    const errors = validateStepTwo();
    if (!bookingName.trim()) errors.bookingName = "Enter the booking name.";
    if (!bookingEmail.trim() || !isValidEmail(bookingEmail.trim())) {
      errors.bookingEmail = "Enter a valid booking email address.";
    }
    return errors;
  };

  const goToStep2 = () => {
    const errors = validateStepOne();
    setValidationErrors(errors);
    if (Object.keys(errors).length === 0) setStep(2);
  };

  const goToStep3 = () => {
    const errors = validateStepTwo();
    setValidationErrors(errors);
    if (Object.keys(errors).length === 0) setStep(3);
  };

  const handleSubmit = async () => {
    const errors = validateStepThree();
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seasonLabel: groupData.seasonLabel,
          campId: groupData.campId,
          weekId: groupData.weekId,
          packageId: groupData.packageId,
          hunterCount: groupData.hunterCount,
          earlyBird: groupData.earlyBird === "Yes",
          groupCoordinatorId,
          hunters: hunters.map((h) => ({
            name: h.name,
            discountCode: h.discountCode,
            extraDays: h.extraDays,
            extraNights: h.extraNights,
          })),
          quoteEmail,
          bookingName,
          bookingEmail,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSubmitMessage(`Quote submitted successfully! Quote #: ${data.quoteNumber}`);
        if (data.pdfUrl) setQuotePdfUrl(data.pdfUrl);
      } else {
        setSubmitMessage(data.error || "Something went wrong.");
      }
    } catch (error) {
      setSubmitMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <main className="flex flex-col">
      <section className="QuoteReserveImage relative flex min-h-[340px] items-center justify-center px-4 pb-20 pt-24 sm:min-h-[420px] sm:px-6 sm:pb-24 sm:pt-28 md:min-h-[520px] lg:min-h-[620px]">
        <div className="absolute inset-0" />
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Calculator */}
      <section className="bg-[#E7DCCF] px-4 pb-20 pt-14 sm:pt-16 md:px-6 md:pb-24 md:pt-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-[24px] font-bold uppercase tracking-[0.04em] text-[#281703] underline decoration-[3px] underline-offset-[6px] sm:text-[30px] md:text-[54px]">
            {step === 1 && labels?.stepHeadings.step1}
            {step === 2 && labels?.stepHeadings.step2}
            {step === 3 && labels?.stepHeadings.step3}
          </h2>

          <div className="mt-8 overflow-hidden rounded-[18px] bg-[#f5f5f5] shadow-[0_18px_40px_rgba(0,0,0,0.12)]">

            {/* ── STEP 1 ─────────────────────────────────────────────────────── */}
            {step === 1 && (
              <div className="overflow-hidden rounded-b-[18px] border border-[#d9d9d9] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.13)]">
                <div className="bg-[#4c2c11] px-4 py-5 text-center font-normal uppercase text-white md:py-6">
                  <h1 className="text-[20px] tracking-tight sm:text-[26px] md:text-[34px]">
                    {labels?.step1.cardTitle ?? "Price Your Own Hunt in 3 Simple Steps"}
                  </h1>
                </div>
                <div className="bg-white px-4 py-6 md:px-12">
                  <div className="mb-4">
                    <SectionDivider label={labels?.step1.requiredLabel ?? "Required Fields"} />
                  </div>
                  <div className="divide-y divide-[#d9d9d9] border border-[#d9d9d9]">

                    {/* Season */}
                    <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_0.8fr] items-center">
                      <label className="flex items-center px-4 py-3 text-[15px] font-bold text-[#2b1a0f] sm:px-6 sm:py-4">
                        <span className="mr-1 text-[#f26f2d]">*</span>
                        {labels?.step1.seasonLabel ?? "What Season Is Your Group Hunting In?"}
                        <InfoIcon className="ml-1 h-4 w-4 text-[#f26f2d]" />
                      </label>
                      <div className="border-l border-[#d9d9d9] p-3 md:col-span-2">
                        <select
                          value={groupData.seasonLabel}
                          onChange={(e) => {
                            const newSeason = e.target.value;
                            const firstWeek =
                              config?.weeks.find((w) => w.seasonLabel === newSeason)?.id ?? "";
                            setGroupData((prev) => ({
                              ...prev,
                              seasonLabel: newSeason,
                              weekId: firstWeek,
                            }));
                          }}
                          className="h-10 w-full rounded border border-[#9f9f9f] bg-white px-3 text-[14px] text-[#5a5a5a] outline-none"
                        >
                          {seasonOptions.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Camp */}
                    <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_0.8fr] items-center">
                      <label className="flex items-center px-4 py-3 text-[15px] font-bold text-[#2b1a0f] sm:px-6 sm:py-4">
                        <span className="mr-1 text-[#f26f2d]">*</span>
                        {labels?.step1.campLabel ?? "What Camp Is Your Group Going To?"}
                        <InfoIcon className="ml-1 h-4 w-4 text-[#f26f2d]" />
                      </label>
                      <div className="flex items-center border-l border-[#d9d9d9] p-3 md:col-span-2">
                        <select
                          value={groupData.campId}
                          onChange={(e) =>
                            setGroupData((prev) => ({
                              ...prev,
                              campId: e.target.value,
                              packageId: "",
                            }))
                          }
                          className="h-10 w-full rounded border border-[#9f9f9f] bg-white px-3 text-[14px] text-[#5a5a5a] outline-none"
                        >
                          <option value="">Select a Camp</option>
                          {config?.camps.map((camp) => (
                            <option key={camp.id} value={camp.id}>
                              {formatCampOptionLabel(camp.name)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Week */}
                    <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_0.8fr] items-center">
                      <label className="flex items-center px-4 py-3 text-[15px] font-bold text-[#2b1a0f] sm:px-6 sm:py-4">
                        <span className="mr-1 text-[#f26f2d]">*</span>
                        {labels?.step1.weekLabel ?? "What Week Is Your Group Going?"}
                        <InfoIcon className="ml-1 h-4 w-4 text-[#f26f2d]" />
                      </label>
                      <div className="flex items-center border-l border-[#d9d9d9] p-3 md:col-span-2">
                        <select
                          value={groupData.weekId}
                          onChange={(e) =>
                            setGroupData((prev) => ({
                              ...prev,
                              weekId: e.target.value,
                              packageId: "",
                            }))
                          }
                          className="h-10 w-full rounded border border-[#9f9f9f] bg-white px-3 text-[14px] text-[#5a5a5a] outline-none"
                        >
                          <option value="">Select Which Week</option>
                          {weekOptions.map((week) => (
                            <option key={week.id} value={week.id}>{week.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Package */}
                    <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_0.8fr] items-center">
                      <label className="flex items-center px-4 py-3 text-[15px] font-bold text-[#2b1a0f] sm:px-6 sm:py-4">
                        <span className="mr-1 text-[#f26f2d]">*</span>
                        {labels?.step1.packageLabel ?? "What Package?"}
                        <InfoIcon className="ml-1 h-4 w-4 text-[#f26f2d]" />
                      </label>
                      <div className="flex items-center border-l border-[#d9d9d9] p-3 md:col-span-2">
                        <select
                          value={groupData.packageId}
                          onChange={(e) =>
                            setGroupData((prev) => ({ ...prev, packageId: e.target.value }))
                          }
                          className="h-10 w-full rounded border border-[#9f9f9f] bg-white px-3 text-[14px] text-[#5a5a5a] outline-none"
                        >
                          <option value="">Select Package</option>
                          {packageOptions.map((pkg) => (
                            <option key={pkg.id} value={pkg.id}>{pkg.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Hunter Count */}
                    <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_0.8fr] items-center">
                      <label className="flex items-center px-4 py-3 text-[15px] font-bold text-[#2b1a0f] sm:px-6 sm:py-4">
                        <span className="mr-1 text-[#f26f2d]">*</span>
                        {labels?.step1.hunterCountLabel ?? "How Many Hunters In Your Group?"}
                        <InfoIcon className="ml-1 h-4 w-4 text-[#f26f2d]" />
                      </label>
                      <div className="flex items-center border-l border-[#d9d9d9] p-3 md:col-span-2">
                        <select
                          value={groupData.hunterCount}
                          onChange={(e) =>
                            setGroupData((prev) => ({
                              ...prev,
                              hunterCount: Number(e.target.value),
                            }))
                          }
                          className="h-10 w-full rounded border border-[#9f9f9f] bg-white px-3 text-[14px] text-[#5a5a5a] outline-none"
                        >
                          <option value="">Select Group Size</option>
                          {hunterCountOptions.map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? "Hunter" : "Hunters"}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 mb-6">
                    <SectionDivider label={labels?.step1.optionalLabel ?? "Optional Fields"} />
                  </div>
                  <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
                    <label className="flex items-center text-[15px] font-bold text-[#2b1a0f]">
                      <span className="mr-1 text-[#f26f2d]">*</span>
                      {labels?.step1.earlyBirdLabel ??
                        "Does Your Group Qualify For 5% Early Bird Booking Discount?"}
                      <InfoIcon className="ml-1 h-4 w-4 text-[#f26f2d]" />
                    </label>
                    <select
                      value={groupData.earlyBird}
                      onChange={(e) =>
                        setGroupData((prev) => ({
                          ...prev,
                          earlyBird: e.target.value as "Yes" | "No",
                        }))
                      }
                      className="h-10 w-64 rounded border border-[#9f9f9f] bg-white px-3 text-[14px] text-[#5a5a5a] outline-none"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes (5% off)</option>
                    </select>
                  </div>
                  <div className="mt-12 flex justify-center md:justify-end">
                    <button
                      onClick={goToStep2}
                      className="w-full rounded-md bg-[#f26f2d] px-10 py-4 text-[18px] font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-[#e16528] md:w-auto"
                    >
                      {labels?.step1.nextButton ?? "To Step 2: Enter Hunters »"}
                    </button>
                  </div>
                  {validationErrors.step1 && (
                    <div className="mt-4 text-center text-sm font-semibold text-red-700">
                      {validationErrors.step1}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── STEP 2 ─────────────────────────────────────────────────────── */}
            {step === 2 && (
              <div className="overflow-hidden rounded-b-[18px] border border-[#d9d9d9] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.13)]">
                <div className="overflow-x-auto">
                  <div className="min-w-[950px]">
                    <div className="grid grid-cols-[50px_50px_1.5fr_2fr_1.3fr_1.3fr] gap-2 bg-[#4c2c11] px-5 py-4 text-[13px] font-bold uppercase tracking-[0.06em] text-white md:px-6 md:text-[15px]">
                      <div className="text-center text-[11px] leading-tight md:text-[13px]">Coordinator</div>
                      <div className="text-center">#</div>
                      <div>{labels?.step2.hunterNameHeader ?? "Hunter Name (Optional)"}</div>
                      <div>{labels?.step2.individualDiscountHeader ?? "Individual Discount"}</div>
                      <div>{labels?.step2.extraDaysHeader ?? "Extra Days Hunting"}</div>
                      <div>{labels?.step2.extraNightsHeader ?? "Extra Nights Lodging"}</div>
                    </div>
                    <div className="bg-[#ffffff]">
                      {hunters.map((hunter, index) => {
                        const isCoordinator = hunter.id === groupCoordinatorId;
                        const availableDiscounts = getDiscountOptionsForHunter(hunter.id);
                        return (
                          <div
                            key={hunter.id}
                            className={`grid grid-cols-[50px_50px_1.5fr_2fr_1.3fr_1.3fr] items-center gap-2 border-b border-[#d9d9d9] px-5 py-4 text-[14px] md:px-6 ${
                              index % 2 === 0 ? "bg-[#fff7ee]" : "bg-white"
                            }`}
                          >
                            <div className="flex justify-center">
                              <input
                                type="radio"
                                name="groupCoordinator"
                                checked={isCoordinator}
                                onChange={() => {
                                  setGroupCoordinatorId(hunter.id);
                                  setHunters((prev) =>
                                    prev.map((h) => {
                                      if (h.id === hunter.id)
                                        return { ...h, discountCode: "ADULT_COORDINATOR" };
                                      if (h.id === groupCoordinatorId && h.discountCode === "ADULT_COORDINATOR")
                                        return { ...h, discountCode: "NONE" };
                                      return h;
                                    })
                                  );
                                }}
                                className="h-4 w-4 accent-[#f26f2d] cursor-pointer"
                              />
                            </div>
                            <div className="text-center text-[14px] font-bold text-[#4c2c11]">
                              {`${index + 1})`}
                            </div>
                            <input
                              value={hunter.name}
                              onChange={(e) =>
                                setHunters((prev) =>
                                  prev.map((item, i) =>
                                    i === index ? { ...item, name: e.target.value } : item
                                  )
                                )
                              }
                              placeholder={
                                isCoordinator
                                  ? "Group Coordinator (Optional)"
                                  : `Hunter ${index + 1} (Optional)`
                              }
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
                              disabled={isCoordinator}
                              className={`h-10 w-full rounded-sm border border-[#b5a090] bg-white px-3 text-[14px] text-[#4c2c11] outline-none focus:border-[#f26f2d] focus:ring-2 focus:ring-[#f26f2d]/40 ${
                                isCoordinator ? "bg-gray-100 cursor-not-allowed" : ""
                              }`}
                            >
                              {availableDiscounts.map((opt) => (
                                <option key={opt.code} value={opt.code}>{opt.label}</option>
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
                              <option value={0}>None</option>
                              <option value={1}>1 Extra Day</option>
                              <option value={2}>2 Extra Days</option>
                              <option value={3}>3 Extra Days</option>
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
                              <option value={0}>None</option>
                              <option value={1}>1 Extra Night</option>
                              <option value={2}>2 Extra Nights</option>
                              <option value={3}>3 Extra Nights</option>
                            </select>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="mt-4 px-4 text-[13px] text-[#6b6b6b] sm:px-6 md:px-8">
                  <span className="font-semibold">Note:</span> Group Coordinator
                  receives 10% discount and cannot select another individual
                  discount. Junior (50% off) and Youth (free) discounts apply
                  to the full package subtotal.
                </div>
                <div className="grid grid-cols-1 items-center gap-4 px-4 py-6 sm:px-6 md:grid-cols-[auto_340px] md:px-8 md:py-7">
                  <label className="text-[15px] font-semibold text-[#2b1a0f]">
                    {labels?.step2.emailLabel ??
                      "Enter your email to receive a copy of the quote (optional):"}
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
                {validationErrors.quoteEmail && (
                  <div className="px-4 pb-2 text-sm font-semibold text-red-700 sm:px-6 md:px-8">
                    {validationErrors.quoteEmail}
                  </div>
                )}
                <div className="flex flex-col-reverse gap-4 px-4 pb-8 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8">
                  <button
                    onClick={() => setStep(1)}
                    className="text-[14px] font-bold uppercase text-[#4c2c11] underline underline-offset-4"
                  >
                    {labels?.step2.backButton ?? "« Back to Step 1"}
                  </button>
                  <button
                    onClick={goToStep3}
                    className="w-full rounded-md bg-[#f26f2d] px-8 py-4 text-[15px] font-bold uppercase tracking-[0.05em] text-white shadow-md transition hover:brightness-95 md:w-auto"
                  >
                    {labels?.step2.nextButton ?? "To Step 3: Review Totals »"}
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3 ─────────────────────────────────────────────────────── */}
            {step === 3 && (
              <div className="bg-[#f5f5f5]">
                <div className="overflow-hidden">
                  <div className="bg-[#4c2c11] px-4 py-5 text-[18px] font-bold uppercase text-white sm:px-8">
                    {labels?.step3?.overviewTitle}
                  </div>

                  <div className="border-b border-[#d9d9d9] px-4 py-6 text-center text-[14px] leading-7 text-[#2b1a0f] sm:px-8 sm:py-8">
                    <p className="font-semibold">{labels?.step3?.overviewIntro}</p>
                    <p className="mt-6 font-semibold">{labels?.step3?.optionsLabel}</p>
                    <p className="mt-4 text-[18px] font-black">{labels?.step3?.optionOneTitle}</p>
                    <div className="mt-3 space-y-2">
                      {(labels?.step3?.optionOneBullets || []).map((bullet) => (
                        <p key={bullet}>✓ {bullet}</p>
                      ))}
                    </div>
                    <p className="mt-6 text-[18px] font-black">{labels?.step3?.optionTwoTitle}</p>
                    <div className="mt-3 space-y-2">
                      {(labels?.step3?.optionTwoBullets || []).map((bullet) => (
                        <p key={bullet}>✓ {bullet}</p>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#4c2c11] px-4 py-5 text-[18px] font-bold uppercase text-white sm:px-8">
                    {labels?.step3?.groupSelectionsTitle ?? "Group Selections"}
                  </div>

                  <SummaryRow
                    label={`${labels?.step3?.groupFields?.season ?? "Season Selected"}:`}
                    value={groupData.seasonLabel || "-"}
                  />
                  <SummaryRow
                    label={`${labels?.step3?.groupFields?.camp ?? "Camp Selected"}:`}
                    value={selectedCamp?.name || "-"}
                  />
                  <SummaryRow
                    label={`${labels?.step3?.groupFields?.campTier ?? "Camp Tier"}:`}
                    value="Tier 1"
                  />
                  <SummaryRow
                    label={`${labels?.step3?.groupFields?.package ?? "Package Selected"}:`}
                    value={(() => {
                      const selectedPackage = config?.packages.find(
                        (p) => p.id === groupData.packageId
                      );
                      return selectedPackage && selectedPricing
                        ? `${selectedPackage.label} — $${base3Rate}/person`
                        : "-";
                    })()}
                  />
                  <SummaryRow
                    label={`${labels?.step3?.groupFields?.totalHunters ?? "Total Hunters Selected"}:`}
                    value={`${groupData.hunterCount} Hunters`}
                  />
                  <SummaryRow
                    label={`${labels?.step3?.groupFields?.earlyBird ?? "Early Bird Discount"}:`}
                    value={groupData.earlyBird === "Yes" ? "Yes (5%)" : "No"}
                  />
                  <div className="border-b border-[#d9d9d9] px-4 py-3 text-center text-[14px] font-medium text-[#2b1a0f] sm:px-8 sm:py-5">
                    ✓ {labels?.step3?.groupFields?.week ?? "Week Selected"}:{" "}
                    {selectedWeek?.label || "-"}
                  </div>

                  <div className="bg-[#4c2c11] px-4 py-5 text-[18px] font-bold uppercase text-white sm:px-8">
                    {labels?.step3?.hunterSelectionsTitle ?? "Hunter Selections"}
                  </div>

                  <div className="overflow-x-auto px-2 py-4 sm:px-4">
                    <table className="min-w-[1000px] w-full border border-[#d9d9d9] bg-white text-[12px] text-[#2b1a0f]">
                      <thead>
                        <tr className="bg-[#f26f2d] text-left text-white">
                          <th className="border border-[#d9d9d9] px-2 py-2">#</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">Hunter Name</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">Discount</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">Base Rate</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">Vol Disc</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">Extra Hunt</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">Extra Lodge</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">Jr/Youth</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">Adult Disc</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">Early Bird</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">{taxLabel}</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">Total</th>
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
                            <td className="border border-[#d9d9d9] px-2 py-2">
                              ${row.baseRate.toFixed(2)}
                            </td>
                            {/* FIX: volumeDiscount stored negative; display as −$X not −$−X */}
                            <td className="border border-[#d9d9d9] px-2 py-2 text-red-600">
                              {row.volumeDiscount < 0
                                ? `-$${Math.abs(row.volumeDiscount).toFixed(2)}`
                                : `$${row.volumeDiscount.toFixed(2)}`}
                            </td>
                            <td className="border border-[#d9d9d9] px-2 py-2">
                              ${row.extraHunting.toFixed(2)}
                            </td>
                            <td className="border border-[#d9d9d9] px-2 py-2">
                              ${row.extraLodging.toFixed(2)}
                            </td>
                            {/* Jr/Youth discount (negative = reduction) */}
                            <td className="border border-[#d9d9d9] px-2 py-2 text-red-600">
                              {row.juniorDiscount < 0
                                ? `-$${Math.abs(row.juniorDiscount).toFixed(2)}`
                                : `$${row.juniorDiscount.toFixed(2)}`}
                            </td>
                            {/* Adult discount (negative = reduction) */}
                            <td className="border border-[#d9d9d9] px-2 py-2 text-red-600">
                              {row.individualDiscount < 0
                                ? `-$${Math.abs(row.individualDiscount).toFixed(2)}`
                                : `$${row.individualDiscount.toFixed(2)}`}
                            </td>
                            {/* Early bird discount (negative = reduction) */}
                            <td className="border border-[#d9d9d9] px-2 py-2 text-red-600">
                              {row.earlyBirdDiscount < 0
                                ? `-$${Math.abs(row.earlyBirdDiscount).toFixed(2)}`
                                : `$${row.earlyBirdDiscount.toFixed(2)}`}
                            </td>
                            <td className="border border-[#d9d9d9] px-2 py-2">
                              ${row.tax.toFixed(2)}
                            </td>
                            <td className="border border-[#d9d9d9] px-2 py-2 font-bold">
                              ${row.total.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="mt-4 flex justify-center md:justify-end">
                      <button className="rounded-md bg-[#f26f2d] px-8 py-3 text-[15px] font-bold uppercase text-white">
                        {labels?.step3?.totalsBadgeLabel ?? "Totals"}
                      </button>
                    </div>

                    <div className="mt-5 text-center text-[16px] font-semibold text-[#2b1a0f] md:text-right md:text-[18px]">
                      {labels?.step3?.totalPriceLabel ??
                        "Total price after applicable discounts and state sales tax:"}{" "}
                      <span className="text-[24px] font-semibold">
                        ${grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#4c2c11] px-4 py-5 text-[18px] font-bold uppercase text-white sm:px-8">
                    {labels?.step3?.depositTitle ?? "Deposit/Booking Information"}
                  </div>

                  <div className="px-4 py-6 text-[14px] text-[#2b1a0f] sm:px-6 md:px-8">
                    <p className="mb-5 font-semibold">
                      {labels?.step3?.depositDescription ??
                        "Deposit % is based on booking date. Up to May 1: 25%. May 1–Aug 31: 50%. Sept 1–end of season: 100%."}
                    </p>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_320px] md:items-center">
                      <label className="font-semibold">
                        <span className="mr-1 text-[#f26f2d]">*</span>
                        {labels?.step3?.bookingNameLabel ?? "Enter name of person booking the hunt:"}
                      </label>
                      <input
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        maxLength={120}
                        autoComplete="name"
                        className="h-10 rounded-md border border-[#9f9f9f] bg-white px-3 outline-none"
                      />
                      {validationErrors.bookingName && (
                        <div className="md:col-start-2 text-sm font-semibold text-red-700">
                          {validationErrors.bookingName}
                        </div>
                      )}

                      <label className="font-semibold">
                        <span className="mr-1 text-[#f26f2d]">*</span>
                        {labels?.step3?.bookingEmailLabel ?? "Enter email address of person booking the hunt:"}
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
                      {validationErrors.bookingEmail && (
                        <div className="md:col-start-2 text-sm font-semibold text-red-700">
                          {validationErrors.bookingEmail}
                        </div>
                      )}

                      <label className="font-semibold">
                        {labels?.step3?.depositAmountLabel ?? "Deposit Amount"} (
                        {Math.round(depositRate * 100)}%):
                      </label>
                      {/* FIX: No processing fee line. Deposit = depositBase only. */}
                      <div className="text-[16px] font-semibold">
                        ${depositTotal.toFixed(2)}
                      </div>
                    </div>

                    <p className="mt-4 text-[13px] italic text-[#4e4e4e]">
                      {labels?.step3?.depositNote ??
                        "Note: You will be redirected to Paypal.com to make your secure deposit."}
                    </p>

                    <div className="mt-8 flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between">
                      <button
                        onClick={() => setStep(2)}
                        className="text-[14px] font-bold uppercase text-[#4c2c11] underline underline-offset-4"
                      >
                        {labels?.step3?.backButton ?? "Back to Step 2"}
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full rounded-md bg-[#f26f2d] px-8 py-4 text-[15px] font-bold uppercase tracking-[0.05em] text-white shadow-md transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
                      >
                        {isSubmitting
                          ? "Submitting..."
                          : (labels?.step3?.submitButton ?? "Submit Quote Request »")}
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
                        {quotePdfUrl && (
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
                        )}
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
