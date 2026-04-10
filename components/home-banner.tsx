"use client"
import { useEffect, useState } from "react";
import pic from "@/assets/col.png";
import Image from "next/image";
import Link from "next/link";
type SiteSettings = Record<string, unknown>;
function HomeBanner() {
      const [settings, setSettings] = useState<SiteSettings>({});

  useEffect(() => {
    fetch("/api/site-settings")
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .catch(() => {});
  }, []);

  const hero = (settings.hero as { motto?: string; videoUrl?: string; ctaPrimary?: string; ctaSecondary?: string }) ?? {};
  const motto = hero.motto || "The Ultimate Pheasant Hunt";
  const videoUrl = hero.videoUrl || "https://www.youtube.com/embed/VIDEO_ID";
  const ctaPrimary = hero.ctaPrimary || "Make Individual Payments";
  const ctaSecondary = hero.ctaSecondary || "Book Your Hunt Online";

  return (
    <div className="HomeImage relative bg-cover bg-center py-10 sm:py-8">
        <div className="mx-auto flex w-full max-w-285 flex-col items-center gap-6 px-4 py-24 sm:gap-8 sm:py-36 md:py-44 lg:py-52">
          {/* Logo — enlarged for prominence */}
          <Image
            src={pic}
            alt="UGUIDE logo"
            className="w-[92%] max-w-155 sm:w-[80%] sm:max-w-185 lg:w-[70%] lg:max-w-220"
            priority
          />

          {/* Motto */}
          <p className="text-center text-lg font-semibold tracking-[0.22em] text-white/90 uppercase drop-shadow sm:text-2xl md:text-3xl lg:text-4xl">
            {motto}
          </p>

          <div className="flex w-full flex-col items-center gap-4 py-4 sm:py-6 md:w-auto md:flex-row md:gap-6 lg:gap-10">
            <button className="w-full rounded-md border-2 border-white px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-white hover:text-[#2b1a0f] md:w-auto">
              {ctaPrimary}
            </button>
            <Link
              href="/quote-reserve"
              className="w-full rounded-md border-2 border-orange-400 bg-orange-500 px-8 py-4 text-center text-base font-semibold text-white transition-colors hover:bg-orange-400 md:w-auto"
            >
              {ctaSecondary}
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/70 animate-bounce">
          <span className="text-[11px] tracking-widest uppercase">Scroll</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
  )
}

export default HomeBanner