  import ImagesCatalog from "@/components/common/images-catalog";
import SeasonSchedule from "@/components/common/seasonSchedule";
import HomeBanner from "@/components/home-banner";
import LatestNews from "@/components/NewsEvent";
import OurPartners from "@/components/ourPartners";
import PackagesSection from "@/components/packages-section";
import Testimonials from "@/components/testimonial";
import WaitlistForm from "@/components/waitlist-form";
import { getSeasonScheduleData } from "@/lib/server/season-schedule-data";

export default async function Home() {
  const scheduleData = await getSeasonScheduleData();
  return (
    <div className="flex flex-col ">
      <HomeBanner />
      <SeasonSchedule data={scheduleData} />

      <div className="bg-white">
        <ImagesCatalog />
      </div>

      <section className="bg-[#E7DCCF] px-4 py-8 md:px-6 md:py-16">
        <div className="mx-auto max-w-6xl text-center">
          <p className="mb-2 text-xs font-bold tracking-widest uppercase text-orange-500">
            Featured
          </p>
          <h2 className="text-3xl font-bold uppercase text-black sm:text-4xl">
            UGUIDE South Dakota Pheasant Hunting Video
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-black/70 sm:text-base">
            South Dakota Pheasant Hunting Action at UGUIDE Pheasant Camps
          </p>
          <div className="relative mt-10 aspect-video overflow-hidden rounded-xl sm:mt-12">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/v4toDoyDtAU?si=ZeWL3bnWogpCDyvG&amp;start=31"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          </div>
        </div>
      </section>

      <PackagesSection />
      <Testimonials />


      <OurPartners />
      <LatestNews />
    </div>
  );
}
