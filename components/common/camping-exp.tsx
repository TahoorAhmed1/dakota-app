"use client";

import campingImage from "@/assets/camping.png";
import Image from "next/image";
import Link from "next/link";

function CampingExp() {
  return (
    <div className="relative mx-auto h-[360px] w-full max-w-262.5 overflow-hidden rounded-2xl sm:h-[420px] lg:h-75">
      <Image
        src={campingImage}
        alt="Camping"
        fill
        priority
        className="rounded-2xl object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,10,6,0.72)_0%,rgba(15,10,6,0.28)_55%,rgba(15,10,6,0.08)_100%)]" />
      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-5 text-white sm:px-8 lg:flex-row lg:items-center lg:px-10">
          <div className="max-w-[620px]">
            <p className="mb-2 text-xs tracking-[0.35em] text-orange-400 sm:text-sm">
              HUNTING
            </p>

            <h1 className="text-[28px] font-semibold leading-tight sm:text-[34px] md:text-[36px]">
              Your Best{" "}
              <span className="bg-blue-500/30 px-2 rounded">Camping</span>{" "}
              Experience
            </h1>

            <p className="mt-4 max-w-lg text-sm text-gray-200 sm:text-[15px]">
              Your best camping experience starts where comfort meets adventure.
              Unplug, explore the wild, and create memories that last a
              lifetime.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            <Link href="/quote-reserve" className="inline-flex w-full items-center justify-center rounded-md border border-orange-400 px-5 py-3 text-sm text-orange-400 transition hover:bg-orange-400 hover:text-white sm:w-auto sm:px-6 whitespace-nowrap">
              Book Your Hunt Online →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampingExp;
