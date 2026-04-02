import Link from "next/link";
import ImagesCatalog from "@/components/common/images-catalog";
import SeasonSchedule from "@/components/common/seasonSchedule";

export default function AvailabilityPage() {
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="AvailabilityImage relative flex min-h-[320px] items-center justify-center px-4 pb-20 pt-24 sm:min-h-[420px] sm:px-6 sm:pb-24 sm:pt-28 md:min-h-[500px] lg:min-h-[560px]">
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

      {/* Gallery section */}
      <section className="bg-[#e8ded1] px-4 pb-20 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-7xl">
          <ImagesCatalog />
        </div>
      </section>
    </main>
  );
}