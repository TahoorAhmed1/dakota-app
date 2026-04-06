// app/resources/license-info/page.tsx
"use client";

import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import OurPartners from "@/components/ourPartners";
import LatestNews from "@/components/NewsEvent";
import Link from "next/link";

export default function LicenseInfoPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        {/* Banner Section */}
        <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-[#E7DCCF] px-4 pb-12 pt-24 sm:min-h-[320px] sm:px-6 sm:pb-14 sm:pt-28 md:min-h-[360px]">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#241304] mb-4">
              How to buy a South Dakota Pheasant Hunting License

            </h1>
            <nav className="text-sm text-[#281703]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#E4803A]">Home</Link>
              <span className="mx-2">›</span>
              <Link href="/resources" className="hover:text-[#E4803A]">Resources</Link>
              <span className="mx-2">›</span>
              <span>License Info</span>
            </nav>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">

        <div className="space-y-4  text-[#31261d] text-2xl font-bold">
          <h1>
            For the Non-Resident
          </h1>
        <div className="space-y-4  text-[#31261d] ">

          <p>
            For non-resident waterfowl licenses, visit the South Dakota Game, Fish and Parks website:{" "}
            <Link href="https://gfp.sd.gov/nonresident-waterfowl/" className="text-[#E4803A] underline">
              Non-Resident Waterfowl License Applications
            </Link>.
          </p>

          <p>
            If you need assistance with license selection or application, contact South Dakota Game, Fish and Parks Customer Service at <strong>605.223.7660</strong>.
          </p>

          <p>
            Make sure your license covers all the species you plan to hunt and any combo hunts (pheasant + waterfowl) you are booked for.
          </p>
        </div>
        </div>
        </section>
      </main>
      <OurPartners />
      <LatestNews />
      <Footer />
    </>
  );
}