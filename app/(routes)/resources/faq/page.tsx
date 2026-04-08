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
            <h1 className="text-3xl sm:text-4xl font-bold text-[#241304] mb-4">
              Frequently Asked Questions
            </h1>
            <nav className="text-sm text-[#281703]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#E4803A]">
                Home
              </Link>
              <span className="mx-2">›</span>
              <Link href="/resources" className="hover:text-[#E4803A]">
                Resources
              </Link>
              <span className="mx-2">›</span>
              <span>FAQ</span>
            </nav>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
          <div className="space-y-6 text-[#31261d]">
            <h2 className="text-2xl font-semibold">
              What is included with the UGUIDE package?{" "}
            </h2>
            <p>
              The basic package includes 4-nights lodging, 3-days hunting,
              self-guided with landowner tour of property and maps. Lodging has
              full kitchen so you can cook your own meals. See the South Dakota
              Pheasant Hunting Rates page for more details and specifics.
            </p>

            <h2 className="text-2xl font-semibold">
              We don't want to hunt pen raised birds. Are UGUIDE hunts all
              authentic native wild?
            </h2>
            <p>
              Yes. UGUIDE properties are not preserves nor do they release any
              birds. Some owners may release hens in the spring to bolster
              nesting but that is rare and most landowners invest in habitat vs.
              releasing hens in the spring to gain nesting success. All rooster
              pheasants are native wild ringneck pheasants at UGUIDE pheasant
              hunting camps.
            </p>

            <h2 className="text-2xl font-semibold">
              What is the 4-Tier Pricing system all about?
            </h2>
            <p>More info about UGUIDE 4-Tier pricing here</p>

            <h2 className="text-2xl font-semibold">
              What are lodging accommodation's like?
            </h2>
            <p>
              Basic UGUIDE lodging accommodation's include: at least 1 full size
              bathroom with shower, TV with satellite service, full kitchen so
              you can cook all meals on site if needed, individual beds per
              lodging capacity, dining and reclining chairs per lodging
              capacity, a place to clean and freeze birds, and a place to get
              dogs out of weather/elements. Lodging buildings are either: a
              renovated pole shed, trailer house, or farmhouse. Most lodging is
              onsite but some maybe a few miles from the hunting property. See
              the South Dakota Pheasant Hunts page for more details on each
              pheasant camp
            </p>

            <h2 className="text-2xl font-semibold">
              What does a license cost, what are limits and when can you hunt?
            </h2>
            <p>
              A non-resident small adult game license costs $121.00 (+ $25
              Habitat Stamp) and youth age 12-15 with hunter safety costs $10.
              Hunters age 16-17 are not required to have hunter safety and
              license is $10. You can buy them online. This includes 2 - 5/day
              hunting periods. Daily bag limit is 3 roosters with 15 in
              possession if you hunt all 5 days on license. If you only hunt 3
              days possession would be 9 roosters. Hunting is from noon to
              sunset the first week and then 10am to sunset thereafter. Season
              generally runs from 3rd weekend in Oct. thru the last weekend in
              January. Some camps have huntable sharp-tail populations and these
              you can hunt from sunrise to sunset and daily limit is 3 birds
              with 15 in possession. See our South Dakota Pheasant Hunting
              License page for more details. More information on SD GF&P site on
              Non-Resident License Costs.
            </p>
            <h2 className="text-2xl font-semibold">
              We are interested in getting our kids involved in South Dakota
              Pheasant Hunting. How do we get more information?
            </h2>
            <p>
              Please see the South Dakota Game, Fish & Parks page which has more
              detailed information about Youth, Mentored and Apprentice Hunts.
            </p>

            <h2 className="text-2xl font-semibold">
              We are interested in South Dakota Waterfowl Hunting. How do we get
              more information?
            </h2>
            <p>
              Please see the UGUIDE page which has more detailed information
              about South Dakota Waterfowl Hunting at no extra charge at one of
              our UGUIDE Pheasant Camps.
            </p>
            <h2 className="text-2xl font-semibold">
              I see your late season hunts are cheaper. Is that because hunting
              is poorer? Is hunting any good later on in season?
            </h2>
            <p>
              The rates are generally cheaper each week that the season
              progresses because demand generally goes down each week, not
              because the quality of hunting declines. It is possible to have
              better hunting the last week of season rather than the season
              opener in some cases. Generally speaking the challenges of going
              early in the season are: warm weather which affects dogs and
              hunters, a lot of unharvested row crops in fields making it
              difficult to access populations of birds, birds plummage can be
              molted yet making roosters difficult to identify, and just a lot
              of standing cover in general. During late season (Thanksgiving or
              later) these are not issues any longer. The harvest is generally
              complete across state concentrating birds in remaining cover.
              Temperatures are cooler and more ideal for working dogs. Birds
              will generally be wilder due to previous hunting pressure. The
              birds plummage is generally complete and birds are fully colored.
              You do run the risk of experiencing inclement weather the later in
              season you go.
            </p>
            <h2 className="text-2xl font-semibold">
              What is the smallest group size you will take?
            </h2>
            <p>
              Group size minimums are either 6, 8, 10 or 13 depending on the
              pheasant camp and week you choose. See Availability page for
              details on minimums and rates. Generally, for a typical UGUIDE
              property the minimum group size is 6. The reasons for the minimum
              are that UGUIDE blocks out a week of time on the calendar when you
              book a hunt. For that week we only let only one group on that
              property that week and we only let them hunt for 3 days out of 7
              so we rest it for 4 prior to the groups arrival. For these reasons
              we need to generate a certain fee for that week and that is where
              the minimums come in.
            </p>
            <h2 className="text-2xl font-semibold">
              Can you come with less than minimum group size and just pay the
              minimum rate?
            </h2>
            <p>
              Yes. If you have 3 hunters you can come with 3 and just split the
              rate for 4 between the 3.
            </p>
            <h2 className="text-2xl font-semibold">
              Are there discounts for larger groups?
            </h2>
            <p>
              Yes. When you have 6 hunters or more in a group you are eligible
              for UGUIDE discounts. See more info on those discounts on the
              rates or specials pages. Groups of 4-5 are eligible for 1 FREE
              youth and 1 Jr. at 50% off. See the South Dakota Pheasant Hunting
              Rates page for more details and specifics.
            </p>
            <h2 className="text-2xl font-semibold">
              What if we don't have any dogs?
            </h2>
            <p>
              If you don't have dogs your experience could be impacted
              dramatically. We encourage you to seek fellow hunters with ample
              dog resources or seek a guided hunting outfitter that provides the
              dogs needed.
            </p>
            <h2 className="text-2xl font-semibold">
              Where are these Pheasant Camp's located in the state of South
              Dakota?
            </h2>
            <p>
              Click here to view MAP and then you can click on each location to
              bring you to details about that Pheasant Camp.
            </p>
          </div>
        </section>
      </main>
      <OurPartners />
      <LatestNews />
      {/* <Footer /> */}
    </>
  );
}
