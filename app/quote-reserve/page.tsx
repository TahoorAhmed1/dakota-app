"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type StepOneData = {
  season: string;
  camp: string;
  week: string;
  hunterCount: number;
  packageType: string;
  earlyBird: "Yes" | "No";
};

type HunterForm = {
  id: number;
  name: string;
  discount: string;
  extraDays: number;
  extraNights: number;
};

const seasons = ["2026 Season (10/17/2026-01/03/2027)", "2027 Season"];
const camps = [
  "Faulkton Pheasant Camp",
  "Gunners Haven",
  "Meadow Creek Pheasant Camp",
  "Pheasant Camp Lodge",
  "West River Adventures",
];

const weeks = [
  "Week 1 - Oct. 17–19",
  "Week 2 - Oct. 24–26",
  "Week 3 - Oct. 31–Nov. 02",
  "Week 4 - Nov. 07–09",
  "Week 5 - Nov. 14–16",
  "Week 6 - Nov. 21–23",
  "Week 7 - Nov. 28–30",
  "Week 8 - Dec. 05–07",
  "Week 9 - Dec. 12–14",
];

const packages = ["4 Nights / 3 Days", "3 Nights / 2 Days", "5 Nights / 4 Days"];

const discountOptions = [
  "Adult - Group Coordinator",
  "Adult - Military",
  "Adult - Veteran",
  "Junior / Youth",
  "None",
];

const packageRates: Record<string, number> = {
  "4 Nights / 3 Days": 1749,
  "3 Nights / 2 Days": 1399,
  "5 Nights / 4 Days": 2099,
};

const makeHunter = (id: number): HunterForm => ({
  id,
  name: "",
  discount: "Adult - Group Coordinator",
  extraDays: 0,
  extraNights: 0,
});

const getDiscountValue = (discount: string) => {
  switch (discount) {
    case "Adult - Group Coordinator":
      return { adult: 175, youth: 0 };
    case "Adult - Military":
      return { adult: 125, youth: 0 };
    case "Adult - Veteran":
      return { adult: 100, youth: 0 };
    case "Junior / Youth":
      return { adult: 0, youth: 150 };
    default:
      return { adult: 0, youth: 0 };
  }
};

