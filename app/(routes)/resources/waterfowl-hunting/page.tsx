// app/resources/waterfowl-hunting/page.tsx
"use client";

import Header from "@/components/common/header";
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
              South Dakota Waterfowl Hunting Outfitter
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
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">

        <div className="space-y-4 text-[#31261d] text-lg">
          <p>
            UGUIDE South Dakota offers combination pheasant and waterfowl hunts with no additional charge for waterfowl at select camps.
          </p>

          <p>
            The Prairie Coteau Region of South Dakota is home to some of the finest duck and goose populations in North America. Approximately 1/3 of North America’s duck and goose nesting occurs in this region.
          </p>

          <p>
The Prairie Pothole Region is the core of what was once the largest expanse of grassland in the world, the Great Plains of North America. Its name comes from a geological phenomenon that left its mark beginning 10,000 years ago. When the glaciers from the last ice age receded, they left behind millions of shallow depressions that are now wetlands, known as prairie potholes. The potholes are rich in plant and aquatic life, and support globally significant populations of breeding waterfowl.          </p>

          <p>
South Dakota is one of the most important duck production areas in North America. Although it is considered a Central Flyway state, South Dakota produces ducks that migrate continent-wide. The portion of South Dakota west of the Missouri River is considered "unglaciated," so the relatively few wetlands in this area consist mostly of impoundments used to water livestock. Nonetheless, duck recruitment in this landscape is high. The glaciated, eastern part of the state contains some of the highest wetland densities and breeding duck populations in North America.          </p>

          <p>
This MAP from USFW shows the areas where duck nesting pairs per square mile is highest and you will be able to see why our camps make great combo hunts for waterfowl and pheasants.

          </p>
          <p>
            These are just a few of the species common to the area where are pheasant camps are: Mallard, Teal, Widgeon, Shoveler, Pintail, Gadwall, Scaup, Canvasback, Ringbill, Bufflehead, Redhead, Wood Duck, Canadian Honkers and Snow Goose to name a few.
          </p>
          <p>
            The best waterfowl hunting typically occurs the first 5 weeks of the pheasant season before freeze-up.
          </p>
          <p>
            All info about South Dakota Non-Resident Waterfowl License Applications Via Game & Fish Here
          </p>
          <p>
            The licensing process has become more complex with more options available to hunters. The best thing to do if interested in acquiring a waterfowl tag is to contact the South Dakota Game, Fish and Parks Customer Service number at 605.223.7660 and have them educate you on your options for the area you plan to hunt.
          </p>
          <p>
            Any of our camps located east of the Missouri River have good waterfowling options. All you need is a pair of waders, a few dekes, maybe a spinning wing decoy and some steel shot and you will be all set.
          </p>
          <p>
            The first week of pheasant season the hunting for pheasants doesn't start until noon and after that it starts at 10:00 am so a morning duck shoot works out perfectly if you are looking to fit in a little extra action.
          </p>
          <p>
            Search Availability of UGUIDE South Dakota Combo Pheasant Duck Goose Hunting Camps Here
          </p>
          <p>
            More Pictures Here at the South Dakota Waterfowl Hunting Gallery
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
    </>
  );
}