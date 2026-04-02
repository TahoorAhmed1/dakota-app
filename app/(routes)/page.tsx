import ImagesCatalog from "@/components/common/images-catalog";
import SeasonSchedule from "@/components/common/seasonSchedule";
import LatestNews from "@/components/NewsEvent";
import OurPartners from "@/components/ourPartners";
import Testimonials from "@/components/testimonial";
import pic from "@/assets/col.png";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col ">
      <div className="HomeImage relative bg-cover bg-center py-12">
        <div className="mx-auto py-48 flex w-full max-w-[1140px] flex-col items-center gap-8 px-4">
          <img src={pic.src} alt="img" className="w-[60%] max-w-[420px]" />
          <div className="flex flex-col py-10 items-center gap-4 md:flex-row md:gap-10">
            <button className="px-8 py-4 border-2 border-black rounded-md text-black text-base font-medium hover:bg-white hover:text-[#2b1a0f] transition-colors">
              Make Individual Payments
            </button>
            <Link
              href="/quote-reserve"
              className="px-8 py-4 border-2 border-black rounded-md text-black text-base font-medium hover:bg-white hover:text-[#2b1a0f] transition-colors"
            >
              Book Your Hunt Online
            </Link>
          </div>
        </div>
      </div>
      <SeasonSchedule />

      <div className="bg-white">
        <ImagesCatalog />
      </div>

      {/* Video Section */}
      <section className="bg-[#E7DCCF] py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-black   text-[36px] font-semibold  uppercase mb-2">
            UGUIDE South Dakota Pheasant Hunting Video{" "}
          </p>
          <h2 className="text-[15px] font-medium text-black mb-10">
            South Dakota Pheasant Hunting Action at UGUIDE Pheasant Camps{" "}
          </h2>
          <div className="relative aspect-video rounded-xl overflow-hidden">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/VIDEO_ID"
              title="UGUIDE South Dakota Pheasant Hunting Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <Testimonials />
      <OurPartners />
      <LatestNews />
    </div>
  );
}
