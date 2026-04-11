import Image from "next/image";
import Link from "next/link";

import LatestNews from "@/components/NewsEvent";
import OurPartners from "@/components/ourPartners";
import ResourcesAccordionSection from "./_components/resources-accordion";

const huntingPolicies = [
  {
    tag: "Hunting Ethics",
    title: "Fair Chase Policy",
    body: "UGUIDE hunts exclusively wild, free-ranging South Dakota pheasants. We do not stock or release pen-raised birds. Bag counts vary by group skill level, weather, and natural field conditions — we do not guarantee limits.",
    link: null,
  },
  {
    tag: "Dog Requirements",
    title: "Upland Bird Dog Policy",
    body: "A skilled, trained upland bird dog is required for every hunt. Dogs must be steady to wing and reliable in the field. No exceptions. We can recommend professional trainers if needed.",
    link: null,
  },
  {
    tag: "Group Size",
    title: "Minimum Group Size Policy",
    body: "Minimum group sizes vary by camp and season. Reservations below the minimum may be merged with other groups or rescheduled. Check the Availability page for current minimums.",
    link: { label: "View Availability", href: "/availability" },
  },
  {
    tag: "Licensing",
    title: "South Dakota Hunting License",
    body: "All hunters must possess a valid South Dakota non-resident hunting license before arriving at camp. Licenses are the sole responsibility of the hunter and are not included in the package price.",
    link: { label: "Purchase SD License (SD GFP)", href: "https://gfp.sd.gov/licenses/" },
  },
  {
    tag: "Reservations",
    title: "Deposit & Payment Policy",
    body: "A 25% non-refundable deposit is required to hold your reservation by May 1. The remaining balance is due in full by September 1. Groups booking after September 1 must pay in full at the time of reservation.",
    link: null,
  },
  {
    tag: "Cancellations",
    title: "Cancellation Policy",
    body: "Cancellations made before July 1 may receive a full deposit refund at UGUIDE's discretion. Cancellations after July 1 forfeit the deposit. Cancellations after September 1 may be subject to full forfeiture. We strongly recommend travel insurance.",
    link: null,
  },
  {
    tag: "Safety",
    title: "Hunter Safety & Orange Requirements",
    body: "All hunters must wear a minimum of 400 sq. in. of blaze orange above the waist while in the field — South Dakota state law. Safe firearms handling and muzzle discipline are strictly enforced at all times.",
    link: null,
  },
  {
    tag: "Conduct",
    title: "Property & Conduct Policy",
    body: "Hunters are guests on private property. Fences, gates, crops, and livestock must be respected at all times. Alcohol in the field is prohibited. Violations of conduct or safety rules may result in immediate removal without refund.",
    link: null,
  },
];

function HomeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 3.172 3 10.2V21h6v-6h6v6h6V10.2l-9-7.028Z" />
    </svg>
  );
}

export default function ResourcesPage() {
  return (
    <>
    <main className="flex flex-col">
      <section className="ResourcesImage relative flex min-h-80 items-center justify-center overflow-hidden bg-cover bg-center px-4 pb-20 pt-24 sm:min-h-105 sm:px-6 sm:pb-24 sm:pt-28 md:min-h-130 lg:min-h-155 lg:pb-28 lg:pt-32">
        <div className="absolute inset-0 " />
        <div className="absolute inset-0 " />

        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="text-[38px] font-bold uppercase leading-none text-[#241304] sm:text-[58px] md:text-[72px] ">
            Resources
          </h1>

          <nav
            aria-label="Breadcrumb"
            className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#281703] sm:mt-6 sm:gap-3 sm:text-[12px]"
          >
            <Link href="/" className="flex items-center gap-2 transition-colors hover:text-[#F16724]">
              <HomeIcon />
              <span>Home</span>
            </Link>
            <span aria-hidden="true">›</span>
            <span>Resources</span>
          </nav>
        </div>

        {/* <div className="absolute bottom-0 left-0 right-0 translate-y-1/2">
          <div className="h-20 w-full rounded-t-[100%] border-t-[4px] border-[#281703] bg-[#E7DCCF]" />
        </div> */}
      </section>

      <ResourcesAccordionSection />

      {/* ── Hunting Policies ── */}
      <section className="bg-[#281703] px-4 py-8 md:px-6 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center sm:mb-12">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-orange-400">
              Publicly Posted
            </p>
            <h2 className="text-3xl font-bold uppercase tracking-[-0.02em] text-white sm:text-4xl">
              UGUIDE Hunting Policies
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base">
              The following policies govern all UGUIDE South Dakota pheasant hunting reservations
              and on-property conduct. By booking a hunt you agree to these terms.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {huntingPolicies.map((policy) => (
              <div
                key={policy.title}
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5"
              >
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-orange-400">
                  {policy.tag}
                </p>
                <h3 className="mb-2 text-base font-bold text-white sm:text-lg">{policy.title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{policy.body}</p>
                {policy.link ? (
                  <a
                    href={policy.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-xs font-semibold text-orange-400 underline underline-offset-2 transition-colors hover:text-orange-300"
                  >
                    {policy.link.label} →
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <OurPartners />
      <LatestNews />      
      </main>
      {/* <Footer /> */}
    </>
  );
}
