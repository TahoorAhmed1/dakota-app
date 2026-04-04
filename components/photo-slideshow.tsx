"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

export type SlidePhoto = {
  src: string;
  alt: string;
  caption?: string;
};

// Default photo library — replace / add paths as you add images to /public/photos/
export const UGUIDE_PHOTOS: SlidePhoto[] = [
  { src: "/gallery-1.jpg", alt: "Hunters in the field during UGUIDE pheasant hunt", caption: "South Dakota Pheasant Hunting" },
  { src: "/gallery-2.jpg", alt: "Pheasant camp lodging exterior", caption: "UGUIDE Pheasant Camp Lodging" },
  { src: "/gallery-3.jpg", alt: "Upland bird dogs working the field", caption: "Hunting Dogs at Their Best" },
  { src: "/gallery-4.jpg", alt: "Group of hunters with day's harvest", caption: "A Successful Hunt" },
  { src: "/gallery-5.jpg", alt: "Prairie landscape at sunrise for pheasant hunting", caption: "South Dakota Prairie" },
  { src: "/gallery-6.jpg", alt: "Hunter walking through tall grass with dog", caption: "Fair Chase Pheasant Hunting" },
  { src: "/camping-experience.jpg", alt: "UGUIDE camp experience", caption: "The Ultimate Pheasant Hunt" },
  { src: "/hero-availability.jpg", alt: "Availability and scheduling at UGUIDE", caption: "Plan Your Hunt" },
  { src: "/hero-camps.jpg", alt: "UGUIDE camp overview", caption: "World-Class Camp Facilities" },
  { src: "/discount-1.jpg", alt: "Early bird pheasant hunting", caption: "Early Bird Discount Season" },
  { src: "/discount-2.jpg", alt: "Group pheasant hunting", caption: "Group Hunting Packages" },
  { src: "/discount-3.jpg", alt: "Seasonal pheasant hunt", caption: "2026 Season Availability" },
  { src: "/discount-4.jpg", alt: "Pheasant hunting South Dakota landscape", caption: "Wide Open South Dakota Prairie" },
  { src: "/news-1.jpg", alt: "UGUIDE pheasant news", caption: "Latest From The Field" },
  { src: "/news-2.jpg", alt: "UGUIDE hunting update", caption: "2026 Season Preview" },
  { src: "/news-3.jpg", alt: "UGUIDE camp photo", caption: "Life at Camp" },
];

type Props = {
  photos?: SlidePhoto[];
  autoPlayMs?: number;
  aspectRatio?: string;
};

export default function PhotoSlideshow({
  photos = UGUIDE_PHOTOS,
  autoPlayMs = 5000,
  aspectRatio = "aspect-[16/9]",
}: Props) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent((index + photos.length) % photos.length);
        setIsTransitioning(false);
      }, 300);
    },
    [isTransitioning, photos.length]
  );

  const prev = () => go(current - 1);
  const next = useCallback(() => go(current + 1), [current, go]);

  useEffect(() => {
    if (isHovered) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    timerRef.current = setTimeout(next, autoPlayMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, isHovered, autoPlayMs, next]);

  const photo = photos[current];

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main image */}
      <div className={`relative w-full ${aspectRatio}`}>
        <Image
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 90vw, 1200px"
          className={`object-cover transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
          priority={current === 0}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        {/* Caption */}
        {photo.caption && (
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/90 sm:text-sm">
              {photo.caption}
            </p>
          </div>
        )}

        {/* Prev / Next arrows */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous photo"
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/70 sm:left-5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next photo"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/70 sm:right-5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Progress bar */}
        {!isHovered && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
            <div
              key={`${current}-progress`}
              className="h-full bg-orange-400"
              style={{
                animation: `slideProgress ${autoPlayMs}ms linear forwards`,
              }}
            />
          </div>
        )}
      </div>

      {/* Dot navigation */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
        {photos.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => go(idx)}
            aria-label={`Go to photo ${idx + 1}`}
            className={`rounded-full transition-all duration-300 ${
              idx === current
                ? "h-2.5 w-7 bg-orange-500"
                : "h-2.5 w-2.5 bg-[#281703]/25 hover:bg-[#281703]/50"
            }`}
          />
        ))}
      </div>

      <style>{`
        @keyframes slideProgress {
          from { width: 0% }
          to { width: 100% }
        }
      `}</style>
    </div>
  );
}
