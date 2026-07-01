"use client";

import React, { useState } from "react";

const policies = [
  {
    id: 1,
    category: "Payments",
    title: "Sales tax & late registration",
    content: (
      <>
        <p>
          All sales are taxed at the South Dakota rate of 4.2% plus a 1.5%
          tourism tax, for a total of <strong>5.7%</strong>.
        </p>
        <p>
          Full payment and registration — including waivers and IDs — must be
          received by <strong>August 31st</strong>. Groups that miss this
          deadline forfeit their deposits and hunting reservation.
        </p>
        <p className="text-[#C8860A] text-sm italic mt-3">
          All discounts are conditional on payments being made on time.
        </p>
      </>
    ),
  },
  {
    id: 2,
    category: "Service",
    title: "Right to refuse service",
    content: (
      <>
        <p>
          UGUIDE reserves the right to refuse service to any party, for any
          reason. In most cases, a full refund of any deposits paid in advance
          will be issued.
        </p>
      </>
    ),
  },
  {
    id: 3,
    category: "Dogs",
    title: "Group dog owner policy",
    content: (
      <>
        <p>
          If a lodge space is posted "no dogs allowed" and anyone in the hunting
          group brings a dog into that space, the entire group will not be
          invited back to any UGUIDE Pheasant Camp in the future.
        </p>
        <p className="mt-3">Why this rule exists:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Animals can damage lodge interiors and furnishings</li>
          <li>Some guests have allergies and prefer animal-free living spaces</li>
          <li>
            Lodge owners have moved away from allowing pets indoors based on past
            experience
          </li>
          <li>
            Even well-behaved house dogs can be territorial in unfamiliar spaces
          </li>
          <li>
            Lodge owners typically provide suitable accommodations for animals
            separately
          </li>
        </ul>
        <p className="text-[#C8860A] text-sm italic mt-3">
          Some lodges do allow dogs in living areas and will not have a "no
          dogs" posting. Some also require a damage deposit in advance.
        </p>
      </>
    ),
  },
  {
    id: 4,
    category: "CRP Land",
    title: "CRP cover disturbance disclaimer",
    content: (
      <>
        <p>
          CRP (Conservation Reserve Program) acreage may be impacted by factors
          outside UGUIDE's control. These include:
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>
            <strong>Weed control</strong> — landowners may clip or spray noxious
            weeds as required by their contract
          </li>
          <li>
            <strong>Mid-contract management</strong> — every 5 years, landowners
            must disturb grass cover by mechanical clipping/baling (typically
            August) or prescribed burn (typically April–May). Burns are preferred
            and have minimal impact on fall cover
          </li>
          <li>
            <strong>Emergency haying & grazing</strong> — in severe drought
            years, the USDA may open up to 50% of county CRP acres to grazing or
            haying
          </li>
          <li>
            <strong>Contract renewal</strong> — if a CRP contract expires and is
            renewed, the NRCS may require reseeding
          </li>
        </ul>
        <p className="text-[#C8860A] text-sm italic mt-3">
          UGUIDE enters into partnerships with landowners rather than leasing
          land, and may not always be aware of changes at a specific location.
        </p>
      </>
    ),
  },
  {
    id: 5,
    category: "Refunds",
    title: "No refunds & limited credit",
    content: (
      <>
        <p>
          Due to the variable nature of native wild pheasant hunting, UGUIDE
          operates a no-refund policy with a limited credit option:
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>
            Up to <strong>2 full adult credits</strong> may be issued if a guest
            cannot attend their group's hunt
          </li>
          <li>
            The group must rebook the following year at the minimum hunt level;
            credits apply above and beyond that minimum
          </li>
        </ul>
        <p className="mt-3">
          <strong>PayPal payments:</strong> As of Fall 2019, PayPal no longer
          refunds transaction fees. Any refund processed through PayPal will be
          reduced by approximately 3% to cover PayPal's transaction fee.
        </p>
      </>
    ),
  },
];

const filters = ["All", "Payments", "Service", "Dogs", "CRP Land", "Refunds"];

export default function page() {
  // We'll render policies using an accordion UI similar to the FAQ page.

  function AccordionItem({ q, a }: { q: string; a: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    return (
      <div
        className={`border-b border-[#3D2B0A]/30 transition-colors duration-200 ${
          open ? "bg-[#3D2B0A]/10" : "hover:bg-[#3D2B0A]/5"
        }`}
      >
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-left flex justify-between items-start gap-4 py-5 px-1 group"
          aria-expanded={open}
        >
          <span className="font-semibold text-[#C8860A] text-base leading-snug group-hover:text-[#C8860A] transition-colors duration-150">
            {q}
          </span>
          <span
            className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border border-[#C8860A] flex items-center justify-center transition-transform duration-300 ${
              open ? "rotate-45 bg-[#C8860A]" : ""
            }`}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="5"
                y1="1"
                x2="5"
                y2="9"
                stroke={open ? "#1A1208" : "#C8860A"}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="1"
                y1="5"
                x2="9"
                y2="5"
                stroke={open ? "#1A1208" : "#C8860A"}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            open ? "max-h-96 pb-5" : "max-h-0"
          }`}
        >
          <div className="text-[#B8A88A] text-sm leading-relaxed px-1 pr-8">
            {a}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen font-sans ">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-16 px-6 md:px-12 ">
        <div className="relative max-w-5xl mt-10 mx-auto pt-10">
          <h1
            className="text-[#E8E0D0] leading-[1.05] "
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
              fontWeight: 700,
            }}
          >
            <span className="text-[#C8860A] italic">policies</span>
          </h1>
        </div>
      </section>

      {/* ── Policy Accordion ── */}
      <section className="max-w-5xl mx-auto ">
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-14">
          {policies.map((policy) => (
            <div key={policy.id}>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8860A] flex-shrink-0" />
                <h2 className="text-black text-xs font-bold tracking-[0.25em] uppercase">
                  {policy.category}
                </h2>
              </div>
              <div className="border-t border-[#3D2B0A]/60 pt-1">
                <AccordionItem q={policy.title} a={policy.content} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


    
 