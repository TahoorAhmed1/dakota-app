"use client";

import campingImage from "@/assets/camping.png";
import Image from "next/image";
import Link from "next/link";

function CampingExp() {
  return (
    <div className="relative h-75 mx-auto max-w-262.5 w-full overflow-hidden">
      <Image
        src={campingImage}
        alt="Camping"
        fill
        priority
        className="object-cover  rounded-2xl "
      />
      <div className="absolute inset-0 flex items-center">
        <div className="w-full max-w-6xl mx-auto px-6 flex items-center justify-between text-white">
          <div className="pl-8">
            <p className="text-orange-400 tracking-widest text-sm mb-2">
              HUNTING
            </p>

            <h1 className="text-[30px] md:text-[36px] font-semibold leading-tight">
              Your Best{" "}
              <span className="bg-blue-500/30 px-2 rounded">Camping</span>{" "}
              Experience
            </h1>

            <p className="mt-4 max-w-lg text-gray-200 text-sm md:text-[15px]">
              Your best camping experience starts where comfort meets adventure.
              Unplug, explore the wild, and create memories that last a
              lifetime.
            </p>
          </div>

          <div className="pr-8">
            {/* RIGHT BUTTON */}
            <Link href="/quote-reserve" className="inline-block border border-orange-400 text-orange-400 px-6 py-3 rounded-md hover:bg-orange-400 hover:text-white transition whitespace-nowrap">
              Book Your Hunt Online →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampingExp;
