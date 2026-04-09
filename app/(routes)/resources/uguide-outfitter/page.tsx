// app/resources/uguide-outfitter/page.tsx
"use client";

import Header from "@/components/common/header";
import OurPartners from "@/components/ourPartners";
import LatestNews from "@/components/NewsEvent";
import Link from "next/link";

export default function UguideOutfitterPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        {/* Banner Section */}
        <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-[#E7DCCF] px-4 pb-12 pt-24 sm:min-h-[320px] sm:px-6 sm:pb-14 sm:pt-28 md:min-h-[360px]">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#241304] mb-4">South Dakota Pheasant Hunting Business Startup</h1>
            <nav className="text-sm text-[#281703]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#E4803A]">Home</Link>
              <span className="mx-2">›</span>
              <Link href="/resources" className="hover:text-[#E4803A]">Resources</Link>
              <span className="mx-2">›</span>
              <span>UGUIDE Outfitter</span>
            </nav>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
          <div className="space-y-6 text-[#31261d] text-lg">
            <p>
              UGUIDE owns the Pheasant Camp Lodge and that is the original UGUIDE Pheasant Camp that all other pheasant camps are modeled after. UGUIDE has since helped many other private landowners start and grow there own self-guided wild bird pheasant hunting businesses.
            </p>
            
            <p>
              UGUIDE is unique! There is no other pheasant hunting system or network of camps like it in the state (or country for that matter). For this reason we attract many hunters from other outfitters in the state that operate in more traditional, all-inclusive, full-service, and/or preserve models.
            </p>

            <p>
              <Link href="#" className="text-[#E4803A] underline">Read a UGUIDE Business Success Case Study</Link> on how UGUIDE can help you build your Pheasant Hunting Business today!
            </p>

            <p>
              South Dakota is a great state to run a commercial fair chase pheasant hunting business.
            </p>

            <p>
              UGUIDE specializes in unguided wild pheasant hunting and attracts pheasant hunters from all over the nation.
            </p>

            <p>
              Most UGUIDE landowners are full-time farming and ranching couples that do not have time or interest in the marketing, sales and services required to get the hunters to their property (and keep them coming back year after year). UGUIDE does all that for them.
            </p>

            <p>
              UGUIDE offers an excellent process and system and you can enjoy a high level of trust in partnering with a business professional.
            </p>

            <p>
              Many landowners have excellent places to hunt and can attract and retain a few hunters each year but are not able to keep their schedule full and consequently struggle financially to maintain a quality operation. UGUIDE has an excellent track record with keeping camps FULL and with HIGH re-booking rates.
            </p>

            <p>
              If you have a quality property with abundant supply of pheasants and are interested in developing your agri-tourism income through adding a pheasant hunting operation to your farm then <Link href="#" className="text-[#E4803A] underline">for more info and to be contacted please complete the Request For Information Form</Link>
            </p>

            <p>
              <Link href="#" className="text-[#E4803A] underline">Click to link for more detailed info on UGUIDE Landowner & Hunter Services</Link>
            </p>

            <p>
              <Link href="#" className="text-[#E4803A] underline">Click the link to read an article UGUIDE wrote on running a fee based pheasant hunting business</Link>
            </p>
          </div>
        </section>
      </main>

      <OurPartners />
      <LatestNews />
    </>
  );
}