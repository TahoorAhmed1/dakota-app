// app/resources/articles/page.tsx
"use client";

import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import OurPartners from "@/components/ourPartners";
import LatestNews from "@/components/NewsEvent";
import Link from "next/link";

export default function ArticlesPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        {/* Banner Section */}
        <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-[#E7DCCF] px-4 pb-12 pt-24 sm:min-h-[320px] sm:px-6 sm:pb-14 sm:pt-28 md:min-h-[360px]">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#241304] mb-4">
              UGUIDE Articles
            </h1>
            <nav className="text-sm text-[#281703]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#E4803A]">
                Home
              </Link>
              <span className="mx-2">›</span>
              <Link href="/resources" className="hover:text-[#E4803A]">
                Resources
              </Link>
              <span className="mx-2">›</span>
              <span>Articles</span>
            </nav>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
          <ul className="space-y-3 text-[#31261d]">
            <li>
              <Link
                href="/resources/articles/fee-based-pheasant-hunting-business"
                className="text-[#E4803A] underline"
              >
                Understanding the Risks and Variability’s of Wild Pheasant
                Hunting
              </Link>
              <p>
                The winter of 2009-2010 will be one for the books. One that will
                be in conversations for years to come. Why? From North Dakota to
                Wisconsin and Iowa and everywhere in between the snow has filled
                in most cover valuable to wildlife certain to result in losses
                to pheasant populations across the region.
              </p>
            </li>
            <li>
              <Link
                href="/resources/articles/hunting-dog-training-tips"
                className="text-[#E4803A] underline"
              >
                Cost of South Dakota Land Ownership vs. Outfitter Hunt
              </Link>
              <p>
                Some of you may have read the original article that was
                published on this topic back in February 2007. This article is a
                follow-up and addition to that article as some things have
                changed in the market as far as land prices and knowledge about
                the outfitter industry.
              </p>
            </li>
            <li>
              <Link
                href="/resources/articles/buy-a-south-dakota-pheasant-hunting-license"
                className="text-[#E4803A] underline"
              >
                Pheasant Hunting in South Dakota - Preserves vs. Native Wild
                Pheasant Hunts
              </Link>
              <p>
                Over the years, it has come to my attention that few people know
                or are aware of the differences in preserve and non-preserve
                pheasant hunting in South Dakota. Few people I know will drive
                2000 miles to hunt any kind of a released or pen raised
                pheasant. Hunters that don't have that requirement may find
                preserves attractive.
              </p>
            </li>
            <li>
              <Link
                href="/resources/articles/intro-to-bird-and-gun"
                className="text-[#E4803A] underline"
              >
                Get ready for your U-Guide Hunt, can your dog mark?
              </Link>
              <p>
                Just the mention of a SD pheasant hunt is enough to send the
                mind of a bird hunter racing with thoughts of almost a fantasy
                experience. It will fill an adult with a child like giddiness.
                The experiences of a South Dakota hunt may range from staying at
                a farm house of a buddies grandparent to making reservations at
                high end lodge.
              </p>
            </li>
            <li>
              <Link
                href="/resources/articles/intro-to-bird-and-gun"
                className="text-[#E4803A] underline"
              >
                Role Based Pheasant Hunting in South Dakota
              </Link>
              <p>
                If you're like me, you've had your share of watching skitish
                pheasants evade your pursuit from a waaaaay to far away vantage
                point than you care for. After putting up the cost of gas,
                license, shells, dogs, food, guns and gear, you might start to
                get a little agitated if you actually want to see some birds go
                into the game bag.
              </p>
            </li>
            <li>
              <Link
                href="/resources/articles/intro-to-bird-and-gun"
                className="text-[#E4803A] underline"
              >
                How to Start and Run a Fee Based Pheasant Hunting Business
              </Link>
              <p>
                If you can say yes to the above questions then my friend you
                have the key ingredients to starting and running a successful
                South Dakota Pheasant Hunting Business.
              </p>
            </li>
            <li>
              <Link
                href="/resources/articles/intro-to-bird-and-gun"
                className="text-[#E4803A] underline"
              >
                INTRO TO BIRD AND GUN
              </Link>
              <p>
                For a puppy or young dog the most important thing to get him or
                her on the road to being a gundog is introduction to birds.
                Every year just after the hunting season starts I have someone
                call me about their perfect dog that wouldn?t pick up the birds
                on opening day.
              </p>
            </li>
            <li>
              <Link
                href="/resources/articles/intro-to-bird-and-gun"
                className="text-[#E4803A] underline"
              >
                Hunting Dog Training Tips
              </Link>
              <p>
                Early spring finds many bird dog guys asking what do I do next?
                These people are consumed by the thought of training their
                upland bird dog. There certainly are great amounts of joy that
                can be obtained from training you own gun dog, but extreme
                frustration can also be experienced if a person rushes or is
                uncertain of proper training techniques.
              </p>
            </li>
            <li>
              <Link
                href="/resources/articles/intro-to-bird-and-gun"
                className="text-[#E4803A] underline"
              >
                Warm the Water: Hunting Dog Training Tip G1
              </Link>
              <p>
                The calendar says that spring is here; unfortunately in many of
                the northern states Global Warming Flakes (also known as snow
                flakes) are still hitting the ground. The rivers are already
                flowing and many of the small ponds are starting to open from
                the grip of over 4 months of ice.
              </p>
            </li>
            <li>
              <Link
                href="/resources/articles/intro-to-bird-and-gun"
                className="text-[#E4803A] underline"
              >
                Your New Puppy - Name Selection
              </Link>
              <p>
                As you ride home from the final visit at the breeders, toting
                puppy in hand you now face one of the biggest challenges you
                will ever face. This decision is one that you will ultimately
                have to live with for the remainder of the dog’s life. What are
                you going to name this fine specimen of a bird dog?
              </p>
            </li>
            <li>
              <Link
                href="/resources/articles/intro-to-bird-and-gun"
                className="text-[#E4803A] underline"
              >
                Upland Bird Dog Puppy Selection
              </Link>
              <p>
                Are you tired of hunting birds all day long without having a
                single flush? Want an easier way to find the few downed birds
                that you do get an opportunity at? Would you like to have your
                own bird finding pointing dog? If the answer to any of these
                questions is yes, then it is time to consider getting your own
                pointing dog puppy.
              </p>
            </li>
            <li>
              <Link
                href="/resources/articles/intro-to-bird-and-gun"
                className="text-[#E4803A] underline"
              >
                The Levels of South Dakota Pheasant Hunting Experiences
              </Link>
              <p>
                Prior to 2001, most all my pheasant hunting experiences happened
                in Iowa or Minnesota. I had never even set foot in South Dakota
                hunting pheasants. I thought Iowa and South Dakota were
                comparable but really, one cannot make the comparison if they
                have not experienced hunting in both states. Well little did I
                know that South Dakota was in a league of its own in the
                pheasant hunting arena. Not only that, I've since learned that
                there are many different ways to experience a South Dakota
                pheasant hunt than you would imagine. I now own 700 acres in the
                prime of South Dakota and farm a portion of it myself for
                pheasant habitat and rent out the rest for cash crops to a local
                farmer. The following is intended to help you discern the
                various ways YOU can experience pheasant hunting in the state of
                South Dakota.
              </p>
            </li>
            <li>
              <Link
                href="/resources/articles/intro-to-bird-and-gun"
                className="text-[#E4803A] underline"
              >
                My game player - German Shorthair Pointer
              </Link>
              <p>
                As many hunters can tell you the outcome of your day is
                sometimes based on the amount of luck you have. With that said
                there are a few things to take into consideration. Weather
                conditions, time of year early/late season, patterns of the
                birds and dog work.
              </p>
            </li>
            <li>
              <Link
                href="/resources/articles/intro-to-bird-and-gun"
                className="text-[#E4803A] underline"
              >
                Hunting puppies, where to find them and how much to spend!!!
              </Link>
              <p>
                Spring is here, or so says the calendar. This seems to be the
                time that many people’s thoughts turn to buying a puppy in hopes
                of having a dog to hunt with next fall. Spring just seems to be
                the natural time to get a little guy or girl and spring is a
                time when it seems like there are a lot of pups out there to
                choose from.
              </p>
            </li>
            <li>
              <Link
                href="/resources/articles/intro-to-bird-and-gun"
                className="text-[#E4803A] underline"
              >
                Upland Bird Hunting
              </Link>
              <p>
                What comes to your mind when you hear the phrase "Upland Bird
                Hunting"? I suppose it depends where you were born and raised.
                If you're like me and come from the Midwest it means chasing
                Ruffed Grouse, Ringneck Pheasant, and Hungarian Partridge.
              </p>
            </li>
            <li>
              <Link
                href="/resources/articles/intro-to-bird-and-gun"
                className="text-[#E4803A] underline"
              >
                The Cost of Conservation
              </Link>
              <p>
                Before I owned land I use to think conservation was something
                somebody else did or was responsible for. Heck, I'm not even
                sure there is a common definition for what conservation is and
                means.
              </p>
            </li>
            <li>
              <Link
                href="/resources/articles/intro-to-bird-and-gun"
                className="text-[#E4803A] underline"
              >
                Your Next South Dakota Pheasant Hunting Vacation
              </Link>
              <p>
                So if you're like me, you grew up on saving for shells, license
                fees and gas to get you to your favorite pheasant hunting
                "spot". That "spot" may have been a road ditch, public ground,
                railroad track, bridge overpass or any other place that you
                might think a pheasant would hide.
              </p>
            </li>
            <li>
              <Link
                href="/resources/articles/intro-to-bird-and-gun"
                className="text-[#E4803A] underline"
              >
                Operation Pheasant Storm
              </Link>
              <p>
                If you've never been to South Dakota pheasant hunting, you might
                not understand the value of the tactics I'm about to describe.
                Having grown up on pheasant hunting in the state of Iowa, I got
                used to losing birds out the end when hunting with small groups
                and late season birds running up ahead with your shorthairs in
                hot pursuit.
              </p>
            </li>
            <li>
              <Link
                href="/resources/articles/intro-to-bird-and-gun"
                className="text-[#E4803A] underline"
              >
                Planning your South Dakota Pheasant Hunting Trip from A-Z
              </Link>
              <p>
                If you live anywhere in the U.S. and have never gone through the
                process of booking a pheasant hunting trip to the Dakota's, it
                may not be obvious to long time pheasant hunter as to just how
                to go about doing that.
              </p>
            </li>
            <li>
              <Link
                href="/resources/articles/intro-to-bird-and-gun"
                className="text-[#E4803A] underline"
              >
                South Dakota Pheasant Hunting
              </Link>
              <p>
                Never been to South Dakota pheasant hunting? You might not know
                what you are missing.
              </p>
            </li>
            <li>
              <Link
                href="/resources/articles/intro-to-bird-and-gun"
                className="text-[#E4803A] underline"
              >
                3452 Years of Conservation
              </Link>
              <p>
                Much controversy has come about recently from the nation's fuel
                issues, Iraq war and transition out of the 2002 Farm Bill and
                into the 2007 Farm Bill. We all want national security, low fuel
                prices and our boy's home from the war.
              </p>
            </li>
            <li>
              <Link
                href="/resources/articles/intro-to-bird-and-gun"
                className="text-[#E4803A] underline"
              >
                How to buy a South Dakota Pheasant Hunting License
              </Link>
              <p>
                Depending on your proficiency to utilize technology or your
                prevalence for rubbing elbows with native South Dakotan's, there
                is a way to buy a non-resident South Dakota Pheasant Hunting
                License that should suit your fancy.
              </p>
            </li>
            <li>
              <Link
                href="/resources/articles/intro-to-bird-and-gun"
                className="text-[#E4803A] underline"
              >
                Think pheasant hunting fees are outrageous?
              </Link>
              <p>
                Have you ever looked into a wild pheasant hunting trip for your
                friends and family in South Dakota? You may be surprised at what
                the costs are compared to a hunt at your local game farm.
              </p>
            </li>
          </ul>
        </section>
      </main>
      <OurPartners />
      <LatestNews />
      {/* <Footer /> */}
    </>
  );
}
