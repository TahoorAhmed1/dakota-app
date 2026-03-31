import type { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";
import LatestNews from "@/components/NewsEvent";
import OurPartners from "@/components/ourPartners";

import rate1 from "@/assets/rate 1.jpg";
import rate2 from "@/assets/rate 2.jpg";
import rate3 from "@/assets/rate 3.jpg";
import rate4 from "@/assets/rate 4.jpg";

type GalleryItem = {
  src: StaticImageData;
  alt: string;
  className: string;
  sizes: string;
  priority?: boolean;
};

type RateLink = {
  label: string;
  href: string;
};

const galleryItems: GalleryItem[] = [
  {
    src: rate1,
    alt: "Hunters standing together outdoors with dogs and pheasants",
    className: "md:col-span-1 md:row-span-1 aspect-[1.22/0.68]",
    sizes: "(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw",
    priority: true,
  },
  {
    src: rate2,
    alt: "Hunter walking through a field carrying pheasants with a dog beside them",
    className: "md:col-span-1 md:row-span-1 aspect-[1.18/0.68]",
    sizes: "(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw",
  },
  {
    src: rate4,
    alt: "Close-up of a pheasant being carried after a successful hunt",
    className: "md:col-start-3 md:row-span-2 aspect-[0.46/1] md:h-full",
    sizes: "(max-width: 767px) 100vw, (max-width: 1279px) 35vw, 18vw",
  },
  {
    src: rate3,
    alt: "Hunters in blaze orange moving through a snowy field with shotguns",
    className: "md:col-span-2 md:row-span-1 aspect-[2.06/0.61]",
    sizes: "(max-width: 767px) 100vw, (max-width: 1279px) 100vw, 66vw",
  },
];

const rateLinks: RateLink[] = [
  { label: "Reserving Next Years Pheasant Hunt", href: "/quote-reserve" },
  { label: "Pheasant Hunting Package Rates and Availability", href: "/rates" },
  { label: "Special Offers, Discounts, Add-Ons and Sales", href: "/discounts" },
  { label: "How To Make a UGUIDE Reservation", href: "/quote-reserve" },
  { label: "Quote or Reserve Your Own Hunt", href: "/quote-reserve" },
  {
    label: "What&apos;s Included in Your Unguided Pheasant Hunting Package",
    href: "/about",
  },
  {
    label: "Self-Guided South Dakota Pheasant Hunting Season Schedule",
    href: "/availability",
  },
  {
    label: "UGUIDE South Dakota Pheasant Hunting Policies",
    href: "/resources",
  },
];

function HomeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[11px] w-[11px] shrink-0"
      fill="currentColor"
    >
      <path d="M12 3.172 3 10.2V21h6v-6h6v6h6V10.2L12 3.172Z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-[9px] w-[9px] shrink-0"
      fill="currentColor"
    >
      <path d="M7.2 4.7a.75.75 0 0 1 1.06 0l4.04 4.04a.75.75 0 0 1 0 1.06L8.26 13.84a.75.75 0 1 1-1.06-1.06L10.7 9.27 7.2 5.77a.75.75 0 0 1 0-1.06Z" />
    </svg>
  );
}

function HeroCurve() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0">
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block h-[68px] w-full md:h-[92px] lg:h-[108px]"
        aria-hidden="true"
      >
        <path
          d="M0,82 C288,55 576,40 720,40 C864,40 1152,55 1440,82 L1440,120 L0,120 Z"
          fill="#e6dbcf"
        />
        <path
          d="M0,82 C288,55 576,40 720,40 C864,40 1152,55 1440,82"
          fill="none"
          stroke="#2a1607"
          strokeWidth="4"
        />
      </svg>
    </div>
  );
}

