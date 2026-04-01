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
          <Link href="/quote-reserve" className="px-8 py-4 border-2 border-black rounded-md text-black text-base font-medium hover:bg-white hover:text-[#2b1a0f] transition-colors">
            Book Your Hunt Online 
          </Link>
        </div>
      </div>
    </div>
      <SeasonSchedule />
      <ImagesCatalog />

      {/* Video Section */}
      <section className="bg-[#2b1a0f] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-orange-500 tracking-[4px] text-xs font-semibold uppercase mb-4">
            WATCH US HUNT
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-10">
            UGUIDE South Dakota Pheasant Hunting Video
          </h2>
          {/* Replace VIDEO_ID below with the actual YouTube video ID */}
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
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
