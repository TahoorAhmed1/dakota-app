"use client";
import React, { useEffect, useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Robert Chen",
    role: "Corporate Event Organizer",
    headline: '"Perfect for our corporate group outing"',
    text: "We brought 12 employees for a team-building pheasant hunt. The logistics were handled flawlessly, the food was excellent, and everyone had a great time. Highly recommend for groups!",
    rating: 5,
  },
  {
    id: 2,
    name: "Mike Johnson",
    role: "Annual Hunter",
    headline: '"Best pheasant hunting experience we\'ve ever had!"',
    text: "Our group of 8 hunters had an incredible time at Faulkton Pheasant Camp. The birds were plentiful and the accommodations were top-notch. UGUIDE made everything so easy to coordinate.",
    rating: 5,
  },
  {
    id: 3,
    name: "Sarah & David Martinez",
    role: "Returning Customers",
    headline: '"Outstanding organization and beautiful camps"',
    text: "We've been coming to UGUIDE for 5 years now. The camps are always clean, well-maintained, and the hunting grounds are some of the best in South Dakota. Chris and his team make every detail perfect.",
    rating: 5,
  },
  {
    id: 4,
    name: "Sarah & David Martinez",
    role: "Returning Customers",
    headline: '"Outstanding organization and beautiful camps"',
    text: "We've been coming to UGUIDE for 5 years now. The camps are always clean, well-maintained, and the hunting grounds are some of the best in South Dakota. Chris and his team make every detail perfect.",
    rating: 5,
  },
];

