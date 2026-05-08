"use client";

import campingImage from "@/assets/camping.png";
import Image from "next/image";
import Link from "next/link";

type CampingExpData = {
  eyebrow?: string;
  titlePrefix?: string;
  titleHighlight?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  imageAlt?: string;
  imageUrl?: string;
};

const DUMMY_DATA: Required<Omit<CampingExpData, "imageUrl">> = {
  eyebrow: "HUNTING",
  titlePrefix: "The Ultimate",
  titleHighlight: "Pheasant Hunt",
  description:
    "Your Ultimate Pheasant Hunting Experience starts where comfort meets adventure. Unplug, explore the wild, and create memories that last a lifetime with your friends and upland bird dogs.",
  primaryCtaLabel: "Book Your Hunt Online →",
  primaryCtaHref: "/quote-reserve",
  secondaryCtaLabel: "Contact",
  secondaryCtaHref: "/contact",
  imageAlt: "Camping",
};

function CampingExp({ data }: { data?: CampingExpData }) {
  const content = {
    ...DUMMY_DATA,
    ...data,
  };

  const imageSrc = data?.imageUrl ?? campingImage;

  return (
    <div className="relative mx-auto h-80 w-full max-w-262.5 overflow-hidden rounded-2xl sm:h-90 lg:h-70">
      <Image
        src={imageSrc}
        alt={content.imageAlt}
        fill
        priority
        className="rounded-2xl object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,10,6,0.72)_0%,rgba(15,10,6,0.28)_55%,rgba(15,10,6,0.08)_100%)]" />
      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-3 px-5 text-white sm:gap-4 sm:px-8 lg:flex-row lg:items-center lg:gap-6 lg:px-10">
          <div className="max-w-155">
            <p className="mb-2 text-xs tracking-[0.35em] text-orange-400 sm:text-sm">
              {content.eyebrow}
            </p>

            <h1 className="text-[28px] font-semibold leading-tight sm:text-[34px] md:text-[36px]">
              {content.titlePrefix}{" "}
              <span className="bg-orange-500/30 px-2 rounded">
                {content.titleHighlight}
              </span>
            </h1>

            <p className="mt-4 max-w-lg text-sm text-gray-200 sm:text-[15px]">
              {content.description}
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-2 lg:w-auto">
            <Link
              href={content.primaryCtaHref}
              className="inline-flex w-full items-center justify-center rounded-md border border-orange-400 px-5 py-3 text-sm text-orange-400 transition hover:bg-orange-400 hover:text-white sm:w-auto sm:px-6 whitespace-nowrap"
            >
              {content.primaryCtaLabel}
            </Link>
            <Link
              href={content.secondaryCtaHref}
              className="inline-flex w-full items-center justify-center rounded-md border border-orange-400 px-5 py-3 text-sm text-orange-400 transition hover:bg-orange-400 hover:text-white sm:w-auto sm:px-6 whitespace-nowrap"
            >
              {content.secondaryCtaLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampingExp;
