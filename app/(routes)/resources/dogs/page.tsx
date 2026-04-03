// app/resources/dogs/page.tsx
"use client";

import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import OurPartners from "@/components/ourPartners";
import LatestNews from "@/components/NewsEvent";
import Link from "next/link";

export default function DogsPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        {/* Banner Section */}
        <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-[#E7DCCF] px-4 pb-12 pt-24 sm:min-h-[320px] sm:px-6 sm:pb-14 sm:pt-28 md:min-h-[360px]">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#241304] mb-4">Gun Dog Tips, Training, Articles and How-to</h1>
            <nav className="text-sm text-[#281703]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#E4803A]">Home</Link>
              <span className="mx-2">›</span>
              <Link href="/resources" className="hover:text-[#E4803A]">Resources</Link>
              <span className="mx-2">›</span>
              <span>Dogs</span>
            </nav>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">

        <ul className="list-disc pl-5 space-y-2 text-[#31261d]">
          <li><Link href="/resources/dogs/finding-a-breeder" className="text-[#E4803A] underline">Finding a Breeder</Link></li>
          <li><Link href="/resources/dogs/pre-season-conditioning" className="text-[#E4803A] underline">Pre-Season Conditioning – Health & More Birds</Link></li>
          <li><Link href="/resources/dogs/retriever-marking" className="text-[#E4803A] underline">Get ready for your U-Guide Hunt, can your dog mark?</Link></li>
          <li><Link href="/resources/dogs/intro-to-bird-and-gun" className="text-[#E4803A] underline">INTRO TO BIRD AND GUN</Link></li>
          <li><Link href="/resources/dogs/hunting-dog-training-tips" className="text-[#E4803A] underline">Hunting Dog Training Tips</Link></li>
          <li><Link href="/resources/dogs/warm-the-water" className="text-[#E4803A] underline">Warm the Water: Hunting Dog Training Tip G1</Link></li>
          <li><Link href="/resources/dogs/puppy-name-selection" className="text-[#E4803A] underline">Your New Puppy - Name Selection</Link></li>
          <li><Link href="/resources/dogs/upland-bird-dog-selection" className="text-[#E4803A] underline">Upland Bird Dog Puppy Selection</Link></li>
          <li><Link href="/resources/dogs/german-shorthair-pointer" className="text-[#E4803A] underline">My Game Player - German Shorthair Pointer</Link></li>
          <li><Link href="/resources/dogs/hunting-puppies" className="text-[#E4803A] underline">Hunting Puppies, Where to Find Them and How Much to Spend</Link></li>
        </ul>
        </section>
      </main>
      <OurPartners />
      <LatestNews />
      <Footer />
    </>
  );
}