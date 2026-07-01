"use client";

import { useState } from "react";

const faqs = [
  {
    category: "The Hunt",
    items: [
      {
        q: "What is included with the UGUIDE package?",
        a: "The basic package includes 4-nights lodging, 3-days hunting, self-guided with a landowner tour of the property and maps. Lodging has a full kitchen so you can cook your own meals. Some camps also offer 4-day hunts and 5 nights lodging.",
      },
      {
        q: "Are UGUIDE hunts all authentic native wild birds?",
        a: "Yes. UGUIDE properties are not preserves, nor do they release any birds. Some owners may release hens in the spring to bolster nesting, but that is rare — most landowners invest in habitat. All rooster pheasants are native wild ringneck pheasants at UGUIDE pheasant hunting camps.",
      },
      {
        q: "Is hunting any good later in the season?",
        a: "Absolutely. Rates are cheaper as the season progresses because demand goes down, not because hunting quality declines. Late season (Thanksgiving or later) benefits include: harvest complete across the state concentrating birds, cooler temperatures ideal for dogs, fully colored roosters easy to identify, and less standing cover. The main trade-off is the risk of inclement weather.",
      },
      {
        q: "What if we don't have dogs?",
        a: "If you don't have dogs your experience could be impacted dramatically. We encourage you to seek fellow hunters with ample dog resources, or seek a guide that provides the dogs needed.",
      },
    ],
  },
  {
    category: "Licenses & Limits",
    items: [
      {
        q: "What does a license cost, and what are the limits?",
        a: "A non-resident small game license ranges from $10 (Youth) to $142 (Adult) plus a $25 Habitat Stamp — purchasable online. This covers 2–5 hunting-day periods. Daily bag limit is 3 roosters with 15 in possession over 5 days (9 roosters for a 3-day hunt). Hunting runs from noon to sunset the first week, then 10am to sunset thereafter. Season generally runs from the 3rd weekend in October through the last weekend in January.",
      },
      {
        q: "Can we hunt Sharp-tail Grouse or Hungarian Partridge?",
        a: "Some camps have huntable Sharp-tail Grouse and Hungarian Partridge populations. These can be hunted from sunrise to sunset with a daily limit of 3 birds and 15 in possession.",
      },
    ],
  },
  {
    category: "Groups & Pricing",
    items: [
      {
        q: "What is the smallest group size you will take?",
        a: "Group size minimums are 6, 8, 10, or 13 depending on the pheasant camp and week. For a typical UGUIDE property, the minimum is 6. We block out a full week, let only one group on that property that week, and rest the property 4 days before your arrival — so we need to generate a minimum fee for that commitment.",
      },
      {
        q: "Can we come with fewer than the minimum and just pay the minimum rate?",
        a: "Yes. If you have 3 hunters, you can come with 3 and split the rate for 4 between yourselves.",
      },
      {
        q: "Are there discounts for larger groups?",
        a: "Yes. Groups of 6 or more are eligible for UGUIDE discounts. Groups of 4–5 are eligible for 1 FREE youth hunter and 1 junior hunter at 50% off. See the South Dakota Pheasant Hunting Discounts page for full details.",
      },
    ],
  },
  {
    category: "Lodging & Location",
    items: [
      {
        q: "What are the lodging accommodations like?",
        a: "Every UGUIDE camp includes: at least 1 full bathroom with shower, TV with satellite, WiFi, full kitchen, individual beds per lodging capacity, dining and reclining chairs, a place to clean and freeze birds, and shelter for your dogs. Buildings are renovated pole sheds, trailer houses, or farmhouses. Most lodging is on-site; some may be a few miles from the hunting property.",
      },
      {
        q: "Where are these Pheasant Camps located in South Dakota?",
        a: "Camps are spread across South Dakota pheasant country. Visit our interactive map page to explore each camp location and click through to full details for every property.",
      },
    ],
  },
  {
    category: "Youth & Waterfowl",
    items: [
      {
        q: "How do we get kids involved in South Dakota Pheasant Hunting?",
        a: "The South Dakota Game, Fish & Parks page has detailed information about Youth, Mentored, and Apprentice Hunts — a great entry point for introducing the next generation to pheasant hunting.",
      },
      {
        q: "We're also interested in South Dakota Waterfowl Hunting.",
        a: "South Dakota Waterfowl Hunting is available at no extra charge at one of our UGUIDE Pheasant Camps. Visit the SD GF&P page for more details on licenses, limits, and species.",
      },
    ],
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border-b border-[#3D2B0A]/30 transition-colors duration-200 ${open ? "bg-[#3D2B0A]/10" : "hover:bg-[#3D2B0A]/5"}`}
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
          className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border border-[#C8860A] flex items-center justify-center transition-transform duration-300 ${open ? "rotate-45 bg-[#C8860A]" : ""}`}
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
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-96 pb-5" : "max-h-0"}`}
      >
        <p className="text-[#B8A88A] text-sm leading-relaxed px-1 pr-8">{a}</p>
      </div>
    </div>
  );
}

export default function page() {
  return (
    <main className="min-h-screen  font-sans mt-30">
  

      {/* ── FAQ Sections ── */}
      <section className="max-w-5xl mx-auto ">
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-14">
          {faqs.map((section) => (
            <div key={section.category}>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8860A] flex-shrink-0" />
                <h2
                  className="text-black text-xs font-bold tracking-[0.25em] uppercase"
                >
                  {section.category}
                </h2>
              </div>
              <div className="border-t border-[#3D2B0A]/60 pt-1">
                {section.items.map((item) => (
                  <AccordionItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

     
    </main>
  );
}