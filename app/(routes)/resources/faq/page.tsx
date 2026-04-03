// app/resources/faq/page.tsx
"use client";

import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import OurPartners from "@/components/ourPartners";
import LatestNews from "@/components/NewsEvent";
import Link from "next/link";

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        {/* Banner Section */}
        <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-[#E7DCCF] px-4 pb-12 pt-24 sm:min-h-[320px] sm:px-6 sm:pb-14 sm:pt-28 md:min-h-[360px]">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#241304] mb-4">Frequently Asked Questions</h1>
            <nav className="text-sm text-[#281703]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#E4803A]">Home</Link>
              <span className="mx-2">›</span>
              <Link href="/resources" className="hover:text-[#E4803A]">Resources</Link>
              <span className="mx-2">›</span>
              <span>FAQ</span>
            </nav>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">

        <div className="space-y-6 text-[#31261d]">
          <h2 className="text-2xl font-semibold">Package Details</h2>
          <p>What’s included with a UGUIDE package, lodging, meals, and birds. All hunts are fair-chase wild pheasants.</p>

          <h2 className="text-2xl font-semibold">Licensing & Bag Limits</h2>
          <p>Information about non-resident licenses, bag limits, and season dates.</p>

          <h2 className="text-2xl font-semibold">Group Sizes & Discounts</h2>
          <p>Policies on group booking, youth hunters, and discounted rates for larger groups.</p>

          <h2 className="text-2xl font-semibold">Dogs</h2>
          <p>Guidance on bringing or training dogs for your hunt. UGUIDE supports dog handlers and puppy selection tips.</p>

          <h2 className="text-2xl font-semibold">Travel & Safety</h2>
          <p>Tips on travel, lodging, and field safety while hunting at UGUIDE properties.</p>
        </div>
        </section>
      </main>
      <OurPartners />
      <LatestNews />
      <Footer />
    </>
  );
}