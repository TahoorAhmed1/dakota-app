// app/resources/photos/page.tsx
"use client";

import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import OurPartners from "@/components/ourPartners";
import LatestNews from "@/components/NewsEvent";
import Link from "next/link";

export default function PhotosPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        {/* Banner Section */}
        <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-[#E7DCCF] px-4 pb-12 pt-24 sm:min-h-[320px] sm:px-6 sm:pb-14 sm:pt-28 md:min-h-[360px]">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#241304] mb-4">
              UGUIDE South Dakota Pheasant Hunting Photo Gallery
            </h1>
            <nav className="text-sm text-[#281703]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#E4803A]">Home</Link>
              <span className="mx-2">›</span>
              <Link href="/resources" className="hover:text-[#E4803A]">Resources</Link>
              <span className="mx-2">›</span>
              <span>Photos</span>
            </nav>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">

        <p className="text-[#31261d] italic mb-6">We currently have 1139 photos in our photo galleries.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { title: "Unguided", href: "/resources/photos/unguided" },
            { title: "Self Guided", href: "/resources/photos/self-guided" },
            { title: "Prescribed Burns", href: "/resources/photos/prescribed-burns" },
            { title: "Hatch!", href: "/resources/photos/hatch" },
            { title: "UGUIDE Food Cover Plots", href: "/resources/photos/food-cover-plots" },
            { title: "Conservation Farming 2018", href: "/resources/photos/conservation-farming-2018" },
            { title: "Gunner's Haven", href: "/resources/photos/gunners-haven" },
            { title: "Pheasant Hunting", href: "/resources/photos/pheasant-hunting" },
            { title: "Covers", href: "/resources/photos/covers" },
            { title: "Waterfowl Hunting", href: "/resources/photos/waterfowl" },
            { title: "Pheasant Camp Lodge", href: "/resources/photos/pheasant-camp-lodge" },
          ].map((gallery) => (
            <div key={gallery.title} className="p-4 border rounded shadow-sm hover:shadow-md">
              <h2 className="font-semibold text-lg mb-2">{gallery.title}</h2>
              <Link href={gallery.href} className="text-[#E4803A] underline">View Gallery</Link>
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