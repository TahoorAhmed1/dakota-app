"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import CampingExp from "@/components/common/camping-exp";

import photo1 from "@/assets/about1.jpg";
import partner1 from "@/assets/partner1.png";
import partner2 from "@/assets/partner2.png";
import partner3 from "@/assets/partner3.png";
import partner5 from "@/assets/partner4.png";

type DifferenceCardProps = {
  title: string;
  children: React.ReactNode;
};

function DifferenceCard({ title, children }: DifferenceCardProps) {
  return (
    <article className="rounded-[10px]">
      <div className="rounded-[8px] bg-[#f37021] px-4 py-[7px] text-[12px] font-extrabold uppercase leading-none tracking-[0.01em] text-white sm:text-[13px]">
        {title}
      </div>
      <div className="pt-3 text-[13px] leading-[1.55] text-[#31261d] sm:text-[14px] sm:leading-[1.65]">
        {children}
      </div>
    </article>
  );
}

function PartnerLogo({
  src,
  alt,
  className,
}: {
  src: StaticImageData;
  alt: string;
  className?: string;
}) {
  return (
    <div className="flex justify-center">
      <Image
        src={src}
        alt={alt}
        className={className ?? "h-auto w-full max-w-[190px] object-contain"}
      />
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="flex flex-col text-[#24170c]">
      <section className="AboutImage relative flex min-h-[320px] items-center justify-center overflow-hidden px-4 pb-18 pt-24 sm:min-h-[420px] sm:px-6 sm:pb-22 sm:pt-28 md:min-h-[500px] lg:min-h-[560px]">
        <div className="absolute inset-0" />
        <div className="absolute inset-0" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="text-[38px] font-bold uppercase  text-[#1f1208] sm:text-[58px] md:text-[72px] ">
            About Us
          </h1>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#2a1a0c] sm:text-[11px]">
            <Link
              href="/"
              className="flex items-center gap-2 transition-colors hover:text-[#f37021]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 3.172 3 10.2V21h6v-6h6v6h6V10.2l-9-7.028Z" />
              </svg>
              <span>Home</span>
            </Link>
            <span>›</span>
            <span>About Us</span>
          </div>
        </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/70 animate-bounce">
          <span className="text-[11px] tracking-widest uppercase">Scroll</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </section>

      <section className="bg-[#e8ded1] px-4 pb-16 pt-12 sm:px-6 sm:pb-20 md:pt-16 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <header className="text-center">
            <h2 className="text-[30px] font-black leading-none text-[#24170c] sm:text-[40px] md:text-[56px]">
              About U-Guide
            </h2>

            <div className="mt-3 space-y-1 text-[16px] font-semibold leading-tight sm:text-[18px]">
              <p>
                <Link
                  href="/availability"
                  className="text-[#ef7a2e] underline underline-offset-4 transition-opacity hover:opacity-80"
                >
                  2026 South Dakota Pheasant Hunting Season Dates
                </Link>
              </p>
              <p>
                <Link
                  href="/availability"
                  className="text-[#ef7a2e] underline underline-offset-4 transition-opacity hover:opacity-80"
                >
                  October 17, 2026 – January 31, 2027
                </Link>
              </p>
              <p className="pt-1">
                <Link
                  href="/quote-reserve"
                  className="text-[#3667d6] underline underline-offset-4 transition-opacity hover:opacity-80"
                >
                  Now Booking Pheasant Hunts for Fall 2026
                </Link>
              </p>
            </div>
          </header>

          <div className="mt-10 sm:mt-12">
            <h3 className="text-[26px] font-bold uppercase leading-none tracking-[0.05em] text-[#24170c] sm:text-[34px] md:text-[46px] lg:text-[54px]">
              The UGUIDE Difference?
            </h3>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_290px] xl:gap-10">
            <div className="grid gap-8 md:grid-cols-2 md:items-start">
              <div className="space-y-8">
                <DifferenceCard title='1 - The "Ultimate" Pheasant Hunting Challenge'>
                  <p>
                    As we state on our <Link href="/rates" className="font-semibold italic text-[#ef7a2e] hover:underline">Rates</Link> page,
                    these hunts are not for everyone. The elements of age, physical fitness, weather, wing shooting,
                    dog handling, dog training and pack hunting mentality are some of the skills tested as hunters
                    enter fields in the ultimate fair chase pheasant hunting test.
                  </p>
                  <p className="mt-3">
                    We are not a preserve or hunt club and these birds are not raised in pens and released in our
                    fields. They are naturally produced on our habitat and this is the ultimate fair chase pheasant
                    hunting. Other elements that factor into the fair chase equation are seasonal weather and crop
                    harvest progress.
                  </p>
                  <p className="mt-3 font-semibold italic">
                    Your group will need their upland hunting skills “A” game to be successful at a UGUIDE Pheasant Camp.
                  </p>
                </DifferenceCard>

                <DifferenceCard title="3 - Unguided/Self Guided">
                  <p>
                    Another frequent question we get from hunters is, “If I have my own dogs, know how to hunt and I just
                    need a map and some directions, can I be left alone to hunt the way I want to hunt?” This also was part
                    of the UGUIDE <Link href="/quote-reserve" className="font-semibold italic text-[#ef7a2e] hover:underline">unguided pheasant hunting</Link> founding philosophy.
                  </p>
                  <p className="mt-3">
                    You get a map and tour of the property by the landowner and are left to the challenge of fair chase
                    roosters for the balance of your stay. You against the roosters. The way <Link href="/quote-reserve" className="font-semibold italic text-[#ef7a2e] hover:underline">self guided pheasant hunting</Link> was meant to be.
                  </p>
                  <p className="mt-3">
                    Here you will find the ultimate test of 5 main success factors: 1) Dog Handler Skills, 2) Dog Skills,
                    3) Shooting Skills, 4) Hunting Strategy Skills, 5) Teamwork. People ask me, “Do you guide?” and I
                    respond, “No, U-Guide”.
                  </p>
                </DifferenceCard>

                <DifferenceCard title='5 - The Pheasant "Camp" Experience'>
                  <p>
                    Having grown up hunting whitetails in Minnesota and Wisconsin and pheasants in Iowa for 20 years staying
                    in motels and hunting public, I became introduced to the very special camp tradition those states hold.
                    The “Camp” type experience was built into the UGUIDE system by following the principles above.
                  </p>
                  <p className="mt-3">
                    That translates to your group, your lodging, your land and your special unique experience. In South Dakota,
                    hunting fair chase pheasants combines all the unpredictable factors that make the experience special and
                    unique like farming, weather, natural production, hunting pressure, dog skills, hunter skills, shooting
                    skills and the journey to get to your destination.
                  </p>
                  <p className="mt-3">
                    One of the greatest benefits many hunters talk about experiencing while at a UGUIDE pheasant Camp is
                    “Camaraderie”. I can assure you, nowhere else will the wily roosters of South Dakota be more challenging
                    and worthy of chase.
                  </p>
                </DifferenceCard>
              </div>

              <div className="space-y-8">
                <DifferenceCard title="2 - Fair Chase">
                  <p>
                    Wild-Reared Ring-necks Only! Hunters that come the distances they do from all over the country are
                    obviously concerned about being able to hunt fair chase. We get asked the question all the time,
                    “Do you release pheasants?” Our response is always the same, “No”.
                  </p>
                  <p className="mt-3">
                    We never have and never will. My question is: why would anyone want to come to South Dakota to shoot a pen
                    raised pheasant when they can do that much cheaper at their hometown area hunt club? The UGUIDE difference
                    is high natural production through well managed <Link href="/about" className="font-semibold italic text-[#ef7a2e] hover:underline">habitat</Link>, farms and annual pheasant life-cycles.
                    We are in partnership with nature.
                  </p>
                </DifferenceCard>

                <DifferenceCard title="4 - Private-Exclusive">
                  <p>
                    Many times hunters will ask, “Will we be combined with any other hunters?” We prefer to hunt with our own
                    group. From the start, one of the founding principles of UGUIDE was that each group or party had its own
                    style and culture of hunting and therefore combining groups was never a good idea.
                  </p>
                  <p className="mt-3">
                    Your land and lodging package is private and exclusive to just your group for that week in the schedule.
                    You have the whole place to yourselves and we also rest the <Link href="/availability" className="font-semibold italic text-[#ef7a2e] hover:underline">properties</Link> on the front end of your hunt.
                  </p>
                </DifferenceCard>

                <DifferenceCard title='6 - The "Coop" Owners Model'>
                  <p>
                    In the early years of UGUIDE, it became very apparent that lodging was required in conjunction with the land
                    to complete the fair chase pheasant hunting experience. Essentially hunters just needed a “place to stay” and
                    did not want to pay a lot for lodging. For this reason, it became important for the landowner/outfitter to
                    also provide the lodging in association with their hunting offering.
                  </p>
                  <p className="mt-3">
                    The top requirement for hunters was to have access to high quality habitat that held only naturally produced
                    birds. The lodging was provided out of necessity. Now keep in mind that all of these UGUIDE camps are run by
                    full time producer farmers and ranchers.
                  </p>
                  <p className="mt-3">
                    So once you understand where the value is in our system, you can understand and play your role in the
                    Owner-Hunter-UGUIDE Cooperative Model.
                  </p>
                </DifferenceCard>
              </div>
            </div>

            <aside className="mx-auto w-full max-w-[420px] space-y-8 lg:mx-0 lg:max-w-none">
              <div className="overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.04)]">
                <Image
                  src={photo1}
                  alt="Hunter aiming in a South Dakota pheasant field"
                  className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[640px]"
                  priority
                />
              </div>

              <div>
                <h4 className="text-center text-[28px] font-bold text-[#24170c] sm:text-[34px]">
                  Our Partners
                </h4>

                <div className="mt-5 space-y-6">
                  <PartnerLogo src={partner1} alt="River Bluff" />
                  <div className="flex items-center justify-center gap-3">
                    <Image src={partner2} alt="Pheasants Forever" className="h-auto w-[82px] object-contain sm:w-[90px]" />
                    <Image src={partner3} alt="Quail Forever" className="h-auto w-[82px] object-contain sm:w-[90px]" />
                  </div>
                  <PartnerLogo src={partner5} alt="On X Hunt" />
                </div>
              </div>
            </aside>
          </div>

          <p className="mt-10 text-[14px] font-medium leading-relaxed text-[#31261d] sm:text-[15px]">
            Everything to you need to know about{" "}
            <Link
              href="/quote-reserve"
              className="font-semibold italic text-[#ef7a2e] underline underline-offset-4 transition-opacity hover:opacity-80"
            >
              Reserving Next Years UGUIDE South Dakota Pheasant Hunt.
            </Link>
          </p>

          <div className="mt-12 flex justify-center sm:mt-14">
            <CampingExp />
          </div>
        </div>
      </section>
    </main>
  );
}
