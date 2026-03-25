import CampingExp from "@/components/common/camping-exp";
import ImagesCatalog from "@/components/common/images-catalog";
import SeasonSchedule from "@/components/common/seasonSchedule";
import LatestNews from "@/components/NewsEvent";
import OurPartners from "@/components/ourPartners";
import Testimonials from "@/components/testimonial";

export default function Home() {
  return (
    <div className="flex flex-col ">
      <div className="HomeImage flex flex-col justify-center relative">
        <div className="flex justify-center text-black items-center gap-12">
          <button className="px-6 py-3 border border-black rounded-md">
            Make Individual Payments
          </button>
          <button className="px-6 py-3 border border-black rounded-md">
            Book Your Hunt Online{" "}
          </button>
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
