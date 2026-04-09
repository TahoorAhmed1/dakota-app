// app/resources/pheasant-outlook/page.tsx
"use client";

import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import OurPartners from "@/components/ourPartners";
import LatestNews from "@/components/NewsEvent";
import Link from "next/link";

export default function PheasantOutlookPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        {/* Banner Section */}
        <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-[#E7DCCF] px-4 pb-12 pt-24 sm:min-h-[320px] sm:px-6 sm:pb-14 sm:pt-28 md:min-h-[360px]">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#241304] mb-4">UGUIDE Pheasant Outlook</h1>
            <nav className="text-sm text-[#281703]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#E4803A]">Home</Link>
              <span className="mx-2">›</span>
              <Link href="/resources" className="hover:text-[#E4803A]">Resources</Link>
              <span className="mx-2">›</span>
              <span>Pheasant Outlook</span>
            </nav>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">

        <p className="mb-6 text-[#31261d]">
          Stay informed on the latest pheasant hunting forecasts, crop reports, and seasonal outlooks.
        </p>

        <ul className="space-y-3 text-[#31261d]">
          <li><Link href="/resources/pheasant-outlook/2026-food-plot-system" className="text-[#E4803A] underline">UGUIDE 2026 Food Plot System</Link></li>
          <li><Link href="/resources/pheasant-outlook/2025-season-end-conclusions" className="text-[#E4803A] underline">2025 Pheasant Season End Conclusions</Link></li>
          <li><Link href="/resources/pheasant-outlook/2025-week-8-crop-harvest" className="text-[#E4803A] underline">2025 Week 8 Crop & Pheasant Harvest</Link></li>
        </ul>
        </section>
      </main>
      <OurPartners />
      <LatestNews />
      <Footer />
    </>
  );
}