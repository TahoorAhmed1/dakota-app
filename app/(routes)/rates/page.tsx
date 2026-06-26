import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type Package = {
  id: string;
  nights: number;
  days: number;
  label: string;
  priceRange: string;
  badge?: string;
  highlights: string[];
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const packages: Package[] = [
  {
    id: "3-day",
    nights: 4,
    days: 3,
    label: "Classic Hunt",
    priceRange: "$999 – $1,749",
    highlights: [
      "4 nights lodging",
      "3 full hunting days",
      "All private exclusive land",
      "Fully equipped lodge",
      "Bird cleaning amenities",
    ],
  },
  {
    id: "4-day",
    nights: 5,
    days: 4,
    label: "Extended Hunt",
    priceRange: "$1,500 – $2,300",
    badge: "Most Popular",
    highlights: [
      "5 nights lodging",
      "4 full hunting days",
      "All private exclusive land",
      "Fully equipped lodge",
      "Bird cleaning amenities",
    ],
  },
];

const included: string[] = [
  "Landowner tour of property upon arrival",
  "Maps provided for all hunting areas",
  "Fully equipped lodge with kitchen",
  "Bird cleaning amenities on-site",
  "All private-exclusive hunting land for your days",
  "All camp resources private & exclusive to your group",
];

const policies: { label: string; detail: string }[] = [
  { label: "Check-In", detail: "3 PM arrival before first hunting day" },
  { label: "Check-Out", detail: "10 AM day after last hunting day" },
  { label: "Deposit", detail: "25% of minimum group size to book" },
  { label: "Tax", detail: "South Dakota sales tax applies" },
  {
    label: "Daily Limit",
    detail: "3 rooster pheasants / day · possession limit 15",
  },
  {
    label: "Season",
    detail:
      "3rd Saturday of October through mid-December (UGUIDE week 9)",
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className="h-4 w-4 shrink-0 text-[#d26f2f]"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4.5 8.25 7 10.75l4.5-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PackageCard({ pkg }: { pkg: Package }) {
  const isFeatured = !!pkg.badge;
  return (
    <div
      className={`relative flex flex-col rounded-sm border ${
        isFeatured
          ? "border-[#d26f2f] bg-[#1f1308]"
          : "border-[#3d2810] bg-[#281703]"
      } p-8 transition-shadow duration-300 hover:shadow-[0_8px_40px_rgba(210,111,47,0.18)]`}
    >
      {pkg.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#d26f2f] px-4 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
          {pkg.badge}
        </span>
      )}

      {/* Nights / Days pill */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex flex-col items-center justify-center rounded-sm bg-[#d26f2f]/15 px-4 py-3 text-[#d26f2f]">
          <span className="text-3xl font-bold leading-none">{pkg.nights}</span>
          <span className="mt-0.5 text-[10px] font-bold uppercase tracking-widest opacity-80">
            Nights
          </span>
        </div>
        <span className="text-[#7a5535]">+</span>
        <div className="flex flex-col items-center justify-center rounded-sm bg-[#d26f2f]/15 px-4 py-3 text-[#d26f2f]">
          <span className="text-3xl font-bold leading-none">{pkg.days}</span>
          <span className="mt-0.5 text-[10px] font-bold uppercase tracking-widest opacity-80">
            Hunt Days
          </span>
        </div>
      </div>

      <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[#c89b6a]">
        {pkg.label}
      </h3>

      <p className="mt-1 text-3xl font-bold text-white">
        {pkg.priceRange}
        <span className="ml-1 text-sm font-normal text-[#7a5535]">
          / person
        </span>
      </p>
      <p className="mt-1 text-xs text-[#7a5535]">Before discounts apply</p>

      <ul className="mt-6 space-y-2.5 border-t border-[#3d2810] pt-6">
        {pkg.highlights.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-[#c89b6a]">
            <CheckIcon />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/quote-reserve"
          className="block rounded-sm bg-[#d26f2f] py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#b85e26]"
        >
          Book This Package
        </Link>
        <Link
          href="/availability"
          className="block rounded-sm border border-[#3d2810] py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-[#c89b6a] transition-colors hover:border-[#d26f2f] hover:text-[#d26f2f]"
        >
          Check Availability
        </Link>
      </div>
    </div>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────

export default function PackagesSection() {
  return (
    <div className="py-24">
      

      {/* ── Section Header ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-5 pb-0 pt-20 sm:px-8 lg:px-10">
     
        <h2 className="mt-3 text-center text-4xl font-bold uppercase leading-none tracking-[-0.03em] text-white sm:text-5xl">
          Packages &amp; Pricing
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-[#7a5535]">
          Packages have minimum group sizes, but the{" "}
          <strong className="text-[#c89b6a]">"Have It All to Myself"</strong>{" "}
          option is available — simply pay the minimum group fee and bring any
          number of hunters.{" "}
          <Link
            href="/about"
            className="text-[#d26f2f] underline underline-offset-2 hover:text-[#e8864a]"
          >
            Details
          </Link>
          .
        </p>
      </section>

      {/* ── Package Cards ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:mx-auto lg:max-w-3xl">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-[#7a5535]">
          Rates vary by week and camp. View the full{" "}
          <Link
            href="/availability"
            className="text-[#d26f2f] underline underline-offset-2 hover:text-[#e8864a]"
          >
            season schedule &amp; availability calendar
          </Link>{" "}
          for exact pricing.
        </p>
      </section>

      {/* ── What's Included ──────────────────────────────────────────── */}
      <section className="border-t border-[#3d2810] bg-[#1f1308]">
        <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 lg:px-10">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            {/* Included */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#d26f2f]">
                Every Package
              </p>
              <h3 className="mt-2 text-2xl font-bold uppercase tracking-[-0.02em] text-white">
                What&apos;s Included
              </h3>
              <ul className="mt-6 space-y-3">
                {included.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-snug text-[#c89b6a]"
                  >
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Add-ons + Wait-list */}
            <div className="flex flex-col gap-8">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#d26f2f]">
                  Customize Your Trip
                </p>
                <h3 className="mt-2 text-2xl font-bold uppercase tracking-[-0.02em] text-white">
                  Package Add-Ons
                </h3>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start gap-3 text-sm leading-snug text-[#c89b6a]">
                    <CheckIcon />
                    Extra nights lodging available at{" "}
                    <strong className="text-white">$105 / night / person</strong>
                  </li>
                  <li className="flex items-start gap-3 text-sm leading-snug text-[#c89b6a]">
                    <CheckIcon />
                    Non-hunters billed at lodging rate only
                  </li>
                </ul>
              </div>

              {/* Wait-list */}
              <div className="rounded-sm border border-[#3d2810] bg-[#281703] p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#d26f2f]">
                  Plan Ahead
                </p>
                <h4 className="mt-2 text-lg font-bold uppercase tracking-[-0.02em] text-white">
                  UGUIDE Wait-List
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-[#7a5535]">
                  Secure your spot for next season with a 25% deposit. You
                  choose your preferred week and camp — we hold it for you.
                </p>
                <Link
                  href="/quote-reserve"
                  className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.18em] text-[#d26f2f] underline underline-offset-2 hover:text-[#e8864a]"
                >
                  Join the Wait-List →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Policies / Quick Facts ───────────────────────────────────── */}
      <section className="border-t border-[#3d2810]">
        <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 lg:px-10">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-[#d26f2f]">
            Good to Know
          </p>
          <h3 className="mt-2 text-center text-2xl font-bold uppercase tracking-[-0.02em] text-white">
            Hunt Policies
          </h3>
          <dl className="mt-10 grid gap-px border border-[#3d2810] sm:grid-cols-2 lg:grid-cols-3">
            {policies.map(({ label, detail }) => (
              <div
                key={label}
                className="border border-[#3d2810] bg-[#1f1308] px-6 py-5"
              >
                <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d26f2f]">
                  {label}
                </dt>
                <dd className="mt-1.5 text-sm leading-snug text-[#c89b6a]">
                  {detail}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-center text-xs text-[#7a5535]">
            Full policies at{" "}
            <Link
              href="/resources"
              className="text-[#d26f2f] underline underline-offset-2 hover:text-[#e8864a]"
            >
              UGUIDE Hunting Policies
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ── CTA Box ──────────────────────────────────────────────────── */}
      <section className="border-t border-[#3d2810] bg-[#d26f2f]">
        <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 lg:px-10">
          <div className="flex flex-col items-center text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
              Ready to Hunt?
            </p>
            <h3 className="mt-3 text-3xl font-bold uppercase leading-none tracking-[-0.03em] text-white sm:text-4xl">
              Reserve Your Pheasant Hunt
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80">
              25% deposit holds your camp and dates. Questions before you book?
              Our team is happy to walk you through options, group size
              minimums, and current availability.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/quote-reserve"
                className="rounded-sm bg-white px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-[#1f1308] transition-colors hover:bg-white/90"
              >
                Book Online
              </Link>
              <Link
                href="/contact"
                className="rounded-sm border-2 border-white px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
            <p className="mt-5 text-xs text-white/60">
              Or call us directly to discuss your group&apos;s needs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}