export default function RatesPage() {
  return (
    <main className="flex flex-col bg-[#e6dbcf] text-[#281703]">
      <section className="relative isolate overflow-hidden">
        <div className="RatesImage absolute inset-0 bg-cover bg-center" />
        <div className="absolute inset-0 bg-[#d49758]/50" />
        <div className="absolute inset-0 bg-black/12" />

        <div className="relative mx-auto flex min-h-[360px] max-w-[1600px] items-center justify-center px-5 pb-24 pt-24 text-center sm:min-h-[430px] sm:px-8 sm:pb-28 md:min-h-[510px] md:pt-28 lg:min-h-[560px] lg:px-10 lg:pb-32">
          <div className="translate-y-6 sm:translate-y-8 md:translate-y-10">
            <h1 className="text-[42px] font-black uppercase leading-none tracking-[-0.04em] text-[#1f1308] sm:text-[54px] md:text-[68px] lg:text-[74px]">
              Rates
            </h1>

            <nav
              aria-label="Breadcrumb"
              className="mt-5 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#24150a] sm:text-[11px]"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-[#d26f2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d26f2f] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                <HomeIcon />
                <span>Home</span>
              </Link>
              <ChevronIcon />
              <span aria-current="page">Rates</span>
            </nav>
          </div>
        </div>

        <HeroCurve />
      </section>

      {/* Main section */}
      <section className="bg-[#E7DCCF] px-6 pb-16 pt-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-[34px] font-bold leading-tight text-[#281703] md:text-[56px]">
            Pheasant Hunting Rates &amp; Booking Info
          </h2>

          <div className="mt-10">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-[#281703] mb-4">4 Nights / 3 Days Package</h3>
                <div className="text-3xl font-bold text-[#F16724] mb-2">$1,749</div>
                <p className="text-sm text-gray-600 mb-4">per person</p>
                <ul className="space-y-2 text-sm">
                  <li>✓ 4 nights lodging</li>
                  <li>✓ 3 full days hunting</li>
                  <li>✓ Access to premium hunting grounds</li>
                  <li>✓ Basic amenities included</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-2 border-[#F16724]">
                <div className="bg-[#F16724] text-white px-3 py-1 rounded text-sm inline-block mb-2">Most Popular</div>
                <h3 className="text-xl font-bold text-[#281703] mb-4">3 Nights / 2 Days Package</h3>
                <div className="text-3xl font-bold text-[#F16724] mb-2">$1,399</div>
                <p className="text-sm text-gray-600 mb-4">per person</p>
                <ul className="space-y-2 text-sm">
                  <li>✓ 3 nights lodging</li>
                  <li>✓ 2 full days hunting</li>
                  <li>✓ Access to premium hunting grounds</li>
                  <li>✓ Basic amenities included</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-[#281703] mb-4">5 Nights / 4 Days Package</h3>
                <div className="text-3xl font-bold text-[#F16724] mb-2">$2,099</div>
                <p className="text-sm text-gray-600 mb-4">per person</p>
                <ul className="space-y-2 text-sm">
                  <li>✓ 5 nights lodging</li>
                  <li>✓ 4 full days hunting</li>
                  <li>✓ Access to premium hunting grounds</li>
                  <li>✓ Extended amenities</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-[#281703] mb-4">What's Included</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Hunting Package Includes:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Access to private hunting grounds</li>
                    <li>• Modern lodging accommodations</li>
                    <li>• Hot showers and basic amenities</li>
                    <li>• Access to clean, well-maintained facilities</li>
                    <li>• Experienced local guidance available</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Additional Services:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Guided hunts (additional cost)</li>
                    <li>• Dog training areas</li>
                    <li>• Equipment rental</li>
                    <li>• Transportation services</li>
                    <li>• Processing and cleaning services</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-[10px] sm:gap-3 md:mt-8 md:grid-cols-[1.06fr_0.96fr_0.36fr] md:grid-rows-[auto_auto] lg:gap-[12px]">
            {galleryItems.map((item) => (
              <div
                key={item.alt}
                className={`relative overflow-hidden bg-[#d8c8b6] ${item.className}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  priority={item.priority}
                  sizes={item.sizes}
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-8 md:mt-5 md:grid-cols-[minmax(0,1fr)_minmax(250px,0.9fr)] lg:items-start lg:gap-10">
            <div className="max-w-[620px]">
              <p className="text-[13px] font-medium leading-[1.36] text-[#1f1a16] sm:text-[14px] md:text-[15px] lg:text-[16px]">
                <span className="font-black text-[#23150b]">
                  Fair Chase Pheasant Hunting Notice:
                </span>{" "}
                These hunts are not for everyone. These hunts are a test of your
                shooting, dog and hunting skills. These are not released pheasants.
                These are some of the wariest pheasants you will find in North
                America. We do not allow groups to hunt without skilled dogs. Your
                overall success and experience will be relative to the number of
                skilled shooters, experienced pheasant hunting dogs and experienced
                pheasant hunters in your group. If you lack the above you may be
                better served to look for a guided hunt at a shooting preserve where
                they release pheasants.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 text-[15px] font-semibold leading-7 text-[#F16724] md:items-end md:text-right">
              <Link href="/availability" className="transition-colors hover:text-[#281703]">
                Pheasant Hunting Package Rates and Availability
              </Link>
              <Link href="/discounts" className="transition-colors hover:text-[#281703]">
                Special Offers, Discounts, Add-Ons and Sales
              </Link>
              <Link href="/quote-reserve" className="transition-colors hover:text-[#281703]">
                Quote or Reserve Your Own Hunt
              </Link>
              <Link href="/about" className="transition-colors hover:text-[#281703]">
                What's Included in Your Unguided Pheasant Hunting Package
              </Link>
              <Link href="/availability" className="transition-colors hover:text-[#281703]">
                Self-Guided South Dakota Pheasant Hunting Season Schedule
              </Link>
              <div className="text-[#281703] font-normal">
                Minimum group size: 6-10 hunters per group
              </div>
              <div className="text-[#281703] font-normal">
                All rates are per person based on double occupancy
              </div>
            </div>
          </div>
        </div>
      </section>

      <OurPartners />
      <LatestNews />
    </main>
  );
}
