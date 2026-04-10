import Image, { StaticImageData } from "next/image";
import type { ReactNode } from "react";
import Link from "next/link";
import LatestNews from "@/components/NewsEvent";
import OurPartners from "@/components/ourPartners";
import heroImage from "@/assets/aboutImage.png";
import photo1 from "@/assets/rate 4.jpg";
import photo2 from "@/assets/discount5.jpg";
import photo3 from "@/assets/discount 3.jpg";
import photo4 from "@/assets/rate 2.jpg";
import photo5 from "@/assets/discount 6.jpg";
import photo6 from "@/assets/rate 1.jpg";

function BulletItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 leading-[1.45] sm:gap-3">
      <span className="mt-[3px] shrink-0 text-[12px] font-bold text-[#ed7a34] sm:text-[13px]">
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}

function ImageTile({
  src,
  alt,
  className,
  priority = false,
}: {
  src: StaticImageData;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] bg-[#caa47d] shadow-[0_10px_30px_rgba(40,23,3,0.08)] ${className ?? ""}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 26vw"
        className="object-cover"
      />
    </div>
  );
}

export default function DiscountsPage() {
  return (
    <main className="overflow-hidden bg-[#E7DCCF] text-[#281703]">
      <section className="relative isolate flex min-h-[360px] items-center justify-center overflow-hidden px-4 pb-24 pt-20 sm:min-h-[430px] sm:px-6 sm:pt-24 lg:min-h-[520px] lg:pb-28">
        <Image
          src={heroImage}
          alt="Hunters in field"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#f0c38f]/46" />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative mx-auto flex min-h-[360px] max-w-[1600px] items-center justify-center px-5 pb-24 pt-24 text-center sm:min-h-[430px] sm:px-8 sm:pb-28 md:min-h-[510px] md:pt-28 lg:min-h-[560px] lg:px-10 lg:pb-32">
          <div className="translate-y-6 sm:translate-y-8 md:translate-y-10">
            <h1 className="text-[38px] font-bold uppercase leading-none tracking-[-0.04em] text-[#1f1308] sm:text-[54px] md:text-[68px] lg:text-[74px]">
              Discounts
            </h1>

            <nav
              aria-label="Breadcrumb"
              className="mt-5 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#24150a] sm:text-[11px]"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-[#d26f2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d26f2f] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
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
              <span aria-current="page">Discounts</span>
            </nav>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2">
          <div className="h-20 w-full rounded-t-[100%] border-t-[4px] border-[#281703] bg-[#e3d9ce]" />
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

      <section className="relative z-10 bg-[#e8ded1] px-4 pb-14 pt-14 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="mx-auto max-w-[1220px]">
          <div className="mx-auto max-w-[860px] text-center">
            <h2 className="text-[27px] font-black leading-[1.05] tracking-[-0.03em] text-[#281703] sm:text-[36px] lg:text-[58px]">
              UGUIDE South Dakota Pheasant Hunting Specials
            </h2>

            <p className="mx-auto mt-3 max-w-[760px] text-[13px] font-medium leading-[1.55] text-[#312b24] sm:text-[14px] lg:text-[15px]">
              Click on specific links to get more info about the special or related camp.
              Remember to go to the{" "}
              <Link
                href="/availability"
                className="font-semibold text-[#ed7a34] transition-colors duration-200 hover:text-[#b8581d]"
              >
                Availability
              </Link>{" "}
              page to check current rates and openings.
            </p>
          </div>

          <div className="mt-10 grid items-start gap-8 lg:mt-12 lg:grid-cols-[minmax(0,1.04fr)_minmax(340px,0.76fr)] lg:gap-10 xl:gap-14">
            <div className="max-w-[700px] text-[13px] leading-[1.28] text-[#231f1c] sm:text-[14px] lg:text-[15px]">
              <div className="space-y-5 lg:space-y-6">
                <div>
                  <h3 className="text-[16px] font-black leading-[1.2] text-[#281703] sm:text-[17px] lg:text-[18px]">
                    Fair Chase Pheasant Hunting Notice:
                  </h3>
                  <p className="mt-1.5 leading-[1.32] lg:mt-2">
                    These hunts are a test of your shooting, dog and hunting skills. These are
                    not released pheasants. These are some of the wariest pheasants you will
                    find in North America. We do not allow groups to hunt without skilled dogs.
                    Your overall success and experience will be relative to the number of skilled
                    shooters, experienced pheasant hunting dogs and experienced pheasant hunters
                    in your group. If you lack the above you may be better served to look for a
                    guided hunt at a shooting preserve where they release pheasants.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16px] font-black leading-[1.2] text-[#281703] sm:text-[17px] lg:text-[18px]">
                    Discount-Specials-Deals-Bargains-Cheap-Low Cost-DIY
                  </h3>

                  <ul className="mt-2.5 space-y-3 lg:mt-3 lg:space-y-4">
                    <BulletItem>
                      <span>
                        <b>Hunter Volume Discount</b> (up to $80 off per person) &mdash; For
                        each additional paying person above 6 and up to 10, you will be
                        discounted $20/person off the package price for everyone in the group.
                        For example: Let&apos;s say normal rate is $1955/person and your group size is
                        7. Your discount would be $20/person. If your group size was 10 your
                        discount would be $80/person.
                      </span>
                    </BulletItem>

                    <BulletItem>
                      <span>
                        <b>Youth &amp; Juniors Specials</b>
                        <br />
                        <span className="font-semibold text-[#ed7a34]">Eligibility</span> — Once
                        the camp minimum is met/booked with full price adult hunters you may add
                        up to 2 Youth ages 12&ndash;15 and up to 2 Juniors ages 16&ndash;17. The youth
                        will be free of charge and the Juniors rate will be 50% off.
                      </span>
                    </BulletItem>

                    <BulletItem>
                      <span>
                        <b>EarlyBird On-Line Re-Book Discount</b> — Rebook next year&apos;s hunt
                        within 14+ days of conclusion of this year&apos;s hunt, online, and receive
                        5% discount off your total hunt package for next year.{" "}
                        <Link
                          href="/quote-reserve"
                          className="font-medium text-[#ed7a34] transition-colors duration-200 hover:text-[#b8581d]"
                        >
                          On-Line Booking Tool Here
                        </Link>
                      </span>
                    </BulletItem>

                    <BulletItem>
                      <span>
                        New Groups booking hunts for the first time can qualify for this
                        discount when they book their hunt before year end, for next year, in
                        the current hunting season (Dec 31).
                      </span>
                    </BulletItem>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[16px] font-black leading-[1.2] text-[#281703] sm:text-[17px] lg:text-[18px]">
                    Each member in your group can choose 1 eligible individual discount from the
                    list below:
                  </h3>

                  <ul className="mt-2.5 space-y-1.5 lg:mt-3 lg:space-y-2">
                    <BulletItem>
                      <span>
                        Group Coordinator - 10% Discount (only 1 person in group may use this)
                      </span>
                    </BulletItem>
                    <BulletItem>
                      <span>Senior age 65 and up - 5% Discount</span>
                    </BulletItem>
                    <BulletItem>
                      <span>Military (Active/Retired) - 5% Discount</span>
                    </BulletItem>
                    <BulletItem>
                      <span>Handicap - 5% Discount</span>
                    </BulletItem>
                    <BulletItem>
                      <span>Firefighter (Active/Retired) - 5% Discount</span>
                    </BulletItem>
                    <BulletItem>
                      <span>Law Enforcement (Active/Retired) - 5% Discount</span>
                    </BulletItem>
                    <BulletItem>
                      <span>Emergency Medical Technician (Active/Retired) - 5% Discount</span>
                    </BulletItem>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[16px] font-black leading-[1.2] text-[#281703] sm:text-[17px] lg:text-[18px]">
                    Add-Ons
                  </h3>

                  <ul className="mt-2.5 space-y-3 pl-5 leading-[1.34] marker:text-[#281703] lg:mt-3 lg:space-y-4 lg:pl-6">
                    <li className="list-disc">
                      Non-Hunters &mdash; Anyone staying with the group and not hunting will be
                      charged a standard lodging rate of $100/night/person (depending on tier).
                      Minimum is 4 nights and no discounts apply to non-hunters.
                    </li>
                    <li className="list-disc">
                      Additional nights lodging &mdash; Hunters may want to extend their hunting
                      trip by staying extra nights and hunting public ground in the area. Extra
                      nights lodging will be charged at $100/night/person (depending on tier)
                      for additional nights lodging in addition to the standard 4-nights
                      included in the base package.
                    </li>
                    <li className="list-disc">
                      Various camps offer both 3 &amp; 4 day hunt options. See details on various
                      {" "}
                      <Link
                        href="/rates"
                        className="font-semibold text-[#ed7a34] transition-colors duration-200 hover:text-[#b8581d]"
                      >
                        Packages here
                      </Link>
                      .
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mx-auto grid w-full max-w-[520px] grid-cols-1 gap-3 self-start sm:grid-cols-2 sm:gap-4 lg:max-w-none lg:gap-5 xl:gap-6">
              <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5 xl:gap-6">
                <ImageTile
                  src={photo1}
                  alt="Pheasant feathers in hunter's hand"
                  priority
                  className="h-[220px] sm:h-[300px] lg:h-[348px] xl:h-[386px]"
                />
                <ImageTile
                  src={photo4}
                  alt="Hunter walking dog through field"
                  className="h-[160px] sm:h-[188px] lg:h-[208px] xl:h-[230px]"
                />
                <ImageTile
                  src={photo5}
                  alt="Group of hunters posing outdoors"
                  className="h-[136px] sm:h-[156px] lg:h-[174px] xl:h-[194px]"
                />
              </div>

              <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5 xl:gap-6">
                <ImageTile
                  src={photo2}
                  alt="Hunters seated indoors in blaze orange gear"
                  className="h-[124px] sm:h-[148px] lg:h-[164px] xl:h-[180px]"
                />
                <ImageTile
                  src={photo3}
                  alt="Hunter loading shells from vest pocket"
                  className="h-[124px] sm:h-[148px] lg:h-[164px] xl:h-[180px]"
                />
                <ImageTile
                  src={photo6}
                  alt="Hunter aiming shotgun in field"
                  className="h-[220px] sm:h-[356px] lg:h-[414px] xl:h-[462px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <OurPartners />
      <LatestNews />
    </main>
  );
}
