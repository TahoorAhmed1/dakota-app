// app/resources/videos/page.tsx
"use client";

import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import OurPartners from "@/components/ourPartners";
import LatestNews from "@/components/NewsEvent";
import Link from "next/link";

export default function VideosPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        {/* Banner Section */}
        <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-[#E7DCCF] px-4 pb-12 pt-24 sm:min-h-[320px] sm:px-6 sm:pb-14 sm:pt-28 md:min-h-[360px]">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#241304] mb-4">UGUIDE Hunting & Camp Videos</h1>
            <nav className="text-sm text-[#281703]" aria-label="Breadcrumb">
              <Link href="/home" className="hover:text-[#E4803A]">Home</Link>
              <span className="mx-2">›</span>
              <Link href="/resources" className="hover:text-[#E4803A]">Resources</Link>
              <span className="mx-2">›</span>
              <span>Videos</span>
            </nav>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">

        <h1 className="mb-10 text-[#31261d] text-3xl">
          Watch action from UGUIDE pheasant hunts, dog work, and our wildlife management practices.
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "South Dakota Pheasant Hunt 2018", src: "https://youtu.be/uJdlXdw7Qdg?si=LV2CDtM1n6LZtfmi", videoId: "uJdlXdw7Qdg" },
            { title: "South Dakota's Pheasant Hunt Getaway", src: "https://youtu.be/32yWJZECW5k?si=4dQoigw_Ehud0Xzn", videoId: "32yWJZECW5k" },
            { title: "UGUIDE's Meadow Creek Pheasant Camp Movie 2", src: "https://youtu.be/pwv4_fKu2Po?si=6GOQfCyUb7dlLVmQ", videoId: "pwv4_fKu2Po" },
            { title: "Meadow Creek Pheasant Camp Movie 1 - GoPro", src: "https://youtu.be/v4toDoyDtAU?si=yXUsebiD09aFuz4B", videoId: "v4toDoyDtAU" },
            { title: "UGUIDE's Faulkton Pheasant Camp", src: "https://youtu.be/fiHRMGa8ATk?si=5M884FThv6iG9vOk", videoId: "fiHRMGa8ATk" },
            { title: "UGUIDE's Pheasant Camp Lodge South Dakota", src: "https://youtu.be/_F078tRzuow?si=mAn4hdcryMu-n9mA", videoId: "_F078tRzuow" },
            { title: "UGUIDE West River Adventures Pheasant Camp", src: "https://youtu.be/9a93ewFtOKs?si=kN69GJRay9YisGhA", videoId: "9a93ewFtOKs" },
            { title: "Gunners Haven Pheasant Camp Video", src: "https://youtu.be/HuAeIAM9OK8?si=Nn9lM0kkSwotRhf4", videoId: "HuAeIAM9OK8" },
            { title: "2013 Flushing Bar South Dakota Pheasants UGUIDE", src: "https://youtu.be/sRIe81m4SWM?si=cs4NSu-LUoleIB62", videoId: "sRIe81m4SWM" },
          ].map((video) => (
            <a
              key={video.videoId}
              href={video.src}
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                {/* Thumbnail Image */}
                <div className="aspect-video bg-black relative overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg
                        className="w-8 h-8 text-white ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* UGUIDE Badge */}
                  <div className="absolute top-3 left-3 bg-black/70 px-3 py-1 rounded text-white text-sm font-semibold">
                    UGUIDE
                  </div>
                </div>
                
                {/* Title */}
                <div className="p-4 h-18">
                  <h3 className="text-base font-semibold text-[#241304] line-clamp-2 group-hover:text-[#E4803A] transition-colors">
                    {video.title}
                  </h3>
                </div>
              </div>
            </a>
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