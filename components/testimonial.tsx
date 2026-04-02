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
];

function getRelativeOffset(index: number, activeIndex: number) {
  const total = testimonials.length;
  const forwardDistance = (index - activeIndex + total) % total;
  if (forwardDistance === 0) return 0;
  if (forwardDistance <= total / 2) return forwardDistance;
  return forwardDistance - total;
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(1); // Default to center for the demo
  const cardWidth = 405; 
  const gap = 40; 

  return (
    <section className="relative bg-[#E7DCCF] px-4  text-center text-[#1a1a1a]">
      <div className="mx-auto max-w-8xl">
        <p className="text-[13px] font-bold tracking-[0.2em] text-[#df6d2d] uppercase opacity-90">
          TESTIMONIALS
        </p>

        <h2 className="mx-auto mt-4  text-[36px] font-semibold text-[#2b1a0f]">
          What People Say About UGUIDE South Dakota Pheasant Hunting!
        </h2>

        {/* <p className="mt-8 text-[14px] font-medium text-[#2b1a0f]/50">
          Content Will Add
        </p> */}

        {/* Carousel Container */}
        <div className="relative mt-16 flex justify-center items-start h-[600px] overflow-hidden">
          {testimonials.map((testimonial, idx) => {
            const offset = getRelativeOffset(idx, currentIndex);
            const isActive = offset === 0;
            
            // Precise positioning calculation
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
                  zIndex: isActive ? 30 : 10
                }}
                className={`absolute top-0 flex flex-col items-center rounded-[4px] p-8  transition-all duration-500 ease-out cursor-pointer ${
                  isActive
                    ? "bg-[#1c1408] text-white scale-110 shadow-[0_40px_70px_-15px_rgba(0,0,0,0.4)] "
                    : "bg-white text-[#2b1a0f] shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
                }`}
              >
                {/* Quote Icon */}
                <div className="mb-6">
                  <svg width="46" height="34" viewBox="0 0 48 32" fill="none">
                    <path
                      d="M19.16 4.78C17.94 2.88 16.14 1.43 14.03.65C11.92-.13 9.61-.21 7.45.42C5.29 1.06 3.39 2.39 2.05 4.2C0.7 6 0 8.2 0 10.45c0 1.87.5 3.7 1.45 5.31C2.4 17.37 3.77 18.69 5.4 19.59c1.64.9 3.48 1.34 5.35 1.28 1.86-.06 3.68-.62 5.25-1.62-.82 2.43-2.35 5.02-4.86 7.62"
                      fill={isActive ? "#3ba551" : "#e5e5e5"}
                      stroke={isActive ? "#3ba551" : "#e5e5e5"}
                      strokeWidth="1"
                    />
                    <path
                      d="M44.16 4.78c-1.22-1.9-3.02-3.35-5.13-4.13-2.11-.79-4.42-.87-6.58-.23-2.16.64-4.06 1.96-5.4 3.77-1.34 1.81-2.06 4-2.06 6.26 0 1.87.5 3.7 1.45 5.31 1.4 2.35 2.77 3.67 4.4 4.57"
                      fill={isActive ? "#3ba551" : "#e5e5e5"}
                      stroke={isActive ? "#3ba551" : "#e5e5e5"}
                      strokeWidth="1"
                    />
                  </svg>
                </div>

                {/* Rating Stars */}
                <div className="mb-6 flex gap-1 text-[#f3a825] text-lg">
                  {"★".repeat(testimonial.rating)}
                </div>

                {/* Headline */}
                <h3 className="mb-6 text-[21px] font-semibold">
                  {testimonial.headline}
                </h3>

                {/* Body Text */}
                <p className={`mb-10 text-[14.5px] leading-[1.7] font-normal ${isActive ? "text-white/70" : "text-[#2b1a0f]/60"}`}>
                  {testimonial.text}
                </p>

                {/* Footer Section */}
                <div className="mt-auto flex flex-col items-center">
                  <p className="text-[17px] font-bold tracking-tight">{testimonial.name}</p>
                  <p className={`mt-1 text-[12px] font-medium opacity-60`}>
                    {testimonial.role}
                  </p>
                  {/* Profile Placeholder */}
                  <div className={`mt-4 h-[46px] w-[46px] rounded-full ${isActive ? 'bg-[#c4c4c4]' : 'bg-[#c4c4c4]'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}