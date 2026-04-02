import ImagesCatalog from "@/components/common/images-catalog";
import SeasonSchedule from "@/components/common/seasonSchedule";
import LatestNews from "@/components/NewsEvent";
import OurPartners from "@/components/ourPartners";
import Testimonials from "@/components/testimonial";
import pic from "@/assets/col.png";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col ">
      <div className="HomeImage relative bg-cover bg-center py-10 sm:py-12">
        <div className="mx-auto flex w-full max-w-[1140px] flex-col items-center gap-6 px-4 py-24 sm:gap-8 sm:py-36 md:py-44 lg:py-48">
          <Image src={pic} alt="UGUIDE logo" className="w-[78%] max-w-[420px] sm:w-[60%]" priority />
          <div className="flex w-full flex-col items-center gap-4 py-6 sm:py-8 md:w-auto md:flex-row md:gap-6 lg:gap-10">
            <button className="px-8 py-4 border-2 border-black rounded-md text-black text-base font-medium hover:bg-white hover:text-[#2b1a0f] transition-colors">
              Make Individual Payments
            </button>
            <Link
              href="/quote-reserve"
              className="w-full rounded-md border-2 border-black px-8 py-4 text-center text-base font-medium text-black transition-colors hover:bg-white hover:text-[#2b1a0f] md:w-auto"
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
      <section className="bg-[#E7DCCF] px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-2 text-[28px] font-semibold uppercase text-black sm:text-[36px]">
            UGUIDE South Dakota Pheasant Hunting Video{" "}
          </p>
          <h2 className="mb-8 text-[15px] font-medium text-black sm:mb-10">
            South Dakota Pheasant Hunting Action at UGUIDE Pheasant Camps{" "}
          </h2>
          <div className="relative aspect-video overflow-hidden rounded-xl">
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
