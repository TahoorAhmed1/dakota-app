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
    src: rate3,
    alt: "Close-up of a pheasant being carried after a successful hunt",
    className: "md:col-start-3 md:row-span-2 aspect-[0.46/1] md:h-full",
    sizes: "(max-width: 767px) 100vw, (max-width: 1279px) 35vw, 18vw",
  },
  {
    src: rate4,
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

export default function RatesPage() {
  return (
    <main className="flex flex-col  text-[#281703]">
      <section className="relative isolate overflow-hidden">
        <div className="RatesImage absolute inset-0 bg-cover bg-center" />
        <div className="absolute inset-0 " />
        <div className="absolute inset-0 " />

        <div className="relative mx-auto flex min-h-[360px] max-w-[1600px] items-center justify-center px-5 pb-24 pt-24 text-center sm:min-h-[430px] sm:px-8 sm:pb-28 md:min-h-[510px] md:pt-28 lg:min-h-[560px] lg:px-10 lg:pb-32">
          <div className="translate-y-6 sm:translate-y-8 md:translate-y-10">
            <h1 className="text-[38px] font-bold uppercase leading-none tracking-[-0.04em] text-[#1f1308] sm:text-[54px] md:text-[68px] lg:text-[74px]">
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
      </section>
      <section className="bg-[#e8ded1] px-4 pb-14 pt-5 sm:px-6 md:px-8 md:pb-16 md:pt-8 lg:px-10 lg:pb-20 lg:pt-10">
        <div className="mx-auto max-w-[1320px]">
          <div className="text-center">
            <h2 className="text-[26px] font-black leading-[1.05] tracking-[-0.04em] text-[#2a1808] sm:text-[34px] md:text-[46px] lg:text-[60px]">
              Pheasant Hunting Rates &amp; Booking Info
            </h2>
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

            <div className="flex flex-col gap-1.5 text-left md:items-end md:text-right">
              {rateLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[13px] font-semibold leading-[1.35] text-[#df8142] transition-colors duration-200 hover:text-[#8e4a1f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#df8142] focus-visible:ring-offset-2 focus-visible:ring-offset-[#e6dbcf] sm:text-[14px] md:text-[15px] lg:text-[16px]"
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <OurPartners />
      <LatestNews />
    </main>
  );
}
