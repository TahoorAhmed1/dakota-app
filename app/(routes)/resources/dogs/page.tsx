// app/resources/dogs/page.tsx
"use client";

import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import OurPartners from "@/components/ourPartners";
import LatestNews from "@/components/NewsEvent";
import Link from "next/link";

export default function DogsPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        {/* Banner Section */}
        <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-[#E7DCCF] px-4 pb-12 pt-24 sm:min-h-[320px] sm:px-6 sm:pb-14 sm:pt-28 md:min-h-[360px]">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#241304] mb-4">
              Gun Dog Tips, Training, Articles and How-to
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
              <span>Dogs</span>
            </nav>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
          <ul className="list-disc pl-5 space-y-2 text-[#31261d]">
            <li>
              <Link
                href="/resources/dogs/finding-a-breeder"
                className="text-[#E4803A] underline"
              >
                Finding a Breeder
              </Link>
            </li>
            <p>
              Now that I have selected a breed, how do I find the right breeder?
              Once you’ve narrowed down your potential list of breeds to one or
              two, it’s time to search for a breeder. Don’t be afraid to ask
              these questions to protect your investment.
            </p>
            <li>
              <Link
                href="/resources/dogs/pre-season-conditioning"
                className="text-[#E4803A] underline"
              >
                Pre-Season Conditioning – Health & More Birds
              </Link>
            </li>
            <p>
              With the hunting season just around the corner, now is a good time
              to talk about conditioning your dog for performance during early
              hunting. We wouldn’t think about going out and running ten miles
              one day without some prior physical training and it doesn’t make
              any more sense to expect it from our dogs. By getting our dogs in
              shape before the season, we go a long way toward ensuring a
              healthier and more effective hunting companion.
            </p>
            <li>
              <Link
                href="/resources/dogs/retriever-marking"
                className="text-[#E4803A] underline"
              >
                Get ready for your U-Guide Hunt, can your dog mark?
              </Link>
            </li>
            <p>
              Just the mention of a SD pheasant hunt is enough to send the mind of a bird hunter racing with thoughts of almost a fantasy experience. It will fill an adult with a child like giddiness. The experiences of a South Dakota hunt may range from staying at a farm house of a buddies grandparent to making reservations at high end lodge.
            </p>
            <li>
              <Link
                href="/resources/dogs/intro-to-bird-and-gun"
                className="text-[#E4803A] underline"
              >
                INTRO TO BIRD AND GUN
              </Link>
            </li>
            <p>
              For a puppy or young dog the most important thing to get him or her on the road to being a gundog is introduction to birds. Every year just after the hunting season starts I have someone call me about their perfect dog that wouldn?t pick up the birds on opening day.
            </p>
            <li>
              <Link
                href="/resources/dogs/hunting-dog-training-tips"
                className="text-[#E4803A] underline"
              >
                Hunting Dog Training Tips
              </Link>
            </li>
            <p>
              Early spring finds many bird dog guys asking what do I do next? These people are consumed by the thought of training their upland bird dog. There certainly are great amounts of joy that can be obtained from training you own gun dog, but extreme frustration can also be experienced if a person rushes or is uncertain of proper training techniques.
            </p>
            <li>
              <Link
                href="/resources/dogs/warm-the-water"
                className="text-[#E4803A] underline"
              >
                Warm the Water: Hunting Dog Training Tip G1
              </Link>
            </li>
            <p>
              The calendar says that spring is here; unfortunately in many of the northern states Global Warming Flakes (also known as snow flakes) are still hitting the ground. The rivers are already flowing and many of the small ponds are starting to open from the grip of over 4 months of ice.
            </p>
            <li>
              <Link
                href="/resources/dogs/puppy-name-selection"
                className="text-[#E4803A] underline"
              >
                Your New Puppy - Name Selection
              </Link>
            </li>
            <p>
              As you ride home from the final visit at the breeders, toting puppy in hand you now face one of the biggest challenges you will ever face. This decision is one that you will ultimately have to live with for the remainder of the dog’s life. What are you going to name this fine specimen of a bird dog?
            </p>
            <li>
              <Link
                href="/resources/dogs/upland-bird-dog-selection"
                className="text-[#E4803A] underline"
              >
                Upland Bird Dog Puppy Selection
              </Link>
            </li>
            <p>
              Are you tired of hunting birds all day long without having a single flush? Want an easier way to find the few downed birds that you do get an opportunity at? Would you like to have your own bird finding pointing dog? If the answer to any of these questions is yes, then it is time to consider getting your own pointing dog puppy.
            </p>
            <li>
              <Link
                href="/resources/dogs/german-shorthair-pointer"
                className="text-[#E4803A] underline"
              >
                My Game Player - German Shorthair Pointer
              </Link>
            </li>
            <p>
              As many hunters can tell you the outcome of your day is sometimes based on the amount of luck you have. With that said there are a few things to take into consideration. Weather conditions, time of year early/late season, patterns of the birds and dog work.
            </p>
            <li>
              <Link
                href="/resources/dogs/hunting-puppies"
                className="text-[#E4803A] underline"
              >
                Hunting Puppies, Where to Find Them and How Much to Spend
              </Link>
              <p>Spring is here, or so says the calendar. This seems to be the time that many people’s thoughts turn to buying a puppy in hopes of having a dog to hunt with next fall. Spring just seems to be the natural time to get a little guy or girl and spring is a time when it seems like there are a lot of pups out there to choose from.</p>
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
