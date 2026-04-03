// app/resources/waterfowl-hunting/page.tsx
"use client";

import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import OurPartners from "@/components/ourPartners";
import LatestNews from "@/components/NewsEvent";
import Image from "next/image";
import Link from "next/link";

export default function WaterfowlHuntingPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        {/* Banner Section */}
        <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-[#E7DCCF] px-4 pb-12 pt-24 sm:min-h-[320px] sm:px-6 sm:pb-14 sm:pt-28 md:min-h-[360px]">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#241304] mb-4">
              South Dakota Waterfowl Hunting
            </h1>
            <nav className="text-sm text-[#281703]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#E4803A]">Home</Link>
              <span className="mx-2">›</span>
              <Link href="/resources" className="hover:text-[#E4803A]">Resources</Link>
              <span className="mx-2">›</span>
              <span>Waterfowl Hunting</span>
            </nav>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">

        <div className="space-y-4 text-[#31261d] text-lg">
          <p>
            UGUIDE South Dakota offers combination pheasant and waterfowl hunts with no additional charge for waterfowl at select camps.
          </p>

          <p>
            The Prairie Coteau Region of South Dakota is home to some of the finest duck and goose populations in North America. Approximately 1/3 of North America’s duck and goose nesting occurs in this region.
          </p>

          <p>
            Popular species include Mallard, Teal, Widgeon, Shoveler, Pintail, Gadwall, Scaup, Canvasback, Ringbill, Bufflehead, Redhead, Wood Duck, Canadian Honkers, and Snow Goose.
          </p>

          <p>
            The best waterfowl hunting typically occurs during the first five weeks of the pheasant season before freeze-up. UGUIDE camps east of the Missouri River provide excellent waterfowl opportunities with minimal gear required.
          </p>

          <p>
            For license info, see <a href="https://gfp.sd.gov/nonresident-waterfowl/" className="text-[#E4803A] underline">South Dakota Non-Resident Waterfowl License</a>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {[
            { src: "/images/waterfowl-1.jpg", alt: "Duck Hunting" },
            { src: "/images/waterfowl-2.jpg", alt: "Goose Hunting" },
            { src: "/images/waterfowl-3.jpg", alt: "Waterfowl Camp" },
          ].map((img, idx) => (
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