import CampingExp from "@/components/common/camping-exp";
import ImagesCatalog from "@/components/common/images-catalog";
import SeasonSchedule from "@/components/common/seasonSchedule";
import LatestNews from "@/components/NewsEvent";
import OurPartners from "@/components/ourPartners";
import Testimonials from "@/components/testimonial";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col ">
      <div className="HomeImage flex flex-col justify-center relative">
        <div className="flex justify-center text-black items-center gap-12">
          <button className="px-6 py-3 border border-black rounded-md hover:bg-black hover:text-white transition-colors">
            Make Individual Payments
          </button>
          <Link href="/quote-reserve" className="px-6 py-3 border border-black rounded-md hover:bg-black hover:text-white transition-colors">
            Book Your Hunt Online
          </Link>
        </div>
      </div>
      <SeasonSchedule />
      <ImagesCatalog />
      <Testimonials />
      <OurPartners />
      <LatestNews />
    </div>
  );
}
