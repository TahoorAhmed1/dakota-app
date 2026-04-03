// app/resources/uguide-outfitter/page.tsx
"use client";

import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import OurPartners from "@/components/ourPartners";
import LatestNews from "@/components/NewsEvent";
import Image from "next/image";
import Link from "next/link";

export default function UguideOutfitterPage() {
  const galleryImages = [
    { src: "/images/waterfowl-278.jpg", alt: "Awe...Isn't he cute?" },
    { src: "/images/waterfowl-277.jpg", alt: "Good Boy!!!!" },
    { src: "/images/waterfowl-276.jpg", alt: "One for Me....One for the dog....." },
    { src: "/images/waterfowl-275.jpg", alt: "Get Down!" },
    { src: "/images/waterfowl-274.jpg", alt: "Limit Anyone?" },
    { src: "/images/waterfowl-273.jpg", alt: "The Big Dogs" },
    { src: "/images/waterfowl-272.jpg", alt: "Mornin Sunshine!" },
    { src: "/images/waterfowl-271.jpg", alt: "Beauty Day on the Slough" },
    { src: "/images/waterfowl-270.jpg", alt: "Man and his duck dog" },
    { src: "/images/waterfowl-269.jpg", alt: "Waders Only Please" },
  ];

  return (
    <>
      <Header />
      <main className="flex flex-col">
        {/* Banner Section */}
        <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-[#E7DCCF] px-4 pb-12 pt-24 sm:min-h-[320px] sm:px-6 sm:pb-14 sm:pt-28 md:min-h-[360px]">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#241304] mb-4">UGUIDE Outfitter</h1>
            <nav className="text-sm text-[#281703]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#E4803A]">Home</Link>
              <span className="mx-2">›</span>
              <Link href="/resources" className="hover:text-[#E4803A]">Resources</Link>
              <span className="mx-2">›</span>
              <span>UGUIDE Outfitter</span>
            </nav>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">
          <div className="space-y-4 text-[#31261d] text-lg">
            <p>
              UGUIDE South Dakota Waterfowl Hunting and outfitter has several camps that would make excellent combo pheasant-duck-goose hunts. We don't charge anything additional to hunt waterfowl in addition to your pheasant hunt.
            </p>
          <p>
            The Prairie Coteau Regions of South Dakota is host to some of the finest waterfowl species, population and hunting in the nation. 1/3 of North America’s duck and goose nesting occurs in this region.
          </p>
          <p>
            The <a href="http://www.ducks.org/conservation/prairie-pothole-region" className="text-[#E4803A] underline">Prairie Pothole Region</a> is the core of what was once the largest expanse of grassland in the world, the Great Plains of North America. Its wetlands support globally significant populations of breeding waterfowl.
          </p>
          <p>
            South Dakota produces ducks that migrate continent-wide. The glaciated eastern part of the state contains some of the highest wetland densities and breeding duck populations in North America.
          </p>
          <p>
            Check licensing info for waterfowl at <a href="https://gfp.sd.gov/nonresident-waterfowl/" className="text-[#E4803A] underline">South Dakota Non-Resident Waterfowl License</a>.
          </p>
          <p>
            Contact South Dakota Game, Fish and Parks Customer Service at <strong>605.223.7660</strong> for guidance on your waterfowl tag options.
          </p>
          <p>
            East of the Missouri River, camps provide excellent waterfowling options. A pair of waders, a few dekes, a spinning wing decoy, and steel shot is all you need.
          </p>
          <p>
            The first week of pheasant season is perfect for morning duck shoots. Check availability of UGUIDE combo hunts <Link href="/availability" className="text-[#E4803A] underline">here</Link>.
          </p>
          <p>
            See more pictures in our <Link href="/resources/photos" className="text-[#E4803A] underline">Waterfowl Hunting Photo Gallery</Link>.
          </p>
          </div>

          {/* Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {galleryImages.map((img, idx) => (
              <div key={idx} className="overflow-hidden rounded-lg shadow-md">
                <Image src={img.src} alt={img.alt} width={400} height={300} className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
        </section>
      </main>

      <OurPartners />
      <LatestNews />
      <Footer />
    </>
  );
}