import Link from "next/link";
import ImagesCatalog from "@/components/common/images-catalog";
import SeasonSchedule from "@/components/common/seasonSchedule";
import PhotoSlideshow from "@/components/photo-slideshow";
import Testimonials from "@/components/testimonial";

export default function AvailabilityPage() {
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="AvailabilityImage relative flex min-h-80 items-center justify-center px-4 pb-20 pt-24 sm:min-h-105 sm:px-6 sm:pb-24 sm:pt-28 md:min-h-125 lg:min-h-140">
        <div className="absolute inset-0 " />
        <div className="absolute inset-0 " />

        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="text-[40px] font-bold uppercase leading-none text-[#281703] sm:text-[52px] md:text-[72px] lg:text-[82px]">
            Availability
          </h1>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#281703] sm:mt-6 sm:gap-3 sm:text-[12px]">
            <Link
              href="/"
              className="flex items-center gap-2 transition-colors hover:text-[#F16724]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3.172 3 10.2V21h6v-6h6v6h6V10.2l-9-7.028Z" />
              </svg>
              <span>Home</span>
            </Link>

            <span>›</span>
            <span>Availability</span>
          </div>
        </div>

        {/* Curved divider */}
        {/* <div className="absolute bottom-0 left-0 right-0 translate-y-1/2">
          <div className="h-20 w-full rounded-t-[100%] border-t-[4px] border-[#281703] bg-[#E7DCCF]" />
        </div> */}
      </section>

      {/* Season schedule section */}
      <SeasonSchedule />

      {/* Photo slideshow section */}


      <section className="bg-white px-4 pb-20 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-7xl">
          <ImagesCatalog />
        </div>
      </section>

            <section className="bg-[#281703] px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center sm:mb-12">
            <p className="mb-2 text-xs font-bold tracking-widest uppercase text-orange-400">
              Life at Camp
            </p>
            <h2 className="text-3xl font-bold uppercase text-white sm:text-4xl">
              UGUIDE Photo Gallery
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
              A look at the people, dogs, birds, and places that make UGUIDE South Dakota&apos;s premier pheasant hunting experience.
            </p>
          </div>
          <PhotoSlideshow />
        </div>
      </section>
      {/* Testimonials */}
      <Testimonials />

      {/* Gallery section */}
    </main>
  );
}