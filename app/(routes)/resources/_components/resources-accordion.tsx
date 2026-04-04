"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type ResourceChild = {
  label: string;
  href: string;
};

type ResourceSection = {
  label: string;
  href?: string;
  children?: ResourceChild[];
};

const resourceSections: ResourceSection[] = [
  {
    label: "About UGUIDE",
    href: "/about",
    children: [
      { label: "Who we are", href: "/about" },
      { label: "What is included", href: "/about" },
    ],
  },
  {
    label: "UGUIDE Outfitter",
    href: "/about",
    children: [
      { label: "Guided options", href: "/about" },
      { label: "Trip planning", href: "/quote-reserve" },
    ],
  },
  {
    label: "Photos",
    href: "/resources/photos",
    children: [
      { label: "Camp photos", href: "/camps" },
      { label: "Hunt photos", href: "/resources/photos" },
    ],
  },
  {
    label: "Dogs",
    href: "/resources/dogs",
    children: [
      { label: "Dog tips", href: "/resources/dogs" },
      { label: "Field prep", href: "/resources/dogs" },
    ],
  },
  {
    label: "Wild Game Recipes",
    href: "/resources/recipes",
    children: [
      { label: "Pheasant recipes", href: "/resources/recipes" },
      { label: "Waterfowl recipes", href: "/resources/recipes" },
    ],
  },
  {
    label: "Romans 1:20",
    href: "/resources/romans-1-20",
  },
  {
    label: "Articles",
    href: "/resources/articles",
    children: [
      { label: "Hunting articles", href: "/resources/articles" },
      { label: "Travel articles", href: "/resources/articles" },
    ],
  },
  {
    label: "Videos",
    href: "/resources/videos",
    children: [
      { label: "Camp videos", href: "/resources/videos" },
      { label: "Field videos", href: "/resources/videos" },
    ],
  },
  {
    label: "Pheasant Outlook",
    href: "/resources/pheasant-outlook",
  },
  {
    label: "License Info",
    href: "/resources/license-info",
  },
  {
    label: "FAQ",
    href: "/resources/faq",
    children: [
      { label: "Travel questions", href: "/resources/faq" },
      { label: "Booking questions", href: "/resources/faq" },
    ],
  },
  {
    label: "Testimonials",
    href: "/resources/testimonials",
  },
  {
    label: "Waterfowl Hunting",
    href: "/resources/waterfowl-hunting",
    children: [
      { label: "Waterfowl overview", href: "/resources/waterfowl-hunting" },
      { label: "Trip details", href: "/quote-reserve" },
    ],
  },
];

const collageImages = {
  topLeft: "/images/resources-top-left.jpg",
  topRight: "/images/resources-top-right.jpg",
  bottomLeft: "/images/resources-bottom-left.jpg",
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`mt-0.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ResourceAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: ResourceSection;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const hasChildren = Boolean(item.children?.length);

  return (
    <li className="border-b border-transparent last:border-b-0">
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={hasChildren ? onToggle : undefined}
          aria-expanded={hasChildren ? isOpen : undefined}
          aria-label={hasChildren ? `${isOpen ? "Collapse" : "Expand"} ${item.label}` : item.label}
          className={`mt-0.5 flex shrink-0 items-center justify-center text-[#6f5c49] ${hasChildren ? "cursor-pointer" : "cursor-default"}`}
        >
          <ChevronIcon open={isOpen} />
        </button>

        <div className="min-w-0 flex-1">
          {item.href ? (
            <Link
              href={item.href}
              className="inline-block text-[15px] font-semibold leading-[1.45] text-[#E4803A] underline decoration-[#E4803A] decoration-[1.2px] underline-offset-[3px] transition-colors hover:text-[#281703] hover:decoration-[#281703]"
            >
              {item.label}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onToggle}
              className="inline-block text-left text-[15px] font-semibold leading-[1.45] text-[#E4803A] underline decoration-[#E4803A] decoration-[1.2px] underline-offset-[3px] transition-colors hover:text-[#281703] hover:decoration-[#281703]"
            >
              {item.label}
            </button>
          )}

          {hasChildren ? (
            <div
              className={`grid overflow-hidden transition-[grid-template-rows,margin-top,opacity] duration-300 ${isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <ul className="space-y-2 pl-1">
                  {item.children?.map((child) => (
                    <li key={child.label}>
                      <Link
                        href={child.href}
                        className="text-[13px] font-medium leading-5 text-[#5f4e40] transition-colors hover:text-[#E4803A]"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}

function ResourcesCollage() {
  return (
    <div className="mx-auto w-full max-w-105 md:mx-0 lg:max-w-113.75">
      <div className="grid grid-cols-[0.9fr_1fr] grid-rows-[165px_145px] gap-4 sm:grid-rows-[185px_165px] lg:grid-rows-[190px_176px]">
        <div className="relative overflow-hidden rounded-[34px] sm:rounded-[38px]">
          <Image
            src={collageImages.topLeft}
            alt="UGUIDE hunters seated with a dog"
            fill
            sizes="(max-width: 768px) 45vw, 220px"
            className="object-cover"
            priority
          />
        </div>

        <div className="relative row-span-2 overflow-hidden rounded-[34px] sm:rounded-[38px]">
          <Image
            src={collageImages.topRight}
            alt="UGUIDE hunter holding a shotgun"
            fill
            sizes="(max-width: 768px) 52vw, 260px"
            className="object-cover"
            priority
          />
        </div>

        <div className="relative overflow-hidden rounded-[34px] sm:rounded-[38px]">
          <Image
            src={collageImages.bottomLeft}
            alt="UGUIDE hunters in a snowy field"
            fill
            sizes="(max-width: 768px) 45vw, 220px"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default function ResourcesAccordionSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-[#E7DCCF] px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
      <div className="mx-auto max-w-280">
        <div className="mx-auto max-w-220 text-center">
          <h2 className="text-[32px] font-bold leading-[1.08] tracking-[-0.02em] text-[#281703] sm:text-[42px] lg:text-[58px]">
            UGUIDE South Dakota Pheasant Hunting Specials
          </h2>

          <p className="mx-auto mt-4 max-w-190 text-[14px] font-semibold leading-normal text-[#2f2b27] sm:text-[15px]">
            Click on specific links to get more info about the special or related camp. Remember to go to{" "}
            <Link
              href="/availability"
              className="text-[#E4803A] underline decoration-[#E4803A] underline-offset-2 transition-colors hover:text-[#281703] hover:decoration-[#281703]"
            >
              Availability
            </Link>{" "}
            page to check current rates and openings.
          </p>
        </div>

        <div className="mt-12 grid items-start gap-10 md:mt-14 md:grid-cols-[minmax(0,1fr)_360px] md:gap-10 lg:grid-cols-[minmax(0,1fr)_455px] lg:gap-14">
          <div className="mx-auto w-full max-w-97.5 md:mx-0 md:pt-2">
            <ul className="space-y-3 sm:space-y-3.25">
              {resourceSections.map((item, index) => (
                <ResourceAccordionItem
                  key={item.label}
                  item={item}
                  isOpen={openIndex === index}
                  onToggle={() => setOpenIndex((current) => (current === index ? null : index))}
                />
              ))}
            </ul>
          </div>

          <div className="md:justify-self-end">
            <ResourcesCollage />
          </div>
        </div>
      </div>
    </section>
  );
}
