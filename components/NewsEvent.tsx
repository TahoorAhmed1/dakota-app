"use client";

import Image from "next/image";

import partner1 from "@/assets/catalogue6.png";
import partner2 from "@/assets/catalogue5.png";
import partner3 from "@/assets/catalogue4.png";

const posts = [
  {
    id: 1,
    image: partner1,
    date: "December 30, 2025",
    author: "UGUIDE South Dakota",
    title: "UGUIDE 2026 Food Plot System - Pheasant Hunting",
    desc: "I claim to have the most optimized pheasant habitat in North America...Here’s Why:",
  },
  {
    id: 2,
    image: partner2,
    date: "December 21, 2025",
    author: "UGUIDE South Dakota",
    title: "2025 Pheasant Season End Conclusions - Final Report",
    desc: "Here’s the wrap-up summary from the 2025 UGUIDE South Dakota pheasant hunting season.",
  },
  {
    id: 3,
    image: partner3,
    date: "December 07, 2025",
    author: "UGUIDE South Dakota",
    title: "2025 UGUIDE Week 8 Crop & Pheasant Harvest by Camp",
    desc: "Pheasant and Crop Harvest Results for 2025 UGUIDE Pheasant Camp South Dakota Hunting.",
  },
];

export default function LatestNews() {
  return (
    <section className="w-full bg-[#E7DCCF] py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-xs tracking-[3px] text-orange-500 uppercase mb-3">
          Updates
        </p>

        <h2 className="text-3xl md:text-4xl font-semibold text-[#2b2b2b]">
          Latest News & Events
        </h2>

        <p className="text-sm text-[#4b4b4b] mt-3 max-w-2xl mx-auto">
          UGUIDE South Dakota Pheasant Hunting is South Dakotas leader in
          wild-reared self guided and unguided pheasant hunting.
        </p>
        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-10 mt-14 text-left">
          {posts.map((post) => (
            <div key={post.id} className="group">
              {/* Image */}
              <div className="overflow-hidden rounded-sm">
                <Image
                  src={post.image}
                  alt={post.title}
                  className="w-full h-[210px] object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              {/* Meta */}
              <p className="text-xs text-gray-600 mt-4">
                {post.date} by {post.author}
              </p>

              {/* Title */}
              <h3 className="text-lg font-semibold text-[#2b2b2b] mt-2 leading-snug">
                {post.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                {post.desc}
              </p>

              {/* Read More */}
              <button className="mt-4 text-orange-500 text-sm font-medium hover:underline">
                Read More »
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