const getVolumeDiscount = (count: number) => {
  if (count >= 8) return 60;
  if (count >= 6) return 40;
  if (count >= 4) return 20;
  return 0;
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
  const [submitMessage, setSubmitMessage] = useState('');

  const [groupData, setGroupData] = useState<StepOneData>({
    season: seasons[0],
    camp: camps[1],
    week: weeks[0],
    hunterCount: 8,
    packageType: packages[0],
    earlyBird: "No",
  });

  const [hunters, setHunters] = useState<HunterForm[]>(
    Array.from({ length: 8 }, (_, i) => makeHunter(i + 1))
  );

  const [quoteEmail, setQuoteEmail] = useState("");
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");

  useEffect(() => {
    setHunters((prev) =>
      Array.from({ length: groupData.hunterCount }, (_, i) => prev[i] ?? makeHunter(i + 1))
    );
  }, [groupData.hunterCount]);

  const handleSubmit = async () => {
    if (!bookingName || !bookingEmail) {
      setSubmitMessage('Please enter booking name and email');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupData,
          hunters,
          pricing: pricingRows,
          totals: {
            subtotal: grandSubtotal,
            depositBase,
            processingFee,
            depositTotal
          },
          bookingInfo: {
            name: bookingName,
            email: bookingEmail
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage(`Quote submitted successfully! Quote ID: ${data.quoteId}`);
        // Could redirect to a thank you page or show success state
      } else {
        setSubmitMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Quote submission error:', error);
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pricingRows = useMemo(() => {
    const baseRate = packageRates[groupData.packageType] ?? 1749;
    const volumeDiscount = getVolumeDiscount(groupData.hunterCount);

    return hunters.map((hunter) => {
      const extraHunting = hunter.extraDays * 225;
      const extraLodging = hunter.extraNights * 165;
      const discountValues = getDiscountValue(hunter.discount);
      const adultDiscount = discountValues.adult;
      const youthDiscount = discountValues.youth;

      const subtotalBeforeEarlyBird =
        baseRate +
        extraHunting +
        extraLodging -
        volumeDiscount -
        adultDiscount -
        youthDiscount;

      const earlyBirdDiscount =
        groupData.earlyBird === "Yes" ? subtotalBeforeEarlyBird * 0.05 : 0;

      const taxableSubtotal = subtotalBeforeEarlyBird - earlyBirdDiscount;
      const tax = taxableSubtotal * 0.065;
      const total = taxableSubtotal + tax;

      return {
        ...hunter,
        baseRate,
        volumeDiscount,
        extraHunting,
        extraLodging,
        adultDiscount,
        youthDiscount,
        earlyBirdDiscount,
        tax,
        total,
      };
    });
  }, [groupData, hunters]);

  const grandSubtotal = pricingRows.reduce((sum, row) => sum + row.total, 0);
  const depositBase = grandSubtotal * 0.25;
  const processingFee = depositBase * 0.0299;
  const depositTotal = depositBase + processingFee;

  return (
    <main className="flex flex-col">
      {/* Hero */}
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

      {/* Main content */}
      <section className="bg-[#E7DCCF] px-4 pb-24 pt-20 md:px-6">
        <div className="mx-auto max-w-[1180px]">
          <h2 className="text-center text-[30px] font-black uppercase tracking-[0.04em] text-[#281703] md:text-[54px]">
            {step === 1 && "Step 1: Quote-Reserve Group Options"}
            {step === 2 && "Step 2: Quote-Reserve Enter Hunters"}
            {step === 3 && "Step 3: Quote-Reserve Review Totals"}
          </h2>

          <div className="mt-8 overflow-hidden rounded-[18px] bg-[#f5f5f5] shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
            {/* Step 1 */}
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
                        value={groupData.season}
                        onChange={(e) =>
                          setGroupData((prev) => ({ ...prev, season: e.target.value }))
                        }
                        className="h-11 w-full rounded-md border border-[#9f9f9f] bg-white px-4 text-[14px] text-[#5a5a5a] outline-none"
                      >
                        {seasons.map((season) => (
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
                        value={groupData.camp}
                        onChange={(e) =>
                          setGroupData((prev) => ({ ...prev, camp: e.target.value }))
                        }
                        className="h-11 w-full rounded-md border border-[#9f9f9f] bg-white px-4 text-[14px] text-[#5a5a5a] outline-none"
                      >
                        {camps.map((camp) => (
                          <option key={camp} value={camp}>
                            {camp}
                          </option>
                        ))}
                      </select>
                    </FieldRow>

                    <FieldRow
                      label="What Week Is Your Group Going?"
                      reference="Reference Days Camps"
                    >
                      <select
                        value={groupData.week}
                        onChange={(e) =>
                          setGroupData((prev) => ({ ...prev, week: e.target.value }))
                        }
                        className="h-11 w-full rounded-md border border-[#9f9f9f] bg-white px-4 text-[14px] text-[#5a5a5a] outline-none"
                      >
                        {weeks.map((week) => (
                          <option key={week} value={week}>
                            {week}
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
                        {[2, 3, 4, 5, 6, 7, 8].map((count) => (
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
                        value={groupData.packageType}
                        onChange={(e) =>
                          setGroupData((prev) => ({
                            ...prev,
                            packageType: e.target.value,
                          }))
                        }
                        className="h-11 w-full rounded-md border border-[#9f9f9f] bg-white px-4 text-[14px] text-[#5a5a5a] outline-none"
                      >
                        {packages.map((pkg) => (
                          <option key={pkg} value={pkg}>
                            {pkg}
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
                      className="rounded-md bg-[#f26f2d] px-8 py-4 text-[15px] font-black uppercase tracking-[0.05em] text-white shadow-md transition hover:brightness-95"
                    >
                      To Step 2: Enter Hunters »
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Step 2 */}
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
                      <div className="text-[14px] font-bold text-[#2b1a0f]">
                        {index + 1})
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
                        placeholder="Hunter Name"
                        className="h-10 rounded-md border border-[#9f9f9f] bg-white px-3 text-[14px] outline-none"
                      />

                      <select
                        value={hunter.discount}
                        onChange={(e) =>
                          setHunters((prev) =>
                            prev.map((item, i) =>
                              i === index ? { ...item, discount: e.target.value } : item
                            )
                          )
                        }
                        className="h-10 rounded-md border border-[#9f9f9f] bg-white px-3 text-[14px] outline-none"
                      >
                        {discountOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
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

            {/* Step 3 */}
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

                  <SummaryRow label="Season Selected:" value="2026" />
                  <SummaryRow label="Camp Selected:" value={groupData.camp} />
                  <SummaryRow label="Camp Tier:" value="Tier 1" />
                  <SummaryRow label="Package Selected:" value={groupData.packageType} />
                  <SummaryRow
                    label="Total Hunters Selected:"
                    value={`${groupData.hunterCount} Hunters`}
                  />
                  <SummaryRow label="Early Bird Discount:" value={groupData.earlyBird} />

                  <div className="border-b border-[#d9d9d9] px-8 py-5 text-center text-[14px] font-medium text-[#2b1a0f]">
                    ✓ Lodging dates: Oct 15-Oct 18 &nbsp;&nbsp; ✓ Hunting dates:
                    Oct 16-Oct 18 &nbsp;&nbsp; ✓ Check-In time is <b>AFTER</b> 3pm
                    Oct 15 &nbsp;&nbsp; ✓ Check-Out time is <b>BEFORE</b> 10am Oct 20
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
                          <th className="border border-[#d9d9d9] px-2 py-2">Junior/Youth Discount</th>
                          <th className="border border-[#d9d9d9] px-2 py-2">Adult Discounts</th>
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
                            <td className="border border-[#d9d9d9] px-2 py-2">{row.discount}</td>
                            <td className="border border-[#d9d9d9] px-2 py-2">${row.baseRate.toFixed(2)}</td>
                            <td className="border border-[#d9d9d9] px-2 py-2">-${row.volumeDiscount.toFixed(2)}</td>
                            <td className="border border-[#d9d9d9] px-2 py-2">${row.extraHunting.toFixed(2)}</td>
                            <td className="border border-[#d9d9d9] px-2 py-2">${row.extraLodging.toFixed(2)}</td>
                            <td className="border border-[#d9d9d9] px-2 py-2">-${row.youthDiscount.toFixed(2)}</td>
                            <td className="border border-[#d9d9d9] px-2 py-2">-${row.adultDiscount.toFixed(2)}</td>
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
                      Total price after applicable discounts and state sales tax:{" "}
                      <span className="text-[28px] font-black">
                        ${grandSubtotal.toFixed(2)}
                      </span>
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

                      <label className="font-semibold">Deposit Amount (25%):</label>
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
                        className="rounded-md bg-[#f26f2d] px-8 py-4 text-[15px] font-black uppercase tracking-[0.05em] text-white shadow-md transition hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Quote Request »'}
                      </button>
                    </div>

                    {submitMessage && (
                      <div className={`mt-4 p-4 rounded-md text-center ${submitMessage.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {submitMessage}
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