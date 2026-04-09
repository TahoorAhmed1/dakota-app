// app/resources/license-info/page.tsx
"use client";

import Header from "@/components/common/header";
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
              <Link href="/" className="hover:text-[#E4803A]">
                Home
              </Link>
              <span className="mx-2">›</span>
              <Link href="/resources" className="hover:text-[#E4803A]">
                Resources
              </Link>
              <span className="mx-2">›</span>
              <span>License Info</span>
            </nav>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
          <div className="text-[#31261d] text-2xl">
            <h1 className="font-bold">For the Non-Resident</h1>
            <p className="text-lg pt-2 font-bold">By: Chris Hitzeman</p>
            <p className="text-base">UGUIDE South Dakota Pheasant Hunting</p>
          </div>
          <div className="space-y-4 p-4  text-[#31261d] ">
            <p>
              Depending on your proficiency to utilize technology or your
              predilection for rubbing elbows with native South Dakotans, there
              is a way to buy a non-resident South Dakota Pheasant Hunting
              License that should suit your fancy.
            </p>
           
            <p>
              There are two options for buying a license; order online or
              through a registered sales agent in the state of South Dakota (aka
              the local hardware store, gas station, Cabela's, etc).
            </p>

            <p>
              To order licenses online, go to South Dakota's Game, Fish and
              Parks website at the following link
              <a
                href="http://gfp.sd.gov/licenses/general-hunt-fish/default.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[#ff751f]"
              >
                {" "}
                http://gfp.sd.gov/licenses/general-hunt-fish/default.aspx
              </a>
              . This site provides links you can select based on questions you
              may have. When you are ready to purchase a license, click on the
              "Purchase a General/Hunting/Fishing License" link. You will be
              taken to SDGF&P's online license sales site. You will need a
              driver's license or other state issued ID and major credit card.
              If you are buying a license for a youth, you will need their
              hunter safety ID.
            </p>

            <p>
              The system will ask you questions for all pertinent info. The
              license required for hunting at UGUIDE Camps is the "Non-Resident
              Small Game License". A Shooting Preserve License is for hunting
              places that put birds out. That is not what we do. The most
              confusing part of the process for new licensees is selecting their
              two 5-day hunting periods. When you buy a non-resident pheasant
              hunting license in South Dakota, you can select two 5 day periods
              in which to hunt. The first period will obviously be when you have
              planned your first hunt. Make sure the dates you select allow for
              your hunting days planned in the state to fall within your
              selected time period (5 day duration). My recommendation when
              selecting your second 5 day period (even if you know when it will
              be) is to select the time period the farthest out on the calendar
              that the system will allow. The reason for this is that in South
              Dakota you can never move your 2nd period dates back or out but
              you can always move them up. If you have a 2nd trip booked but run
              into bad weather and your hunt gets postponed, you could then
              adjust your hunting period to meet your new hunting time frame.
            </p>

            <p>
              Another valuable tidbit to consider, especially if you are fond of
              late-season hunting, is to buy your license on Dec. 15th or later.
              This will allow you to use your first hunting period in the year
              the license was purchased and the second period in the following
              year's hunting season.
            </p>

            <p>
              Additionally, South Dakota GF&P now allows you to{" "}
              <a
                href="https://gfp.sd.gov/hunt-fish-license/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[#ff751f]"
              >
                {" "}
                carry your hunting license on your smartphone
              </a>{" "}and here is info on
              how to do that.
            </p>

            <p>
              If you prefer to rub elbows with local natives while in the state
              hunting, you may wish to purchase your license from one of the
              many registered license agents in South Dakota. The best way to
              locate an agent near or on the way to your destination is to go to
              the following link
              <a
                href="http://gfp.sd.gov/hunting/licenses/general/agents/default.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[#ff751f]"
              >
                {" "}
                http://gfp.sd.gov/hunting/licenses/general/agents/default.aspx .
              </a>
              You can locate the one nearest your county or you can search
              alphabetically by city as well. If you don't have access to a
              computer, you can call Game & Fish directly at (605) 773-3485 and
              they can direct you to the nearest agent.
            </p>

            <p>Happy and safe hunting!</p>
          </div>
        </section>
      </main>
      <OurPartners />
      <LatestNews />
      {/* <Footer /> */}
    </>
  );
}
