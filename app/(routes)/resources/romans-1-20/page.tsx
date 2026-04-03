// app/resources/romans-1-20/page.tsx
"use client";

import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import OurPartners from "@/components/ourPartners";
import LatestNews from "@/components/NewsEvent";
import Link from "next/link";

export default function Romans120Page() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        {/* Banner Section */}
        <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-[#E7DCCF] px-4 pb-12 pt-24 sm:min-h-[320px] sm:px-6 sm:pb-14 sm:pt-28 md:min-h-[360px]">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#241304] mb-4">Romans 1:20</h1>
            <nav className="text-sm text-[#281703]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#E4803A]">Home</Link>
              <span className="mx-2">›</span>
              <Link href="/resources" className="hover:text-[#E4803A]">Resources</Link>
              <span className="mx-2">›</span>
              <span>Romans 1:20</span>
            </nav>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">
          <div className="prose max-w-none text-[#31261d]">
          <h3><em>For since the creation of the world God's invisible qualities — his eternal power and divine nature — have been clearly seen, being understood from what has been made, so that men are without excuse.</em></h3>
          <p>At UGUIDE, we believe that being in nature is one of the best ways to experience the real living presence of God by enjoying His natural creation.</p>
          <p>
            To get a taste of divine nature at a <Link href="/availability" className="text-[#E4803A] underline">UGUIDE South Dakota Pheasant Hunt</Link>, check availability of our packages here.
          </p>
        </div>
        </section>
      </main>
      <OurPartners />
      <LatestNews />
      <Footer />
    </>
  );
}