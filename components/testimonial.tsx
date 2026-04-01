/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect } from "react";

// Testimonial data for cleaner mapping
const testimonials = [
  {
    id: 1,
    name: "Mike Johnson",
    role: "Annual Hunter",
    text: "Our group of 8 hunters had an incredible time at Faulkton Pheasant Camp. The birds were plentiful and the accommodations were top-notch. UGUIDE made everything so easy to coordinate.",
    rating: 5,
    highlight: false,
    bgClass: "bg-[#F5F5F5] text-black",
    quoteColor: "#CFD3D2",
  },
  {
    id: 2,
    name: "Sarah & David Martinez",
    role: "Returning Customers",
    text: "We've been coming to UGUIDE for 5 years now. The camps are always clean, well-maintained, and the hunting grounds are some of the best in South Dakota. Chris and his team make every detail perfect.",
    rating: 5,
    highlight: true,
    bgClass: "bg-[#281703] text-white",
    quoteColor: "#389844",
  },
  {
    id: 3,
    name: "Robert Chen",
    role: "Corporate Event Organizer",
    text: "We brought 12 employees for a team-building pheasant hunt. The logistics were handled flawlessly, the food was excellent, and everyone had a great time. Highly recommend for groups!",
    rating: 5,
    highlight: false,
    bgClass: "bg-gray-200 text-black",
    quoteColor: "#CFD3D2",
  },
];

function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto‑play: increment index every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Function to go to a specific slide (used for dot indicators)
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="bg-[#e9dfd4] py-20 px-6 text-center relative">
      {/* Top Label */}
      <p className="text-orange-500 tracking-[4px] text-sm font-semibold">
        TESTIMONIALS
      </p>

      {/* Heading */}
      <h2 className="text-4xl font-semibold mt-3 text-[#2b1a0f]">
        What People Say About UGUIDE South Dakota Pheasant Hunting!
      </h2>

      <p className="mt-3 text-gray-600">
        Real experiences from our satisfied hunters
      </p>

      {/* Carousel Container */}
      <div className="relative max-w-4xl mx-auto mt-12 overflow-hidden">
        {/* Sliding wrapper */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="w-full flex-shrink-0 flex justify-center px-4"
            >
              {/* Card Content */}
              <div
                className={`${testimonial.bgClass} w-full max-w-sm p-8 rounded-md text-center shadow-lg ${
                  testimonial.highlight ? "md:scale-105" : ""
                } transition-all`}
              >
                {/* Quote Icon */}
                <div className="text-4xl text-center flex justify-center items-center mb-3">
                  <svg
                    width="48"
                    height="32"
                    viewBox="0 0 48 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.1626 4.78346C17.9452 2.88751 16.1452 1.43792 14.0333 0.652575C11.9215 -0.132772 9.61172 -0.211452 7.45129 0.428363C5.29085 1.06818 3.39644 2.39192 2.05279 4.20063C0.709135 6.00934 -0.0111724 8.2053 0.000131028 10.4585C0.00125169 12.3243 0.503409 14.1556 1.45414 15.7611C2.40488 17.3665 3.7693 18.6872 5.40487 19.5851C7.04044 20.483 8.88713 20.9253 10.752 20.8656C12.6169 20.806 14.4316 20.2466 16.0064 19.246C15.1876 21.6772 13.6626 24.271 11.1501 26.871C10.6694 27.3682 10.406 28.0361 10.4177 28.7277C10.4235 29.0701 10.4967 29.408 10.6331 29.7221C10.7695 30.0363 10.9664 30.3204 11.2126 30.5585C11.4589 30.7965 11.7496 30.9837 12.0681 31.1094C12.3867 31.235 12.7269 31.2967 13.0693 31.2909C13.7609 31.2792 14.4194 30.9932 14.9001 30.496C24.1876 20.871 22.9814 10.4085 19.1626 4.79596V4.78346ZM44.1626 4.78346C42.9452 2.88751 41.1452 1.43792 39.0333 0.652575C36.9215 -0.132772 34.6117 -0.211452 32.4513 0.428363C30.2908 1.06818 28.3964 2.39192 27.0528 4.20063C25.7091 6.00934 24.9888 8.2053 25.0001 10.4585C25.0012 12.3243 25.5034 14.1556 26.4541 15.7611C27.4049 17.3665 28.7693 18.6872 30.4049 19.5851C32.0404 20.483 33.8871 20.9253 35.752 20.8656C37.6169 20.806 39.4315 20.2466 41.0064 19.246C40.1876 21.6772 38.6626 24.271 36.1501 26.871C35.9121 27.1172 35.7249 27.4079 35.5992 27.7265C35.4736 28.045 35.4119 28.3852 35.4177 28.7277C35.4235 29.0701 35.4967 29.408 35.6331 29.7221C35.7695 30.0363 35.9664 30.3204 36.2126 30.5585C36.4589 30.7965 36.7496 30.9837 37.0681 31.1094C37.3867 31.235 37.7269 31.2967 38.0693 31.2909C38.4117 31.2851 38.7497 31.2119 39.0638 31.0755C39.3779 30.9391 39.6621 30.7422 39.9001 30.496C49.1876 20.871 47.9814 10.4085 44.1626 4.79596V4.78346Z"
                      fill={testimonial.quoteColor}
                    />
                  </svg>
                </div>

                {/* Rating Stars */}
                <div className="text-yellow-400 text-2xl mb-3">
                  {"★".repeat(testimonial.rating)}
                </div>

                <p className="font-semibold">
                  {testimonial.id === 1 &&
                    '"Best pheasant hunting experience we\'ve ever had!"'}
                  {testimonial.id === 2 &&
                    '"Outstanding organization and beautiful camps"'}
                  {testimonial.id === 3 &&
                    '"Perfect for our corporate group outing"'}
                </p>

                <p className="text-sm mt-4">{testimonial.text}</p>

                <p className="mt-5 font-semibold">{testimonial.name}</p>
                <p className="text-xs">{testimonial.role}</p>

                <div
                  className={`w-12 h-12 rounded-full mx-auto mt-4 ${
                    testimonial.highlight ? "bg-gray-300" : "bg-[#BDBDBD]"
                  }`}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots Indicator (optional, but improves UX) */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? "bg-orange-500 w-6"
                  : "bg-gray-400 hover:bg-gray-500"
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;