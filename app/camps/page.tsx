import Link from "next/link";
import LatestNews from "@/components/NewsEvent";
import OurPartners from "@/components/ourPartners";

type CampProperty = {
  name: string;
  location: string;
  county: string;
  href: string;
};

const campProperties: CampProperty[] = [
  {
    name: "Faulkton Pheasant Camp",
    location: "Faulkton, South Dakota",
    county: "Faulk County",
    href: "/camps/faulkton-pheasant-camp",
  },
  {
    name: "Gunner's Haven Pheasant Camp",
    location: "Selby, South Dakota",
    county: "Walworth County",
    href: "/camps/gunners-haven-pheasant-camp",
  },
  {
    name: "Meadow Creek Pheasant Camp",
    location: "Meadow, South Dakota",
    county: "Perkins County",
    href: "/camps/meadow-creek-pheasant-camp",
  },
  {
    name: "Pheasant Camp Lodge",
    location: "Lake Andes, South Dakota",
    county: "Charles Mix County",
    href: "/camps/pheasant-camp-lodge",
  },
  {
    name: "West River Adventures Pheasant Camp",
    location: "Timberlake, SD",
    county: "Dewey County",
    href: "/camps/west-river-adventures-pheasant-camp",
  },
];

function BreadcrumbHomeIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="shrink-0"
    >
      <path d="M12 3.172 3 10.2V21h6v-6h6v6h6V10.2l-9-7.028Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="mt-[5px] h-[13px] w-[13px] shrink-0 text-[#e67b35]"
      fill="currentColor"
    >
      <path d="M7.7 14.3 3.4 10l1.4-1.4 2.9 2.9 7.5-7.5L16.6 5 7.7 14.3Z" />
    </svg>
  );
}

function HeroCurve() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 overflow-hidden leading-none">
      <svg
        viewBox="0 0 1440 132"
        preserveAspectRatio="none"
        className="block h-[88px] w-full sm:h-[96px] lg:h-[110px]"
        aria-hidden="true"
      >
        <path
          d="M0 83C190 67 343 55 504 49C647 43 797 43 936 50C1119 60 1273 75 1440 92V132H0V83Z"
          fill="#E7DCCF"
        />
        <path
          d="M0 83C190 67 343 55 504 49C647 43 797 43 936 50C1119 60 1273 75 1440 92"
          fill="none"
          stroke="#2b1705"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function CampsPage() {
  return (
    <main className="flex flex-col bg-[#e7dccf] text-[#281703]">
      <section className="CampsImage relative isolate flex min-h-[360px] items-center justify-center overflow-hidden bg-cover bg-center px-4 pt-20 sm:min-h-[430px] sm:px-6 md:min-h-[500px] lg:min-h-[590px] lg:px-8">
        <div className="absolute inset-0 bg-[#e8b783]/45" />
        <div className="absolute inset-0 bg-black/12" />

        <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
          <h1 className="text-[46px] font-bold uppercase leading-none tracking-[-0.03em] text-[#231305] sm:text-[64px] lg:text-[78px]">
            Camps
          </h1>

          <nav
            aria-label="Breadcrumb"
            className="mt-5 sm:mt-6"
          >
            <ol className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#281703] sm:gap-3 sm:text-[11px]">
              <li>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-[#e67b35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#281703] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                >
                  <BreadcrumbHomeIcon />
                  <span>Home</span>
                </Link>
              </li>
              <li aria-hidden="true" className="text-[12px] text-[#6c5240]">
                ›
              </li>
              <li aria-current="page">Camps</li>
            </ol>
          </nav>
        </div>

        <HeroCurve />
      </section>

      <section className="bg-[#e7dccf] px-5 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8 lg:pb-20 lg:pt-14">
        <div className="mx-auto max-w-[1120px]">
          <div className="mx-auto max-w-[980px] text-center">
            <h2 className="text-[34px] font-bold leading-[1.05] tracking-[-0.03em] text-[#281703] sm:text-[42px] lg:text-[56px]">
              South Dakota Pheasant Hunting
            </h2>

            <p className="mx-auto mt-4 max-w-[860px] text-[13px] font-semibold leading-[1.35] text-[#2c221c] sm:mt-5 sm:text-[14px] lg:text-[15px]">
              Below are links to detailed information on the various South Dakota
              Pheasant Hunting properties that UGUIDE offers. Each property has
              its own minimum and maximum capacity per week. Within the links you
              will find detailed info such as lodging photos, land photos,
              hunting video, amenities and more. This detailed info is designed
              to help you select the package that best suits your groups pheasant
              hunting vacation requirements.
            </p>
          </div>

          <div className="mx-auto mt-10 h-px max-w-[1060px] bg-[#9c8f82] sm:mt-12 lg:mt-14" />

          <div className="mx-auto mt-10 max-w-[980px] text-center sm:mt-12 lg:mt-14">
            <h3 className="text-[31px] font-bold leading-[1.05] tracking-[-0.03em] text-[#281703] sm:text-[38px] lg:text-[54px]">
              Pheasant Camp Properties
            </h3>

            <ul className="mx-auto mt-5 flex max-w-[880px] flex-col gap-1 text-left sm:mt-6 sm:items-center sm:text-center">
              {campProperties.map((camp) => (
                <li
                  key={camp.name}
                  className="flex items-start gap-2 text-[14px] font-medium leading-[1.25] text-[#2f2b27] sm:text-[15px]"
                >
                  <CheckIcon />
                  <p>
                    <a
                      href={camp.href}
                      className="font-semibold text-[#e67b35] underline-offset-2 transition-colors duration-200 hover:text-[#b85e24] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#281703] focus-visible:ring-offset-2 focus-visible:ring-offset-[#e7dccf]"
                    >
                      {camp.name}
                    </a>
                    <span>{` - ${camp.location} - ${camp.county}`}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <OurPartners />
      <LatestNews />
    </main>
  );
}
