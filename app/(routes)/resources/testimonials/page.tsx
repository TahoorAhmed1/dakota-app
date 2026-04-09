// app/resources/testimonials/page.tsx
"use client";

import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import OurPartners from "@/components/ourPartners";
import LatestNews from "@/components/NewsEvent";
import Link from "next/link";

const testimonials = [
  {
    name: "Robert Chen",
    role: "Corporate Event Organizer",
    text: "We brought 12 employees for a team-building pheasant hunt. The logistics were handled flawlessly, the food was excellent, and everyone had a great time. Highly recommend for groups!",
  },
  {
    name: "Mike Johnson",
    role: "Annual Hunter",
    text: "Our group of 8 hunters had an incredible time at Faulkton Pheasant Camp. The birds were plentiful and the accommodations were top-notch. UGUIDE made everything so easy to coordinate.",
  },
  {
    name: "Sarah & David Martinez",
    role: "Returning Customers",
    text: "We've been coming to UGUIDE for 5 years now. The camps are always clean, well-maintained, and the hunting grounds are some of the best in South Dakota. Chris and his team make every detail perfect.",
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

export default function TestimonialsPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        {/* Banner Section */}
        <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-[#E7DCCF] px-4 pb-12 pt-24 sm:min-h-[320px] sm:px-6 sm:pb-14 sm:pt-28 md:min-h-[360px]">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#241304] mb-4">Testimonials</h1>
            <nav className="text-sm text-[#281703]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#E4803A] flex items-center gap-2 justify-center">
                <HomeIcon />
                <span>Home</span>
              </Link>
              <span className="mx-2">›</span>
              <Link href="/resources" className="hover:text-[#E4803A]">Resources</Link>
              <span className="mx-2">›</span>
              <span>Testimonials</span>
            </nav>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">
        <div className="space-y-8">
          {testimonials.map((t, index) => (
            <div key={index} className="p-6 bg-[#F7F5F1] rounded-lg shadow-md">
              <p className="text-lg text-[#2b1a0f] mb-2">{t.text}</p>
              <p className="font-semibold text-[#E4803A]">{t.name}</p>
              <p className="text-sm text-[#31261d]">{t.role}</p>
            </div>
          ))}
        </div>
        </section>
      </main>
      <OurPartners />
      <LatestNews />
      <Footer />
    </>
  );
}