function getRelativeOffset(index: number, activeIndex: number) {
  const total = testimonials.length;
  const forwardDistance = (index - activeIndex + total) % total;
  if (forwardDistance === 0) return 0;
  if (forwardDistance <= total / 2) return forwardDistance;
  return forwardDistance - total;
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(1);

  const prev = () =>
    setCurrentIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrentIndex((i) => (i + 1) % testimonials.length);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => window.clearTimeout(timeout);
  }, [currentIndex]);

  return (
    <section className="relative bg-[#E7DCCF] px-4 py-16 text-center text-[#1a1a1a] sm:px-6 sm:py-20">
      <p className="text-xs font-bold tracking-widest text-[#df6d2d] uppercase">
        TESTIMONIALS
      </p>

      <h2 className="mx-auto mt-3 text-3xl font-bold text-[#2b1a0f] sm:text-4xl mb-5">
        What People Say About UGUIDE South Dakota Pheasant Hunting!
      </h2>
      <div className="mx-auto max-w-8xl">
        <div className="mt-10 flex justify-center lg:hidden">
          <div className="w-full max-w-md rounded-sm bg-[#1c1408] px-6 py-8 text-white shadow-[0_24px_50px_-20px_rgba(0,0,0,0.45)] sm:px-8">
            <div className="mb-5 flex justify-center">
              <svg width="46" height="34" viewBox="0 0 48 32" fill="none">
                <path
                  d="M19.16 4.78C17.94 2.88 16.14 1.43 14.03.65C11.92-.13 9.61-.21 7.45.42C5.29 1.06 3.39 2.39 2.05 4.2C0.7 6 0 8.2 0 10.45c0 1.87.5 3.7 1.45 5.31C2.4 17.37 3.77 18.69 5.4 19.59c1.64.9 3.48 1.34 5.35 1.28 1.86-.06 3.68-.62 5.25-1.62-.82 2.43-2.35 5.02-4.86 7.62"
                  fill="#3ba551"
                  stroke="#3ba551"
                  strokeWidth="1"
                />
                <path
                  d="M44.16 4.78c-1.22-1.9-3.02-3.35-5.13-4.13-2.11-.79-4.42-.87-6.58-.23-2.16.64-4.06 1.96-5.4 3.77-1.34 1.81-2.06 4-2.06 6.26 0 1.87.5 3.7 1.45 5.31 1.4 2.35 2.77 3.67 4.4 4.57"
                  fill="#3ba551"
                  stroke="#3ba551"
                  strokeWidth="1"
                />
              </svg>
            </div>
            <div className="mb-5 flex justify-center gap-1 text-lg text-[#f3a825]">
              {"★".repeat(testimonials[currentIndex].rating)}
            </div>
            <h3 className="mb-5 text-[20px] font-semibold">
              {testimonials[currentIndex].headline}
            </h3>
            <p className="mb-8 text-[14px] leading-[1.7] text-white/70">
              {testimonials[currentIndex].text}
            </p>
            <div className="flex flex-col items-center">
              <p className="text-[17px] font-bold tracking-tight">
                {testimonials[currentIndex].name}
              </p>
              <p className="mt-1 text-[12px] font-medium opacity-60">
                {testimonials[currentIndex].role}
              </p>
              <div className="mt-4 h-11.5 w-11.5 rounded-full bg-[#c4c4c4]" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex  items-center justify-center gap-4 lg:hidden">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1c1408]/30 text-[#1c1408] transition hover:bg-[#1c1408] hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex gap-2 ">
            {testimonials.map((testimonial, idx) => (
              <button
                key={testimonial.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all ${idx === currentIndex ? "w-7 bg-[#1c1408]" : "w-2.5 bg-[#1c1408]/25"}`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1c1408]/30 text-[#1c1408] transition hover:bg-[#1c1408] hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Desktop arrows */}

        <div className="relative mt-10 hidden h-135 overflow-hidden lg:flex lg:items-start lg:justify-center">
          {testimonials.map((testimonial, idx) => {
            const offset = getRelativeOffset(idx, currentIndex);
            const isActive = offset === 0;
            const cardWidth = 420;
            const gap = 30;
            let translateX = "0px";
            if (offset === -1) translateX = `-${cardWidth + gap}px`;
            if (offset === 1) translateX = `${cardWidth + gap}px`;

            return (
              <div
                key={testimonial.id}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  transform: `translateX(${translateX})`,
                  width: `${cardWidth}px`,
                  zIndex: isActive ? 30 : 10,
                }}
                className={`absolute top-0 flex flex-col items-center rounded-sm p-8 transition-all duration-500 ease-out cursor-pointer ${
                  isActive
                    ? "bg-[#1c1408] text-white scale-110  "
                    : "bg-white text-[#2b1a0f] "
                }`}
              >
                <div className="mb-4">
                  {isActive ? (
                    <svg
                      width="48"
                      height="32"
                      viewBox="0 0 48 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.1626 4.78346C17.9452 2.88751 16.1452 1.43792 14.0333 0.652575C11.9215 -0.132772 9.61172 -0.211452 7.45129 0.428363C5.29085 1.06818 3.39644 2.39192 2.05279 4.20063C0.709135 6.00934 -0.0111724 8.2053 0.000131028 10.4585C0.00125169 12.3243 0.503409 14.1556 1.45414 15.761C2.40488 17.3665 3.7693 18.6872 5.40487 19.5851C7.04044 20.483 8.88713 20.9253 10.752 20.8656C12.6169 20.806 14.4315 20.2466 16.0064 19.246C15.1876 21.6772 10.4177 28.7277 10.4177 28.7277C9.93697 29.2249 10.406 28.0361 10.4177 28.7277C10.4235 29.0701 10.4967 29.408 10.6331 29.7221C10.7695 30.0363 10.9664 30.3204 11.2126 30.5585C11.4589 30.7965 11.7496 30.9837 12.0681 31.1093C12.3867 31.235 12.7269 31.2967 13.0693 31.2909C13.7609 31.2792 14.4194 30.9932 14.9001 30.496C24.1876 20.871 22.9814 10.4085 19.1626 4.79596V4.78346ZM44.1626 4.78346C42.9452 2.88751 41.1452 1.43792 39.0333 0.652575C36.9215 -0.132772 34.6117 -0.211452 32.4513 0.428363C30.2908 1.06818 28.3964 2.39192 27.0528 4.20063C25.7091 6.00934 24.9888 8.2053 25.0001 10.4585C25.0013 12.3243 25.5034 14.1556 26.4541 15.761C27.4049 17.3665 28.7693 18.6872 30.4049 19.5851C32.0404 20.483 33.8871 20.9253 35.752 20.8656C37.6169 20.806 39.4315 20.2466 41.0064 19.246C40.1876 21.6772 38.6626 24.271 36.1501 26.871C35.9121 27.1172 35.7249 27.4079 35.5992 27.7265C35.4736 28.045 35.4119 28.3852 35.4177 28.7277C35.4235 29.0701 35.4967 29.408 35.6331 29.7221C35.7695 30.0363 35.9664 30.3204 36.2126 30.5585C36.4589 30.7965 36.7496 30.9837 37.0681 31.1093C37.3867 31.235 37.7269 31.2967 38.0693 31.2909C38.4117 31.2851 38.7497 31.2119 39.0638 31.0755C39.3779 30.9391 39.6621 30.7422 39.9001 30.496C49.1876 20.871 47.9814 10.4085 44.1626 4.79596V4.78346Z"
                        fill="#389844"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="48"
                      height="32"
                      viewBox="0 0 48 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.1626 4.78346C17.9452 2.88751 16.1452 1.43792 14.0333 0.652575C11.9215 -0.132772 9.61172 -0.211452 7.45129 0.428363C5.29085 1.06818 3.39644 2.39192 2.05279 4.20063C0.709135 6.00934 -0.0111724 8.2053 0.000131028 10.4585C0.00125169 12.3243 0.503409 14.1556 1.45414 15.7611C2.40488 17.3665 3.7693 18.6872 5.40487 19.5851C7.04044 20.483 8.88713 20.9253 10.752 20.8656C12.6169 20.806 14.4316 20.2466 16.0064 19.246C15.1876 21.6772 13.6626 24.271 11.1501 26.871C10.6694 27.3682 10.406 28.0361 10.4177 28.7277C10.4235 29.0701 10.4967 29.408 10.6331 29.7221C10.7695 30.0363 10.9664 30.3204 11.2126 30.5585C11.4589 30.7965 11.7496 30.9837 12.0681 31.1094C12.3867 31.235 12.7269 31.2967 13.0693 31.2909C13.7609 31.2792 14.4194 30.9932 14.9001 30.496C24.1876 20.871 22.9814 10.4085 19.1626 4.79596V4.78346ZM44.1626 4.78346C42.9452 2.88751 41.1452 1.43792 39.0333 0.652575C36.9215 -0.132772 34.6117 -0.211452 32.4513 0.428363C30.2908 1.06818 28.3964 2.39192 27.0528 4.20063C25.7091 6.00934 24.9888 8.2053 25.0001 10.4585C25.0012 12.3243 25.5034 14.1556 26.4541 15.7611C27.4049 17.3665 28.7693 18.6872 30.4049 19.5851C32.0404 20.483 33.8871 20.9253 35.752 20.8656C37.6169 20.806 39.4315 20.2466 41.0064 19.246C40.1876 21.6772 38.6626 24.271 36.1501 26.871C35.9121 27.1172 35.7249 27.4079 35.5992 27.7265C35.4736 28.045 35.4119 28.3852 35.4177 28.7277C35.4235 29.0701 35.4967 29.408 35.6331 29.7221C35.7695 30.0363 35.9664 30.3204 36.2126 30.5585C36.4589 30.7965 36.7496 30.9837 37.0681 31.1094C37.3867 31.235 37.7269 31.2967 38.0693 31.2909C38.4117 31.2851 38.7497 31.2119 39.0638 31.0755C39.3779 30.9391 39.6621 30.7422 39.9001 30.496C49.1876 20.871 47.9814 10.4085 44.1626 4.79596V4.78346Z"
                        fill="#CFD3D2"
                      />
                    </svg>
                  )}
                </div>

                <div className="mb-4 flex gap-1 text-[#f3a825] text-lg">
                  {"★".repeat(testimonial.rating)}
                </div>

                <h3 className="mb-4 text-[21px] font-semibold">
                  {testimonial.headline}
                </h3>

                <p
                  className={`mb-5 text-[14.5px] leading-[1.7] font-normal ${isActive ? "text-white/70" : "text-[#2b1a0f]/60"}`}
                >
                  {testimonial.text}
                </p>

                <div className="mt-auto flex flex-col items-center">
                  <p className="text-[17px] font-bold tracking-tight">
                    {testimonial.name}
                  </p>
                  <p className={`mt-1 text-[12px] font-medium opacity-60`}>
                    {testimonial.role}
                  </p>
                  <div className="mt-4 h-11.5 w-11.5 rounded-full bg-[#c4c4c4]" />
                </div>
              </div>
            );
          })}
        </div>
        <div className=" hidden justify-center gap-4 lg:flex">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#1c1408]/30 text-[#1c1408] transition hover:bg-[#1c1408] hover:text-white"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#1c1408]/30 text-[#1c1408] transition hover:bg-[#1c1408] hover:text-white"
          >
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
