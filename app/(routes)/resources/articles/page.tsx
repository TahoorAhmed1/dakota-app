// app/resources/articles/page.tsx
"use client";

import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import OurPartners from "@/components/ourPartners";
import LatestNews from "@/components/NewsEvent";
import Link from "next/link";

export default function ArticlesPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        {/* Banner Section */}
        <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-[#E7DCCF] px-4 pb-12 pt-24 sm:min-h-[320px] sm:px-6 sm:pb-14 sm:pt-28 md:min-h-[360px]">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#241304] mb-4">UGUIDE Articles</h1>
            <nav className="text-sm text-[#281703]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#E4803A]">Home</Link>
              <span className="mx-2">›</span>
              <Link href="/resources" className="hover:text-[#E4803A]">Resources</Link>
              <span className="mx-2">›</span>
              <span>Articles</span>
            </nav>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">

        <ul className="space-y-3 text-[#31261d]">
          <li>
            <Link href="/resources/articles/fee-based-pheasant-hunting-business" className="text-[#E4803A] underline">
              Fee-Based Pheasant Hunting Business
            </Link>
          </li>
          <li>
            <Link href="/resources/articles/hunting-dog-training-tips" className="text-[#E4803A] underline">
              Hunting Dog Training Tips
            </Link>
          </li>
          <li>
            <Link href="/resources/articles/buy-a-south-dakota-pheasant-hunting-license" className="text-[#E4803A] underline">
              Buy a South Dakota Pheasant Hunting License
            </Link>
          </li>
          <li>
            <Link href="/resources/articles/intro-to-bird-and-gun" className="text-[#E4803A] underline">
              Intro to Bird and Gun
            </Link>
          </li>
        </ul>
        </section>
      </main>
      <OurPartners />
      <LatestNews />
      <Footer />
    </>
  );
}