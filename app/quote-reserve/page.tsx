"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 py-5">
      <div className="h-px flex-1 bg-[#d7b299]" />
      <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#e97933]">
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
          <span className="text-[12px] font-semibold text-[#f26f2d]">
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

  useEffect(() => {
    async function loadConfig() {
      try {
        const response = await fetch("/api/calculator/config");
        const data = (await response.json()) as CalculatorConfig;

        if (!response.ok) {
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
        setConfigError("Unable to load quote data right now. Please refresh and try again.");
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

  const discountMap = useMemo(() => {
    const map = new Map<string, CalculatorConfig["discountRules"][number]>();
    (config?.discountRules ?? []).forEach((rule) => map.set(rule.code, rule));
    return map;
  }, [config]);

  const discountOptions = useMemo(() => {
    if (!config) return [];
    return config.discountRules
      .slice()
      .sort((a, b) => a.stackOrder - b.stackOrder)
      .map((rule) => ({ code: rule.code, label: rule.label }));
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

  const pricingRows = useMemo(() => {
    if (!config || !selectedPricing) return [];

    const volumeDiscount = getVolumeDiscount(config.volumeRules, groupData.hunterCount);

    return hunters.map((hunter, idx) => {
      const baseRate = selectedPricing.baseRate;
      const rule = discountMap.get(hunter.discountCode) ?? discountMap.get("NONE");
      const extraHunting = hunter.extraDays * 225;
      const extraLodging = hunter.extraNights * 165;
      const rateAfterVolume = baseRate - volumeDiscount;
      const earlyBirdDiscount = groupData.earlyBird === "Yes" ? rateAfterVolume * 0.05 : 0;

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
      const tax = subtotalBeforeTax * 0.065;
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
  const totalTax = taxableSubtotal * 0.065;
  const grandSubtotal = taxableSubtotal + totalTax;

  const today = new Date();
  const mayFirst = new Date(today.getFullYear(), 4, 1);
  const augEnd = new Date(today.getFullYear(), 7, 31, 23, 59, 59, 999);
  const depositRate = today < mayFirst ? 0.25 : today <= augEnd ? 0.5 : 1;

  const depositBase = grandSubtotal * depositRate;
  const processingFee = depositBase * 0.0299;
  const depositTotal = depositBase + processingFee;

  const handleSubmit = async () => {
    if (!config || !groupData.campId || !groupData.weekId || !groupData.packageId) {
      setSubmitMessage("Configuration not loaded yet. Please wait and try again.");
      return;
    }

    if (!bookingName || !bookingEmail) {
      setSubmitMessage("Please enter booking name and email.");
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
      <section className="QuoteReserveImage relative flex h-screen min-h-[620px] items-center justify-center">
        <div className="absolute inset-0 bg-[#f0d2b0]/50" />
        <div className="absolute inset-0 bg-black/5" />

        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          <h1 className="text-[46px] font-bold uppercase leading-none text-[#281703] md:text-[76px]">
            Quote-Reserve
          </h1>

          <div className="mt-6 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#281703]">
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

        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2">
          <div className="h-20 w-full rounded-t-[100%] border-t-[4px] border-[#281703] bg-[#E7DCCF]" />
        </div>
      </section>

      <section className="bg-[#E7DCCF] px-4 pb-24 pt-20 md:px-6">
        <div className="mx-auto max-w-[1180px]">
          <h2 className="text-center text-[30px] font-black uppercase tracking-[0.04em] text-[#281703] md:text-[54px]">
            {step === 1 && "Step 1: Quote-Reserve Group Options"}
            {step === 2 && "Step 2: Quote-Reserve Enter Hunters"}
            {step === 3 && "Step 3: Quote-Reserve Review Totals"}
          </h2>

          {configError ? (
            <div className="mt-8 rounded-md bg-red-100 px-6 py-4 text-center font-semibold text-red-800">
              {configError}
            </div>
          ) : null}

          <div className="mt-8 overflow-hidden rounded-[18px] bg-[#f5f5f5] shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
            {step === 1 && (
              <>
                <div className="bg-[#4c2c11] px-8 py-6 text-center text-[26px] font-bold uppercase text-white md:text-[44px]">
                  Price Your Own Hunt in 3 Simple Steps
                </div>

                <div className="bg-[#f5f5f5] px-8 pb-8 pt-4">
                  <SectionDivider label="Required Fields" />

                  <div className="overflow-hidden rounded-b-xl border border-[#d9d9d9] bg-[#f5f5f5]">
                    <FieldRow label="What Season Is Your Group Hunting In?">
                      <select
                        value={groupData.seasonLabel}
                        onChange={(e) => {
                          const newSeason = e.target.value;
                          const firstWeekForSeason =
                            config?.weeks.find((week) => week.seasonLabel === newSeason)?.id ?? "";

                          setGroupData((prev) => ({
                            ...prev,
                            seasonLabel: newSeason,
                            weekId: firstWeekForSeason,
                          }));
                        }}
                        className="h-11 w-full rounded-md border border-[#9f9f9f] bg-white px-4 text-[14px] text-[#5a5a5a] outline-none"
                      >
                        {seasonOptions.map((season) => (
                          <option key={season} value={season}>
                            {season}
                          </option>
                        ))}
                      </select>
                    </FieldRow>

                    <FieldRow
                      label="What Camp Is Your Group Going To?"
                      reference="Reference Camps"
                    >
                      <select
                        value={groupData.campId}
                        onChange={(e) =>
                          setGroupData((prev) => ({ ...prev, campId: e.target.value }))
                        }
                        className="h-11 w-full rounded-md border border-[#9f9f9f] bg-white px-4 text-[14px] text-[#5a5a5a] outline-none"
                      >
                        {(config?.camps ?? []).map((camp) => (
                          <option key={camp.id} value={camp.id}>
                            {camp.name}
                          </option>
                        ))}
                      </select>
                    </FieldRow>

                    <FieldRow
                      label="What Week Is Your Group Going?"
                      reference="Reference Days Camps"
                    >
                      <select
                        value={groupData.weekId}
                        onChange={(e) =>
                          setGroupData((prev) => ({ ...prev, weekId: e.target.value }))
                        }
                        className="h-11 w-full rounded-md border border-[#9f9f9f] bg-white px-4 text-[14px] text-[#5a5a5a] outline-none"
                      >
                        {weekOptions.map((week) => (
                          <option key={week.id} value={week.id}>
                            {week.label}
                          </option>
                        ))}
                      </select>
                    </FieldRow>

                    <FieldRow
                      label="How Many Hunters In Your Group?"
                      reference="Minimums and Capacities Chart"
                    >
                      <select
                        value={groupData.hunterCount}
                        onChange={(e) =>
                          setGroupData((prev) => ({
                            ...prev,
                            hunterCount: Number(e.target.value),
                          }))
                        }
                        className="h-11 w-full rounded-md border border-[#9f9f9f] bg-white px-4 text-[14px] text-[#5a5a5a] outline-none"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((count) => (
                          <option key={count} value={count}>
                            {count} Hunters
                          </option>
                        ))}
                      </select>
                    </FieldRow>

                    <FieldRow
                      label="What Package?"
                      reference="Minimums and Capacities Chart"
                    >
                      <select
                        value={groupData.packageId}
                        onChange={(e) =>
                          setGroupData((prev) => ({
                            ...prev,
                            packageId: e.target.value,
                          }))
                        }
                        className="h-11 w-full rounded-md border border-[#9f9f9f] bg-white px-4 text-[14px] text-[#5a5a5a] outline-none"
                      >
                        {(config?.packages ?? []).map((pkg) => (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.label}
                          </option>
                        ))}
                      </select>
                    </FieldRow>
                  </div>

                  <div className="mt-8">
                    <SectionDivider label="Optional Fields" />
                  </div>

                  <div className="grid grid-cols-1 items-center gap-6 px-8 py-4 md:grid-cols-[1.2fr_1fr]">
                    <label className="text-[15px] font-semibold text-[#2b1a0f]">
                      <span className="mr-1 text-[#f26f2d]">*</span>
                      Does Your Group Qualify For 5% Early Bird Booking Discount?
                      <span className="ml-1 text-[#f26f2d]">●</span>
                    </label>

                    <select
                      value={groupData.earlyBird}
                      onChange={(e) =>
                        setGroupData((prev) => ({
                          ...prev,
                          earlyBird: e.target.value as "Yes" | "No",
                        }))
                      }
                      className="h-11 w-full max-w-[140px] rounded-md border border-[#9f9f9f] bg-white px-4 text-[14px] text-[#5a5a5a] outline-none"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  <div className="mt-8 flex justify-end px-8 pb-6">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!config}
                      className="rounded-md bg-[#f26f2d] px-8 py-4 text-[15px] font-black uppercase tracking-[0.05em] text-white shadow-md transition hover:brightness-95 disabled:opacity-50"
                    >
                      To Step 2: Enter Hunters »
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-[70px_1.3fr_1.5fr_1.2fr_1.3fr] bg-[#4c2c11] px-6 py-5 text-[13px] font-bold uppercase text-white md:text-[18px]">
                  <div />
                  <div>Hunter Name</div>
                  <div>Individual Discount</div>
                  <div>Extra Days Hunting</div>
                  <div>Extra Nights Lodging</div>
                </div>

                <div className="bg-[#f5f5f5]">
                  {hunters.map((hunter, index) => (
                    <div
                      key={hunter.id}
                      className="grid grid-cols-[70px_1.3fr_1.5fr_1.2fr_1.3fr] items-center gap-4 border-b border-[#d9d9d9] px-6 py-5"
                    >
                      <div className="text-[14px] font-bold text-[#2b1a0f]">{index + 1})</div>

                      <input
                        value={hunter.name}
                        onChange={(e) =>
                          setHunters((prev) =>
                            prev.map((item, i) =>
                              i === index ? { ...item, name: e.target.value } : item
                            )
                          )
                        }
                        placeholder="Hunter Name"
                        className="h-10 rounded-md border border-[#9f9f9f] bg-white px-3 text-[14px] outline-none"
                      />

                      <select
                        value={hunter.discountCode}
                        onChange={(e) =>
                          setHunters((prev) =>
                            prev.map((item, i) =>
                              i === index
                                ? { ...item, discountCode: e.target.value }
                                : item
                            )
                          )
                        }
                        className="h-10 rounded-md border border-[#9f9f9f] bg-white px-3 text-[14px] outline-none"
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
                              i === index
                                ? { ...item, extraDays: Number(e.target.value) }
                                : item
                            )
                          )
                        }
                        className="h-10 rounded-md border border-[#9f9f9f] bg-white px-3 text-[14px] outline-none"
                      >
                        {[0, 1, 2, 3].map((value) => (
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
                              i === index
                                ? { ...item, extraNights: Number(e.target.value) }
                                : item
                            )
                          )
                        }
                        className="h-10 rounded-md border border-[#9f9f9f] bg-white px-3 text-[14px] outline-none"
                      >
                        {[0, 1, 2, 3].map((value) => (
                          <option key={value} value={value}>
                            {value === 0 ? "Extra Nights Lodging" : `${value} Extra Night`}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}

                  <div className="grid grid-cols-1 items-center gap-4 px-8 py-8 md:grid-cols-[auto_280px] md:justify-start">
                    <label className="text-[15px] font-semibold text-[#2b1a0f]">
                      Enter your email address to receive a copy of the quote:
                    </label>

                    <input
                      value={quoteEmail}
                      onChange={(e) => setQuoteEmail(e.target.value)}
                      className="h-10 rounded-md border border-[#9f9f9f] bg-white px-3 text-[14px] outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between px-8 pb-8">
                    <button
                      onClick={() => setStep(1)}
                      className="text-[14px] font-bold uppercase text-[#4c2c11] underline underline-offset-4"
                    >
                      Back to Step 1
                    </button>

                    <button
                      onClick={() => setStep(3)}
                      className="rounded-md bg-[#f26f2d] px-8 py-4 text-[15px] font-black uppercase tracking-[0.05em] text-white shadow-md transition hover:brightness-95"
                    >
                      To Step 3: Review Total »
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <div className="bg-[#f5f5f5]">
                <div className="overflow-hidden">
                  <div className="bg-[#4c2c11] px-8 py-5 text-[18px] font-bold uppercase text-white">
                    Quote Details and Payment Options
                  </div>

                  <div className="border-b border-[#d9d9d9] px-8 py-8 text-center text-[14px] leading-7 text-[#2b1a0f]">
                    <p className="font-semibold">
                      Thank you for quoting your groups fair chase pheasant hunt at a
                      UGUIDE South Dakota Pheasant Hunting property. You are encouraged
                      to forward this quote to your group for their review and
                      consideration.
                    </p>

                    <p className="mt-6 font-semibold">
                      There are two simple options to reserve your hunt:
                    </p>

                    <p className="mt-4 text-[18px] font-black">
                      Option 1 - One group member pays deposit
                    </p>

                    <div className="mt-3 space-y-2">
                      <p>✓ Check the Availability page to make sure the hunt you would like to reserve is available.</p>
                      <p>
                        ✓ Use the Booking Tool which will calculate your deposit amount
                        and then take you to Paypal to pay with credit card or Paypal
                        account, whichever you prefer.
                      </p>
                      <p>
                        ✓ Upon completion of checkout, you will receive an automated
                        itinerary for your hunt package in your email.
                      </p>
                    </div>

                    <p className="mt-6 text-[18px] font-black">
                      Option 2 - Individuals in group split up deposit
                    </p>

                    <div className="mt-3 space-y-2">
                      <p>✓ Check the Availability page to make sure the hunt you would like to reserve is available.</p>
                      <p>
                        ✓ From the Quote page, determine how much you would like each
                        member of your group to pay as their portion of the deposit.
                      </p>
                      <p>
                        ✓ Email the Individual Pay link to each member of your group
                        with instructions on the amount you would like them to pay.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#4c2c11] px-8 py-5 text-[18px] font-bold uppercase text-white">
                    Group Selections
                  </div>

                  <SummaryRow label="Season Selected:" value={groupData.seasonLabel || "-"} />
                  <SummaryRow label="Camp Selected:" value={selectedCamp?.name || "-"} />
                  <SummaryRow label="Camp Tier:" value="Tier 1" />
                  <SummaryRow label="Package Selected:" value={selectedPackage?.label || "-"} />
                  <SummaryRow
                    label="Total Hunters Selected:"
                    value={`${groupData.hunterCount} Hunters`}
                  />
                  <SummaryRow label="Early Bird Discount:" value={groupData.earlyBird} />
                  <SummaryRow
                    label="Minimum Group Revenue Rule:"
                    value={selectedPricing ? `${selectedPricing.minGroupSize} minimum` : "-"}
                  />

                  <div className="border-b border-[#d9d9d9] px-8 py-5 text-center text-[14px] font-medium text-[#2b1a0f]">
                    ✓ Week Selected: {selectedWeek?.label || "-"}
                  </div>

                  <div className="bg-[#4c2c11] px-8 py-5 text-[18px] font-bold uppercase text-white">
                    Hunter Selections
                  </div>

                  <div className="overflow-x-auto px-4 py-4">
                    <table className="min-w-full border border-[#d9d9d9] bg-white text-[12px] text-[#2b1a0f]">
                      <thead>
                        <tr className="bg-[#f26f2d] text-left text-white">
                          <th className="border border-[#d9d9d9] px-2 py-2">#</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">Hunter Name</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">Individual Discount</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">Base Rate</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">Volume Discount</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">Extra Hunting</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">Extra Lodging</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">Junior Discount</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">Adult Discount</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">Early Bird Discount</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">Taxes 6.5%</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pricingRows.map((row, index) => (
                          <tr key={row.id}>
                            <td className="border border-[#d9d9d9] px-2 py-2">{index + 1}</td>
                            <td className="border border-[#d9d9d9] px-2 py-2">
                              {row.name || `Hunter ${index + 1}`}
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

                    <div className="mt-4 flex justify-end">
                      <button className="rounded-md bg-[#f26f2d] px-8 py-3 text-[15px] font-black uppercase text-white">
                        Totals
                      </button>
                    </div>

                    <div className="mt-5 text-right text-[18px] font-semibold text-[#2b1a0f]">
                      Subtotal before tax: <span className="text-[24px] font-black">${subtotalBeforeTax.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 text-right text-[18px] font-semibold text-[#2b1a0f]">
                      Minimum adjustment: <span className="text-[24px] font-black">${minimumAdjustment.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 text-right text-[18px] font-semibold text-[#2b1a0f]">
                      Total price after applicable discounts and state sales tax:{" "}
                      <span className="text-[28px] font-black">${grandSubtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-[#4c2c11] px-8 py-5 text-[18px] font-bold uppercase text-white">
                    Deposit/Booking Information
                  </div>

                  <div className="px-8 py-6 text-[14px] text-[#2b1a0f]">
                    <p className="mb-5 font-semibold">
                      Deposit % calculated is based on the time of year that you are
                      booking a hunt. Up to May 1st it is 25%. From May 1-August 31 it
                      is 50%. From Sept. 1 thru end of season it is 100%.
                    </p>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_320px] md:items-center">
                      <label className="font-semibold">
                        <span className="mr-1 text-[#f26f2d]">*</span>
                        Enter name of person booking the hunt:
                      </label>
                      <input
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        className="h-10 rounded-md border border-[#9f9f9f] bg-white px-3 outline-none"
                      />

                      <label className="font-semibold">
                        <span className="mr-1 text-[#f26f2d]">*</span>
                        Enter email address of person booking the hunt:
                      </label>
                      <input
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                        className="h-10 rounded-md border border-[#9f9f9f] bg-white px-3 outline-none"
                      />

                      <label className="font-semibold">Deposit Amount ({Math.round(depositRate * 100)}%):</label>
                      <div className="text-[18px] font-black">
                        ${depositBase.toFixed(2)} + 2.99% (${processingFee.toFixed(2)}) = $
                        {depositTotal.toFixed(2)}
                      </div>
                    </div>

                    <p className="mt-4 text-[13px] italic text-[#4e4e4e]">
                      Note: You will be redirected to Paypal.com to make your secure
                      deposit.
                    </p>

                    <div className="mt-8 flex items-center justify-between">
                      <button
                        onClick={() => setStep(2)}
                        className="text-[14px] font-bold uppercase text-[#4c2c11] underline underline-offset-4"
                      >
                        Back to Step 2
                      </button>

                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="rounded-md bg-[#f26f2d] px-8 py-4 text-[15px] font-black uppercase tracking-[0.05em] text-white shadow-md transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Quote Request »"}
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
