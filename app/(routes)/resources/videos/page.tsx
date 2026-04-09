"use client";

import Header from "@/components/common/header";
import OurPartners from "@/components/ourPartners";
import LatestNews from "@/components/NewsEvent";
import Link from "next/link";

interface Video {
  title: string;
  videoId: string;
  description?: string;
  url: string;
}

export default function VideosPage() {
  // Video data with direct YouTube URLs
  const videos: Video[] = [
    { title: "South Dakota Pheasant Hunt 2018", videoId: "uJdlXdw7Qdg", url: "https://youtu.be/uJdlXdw7Qdg", description: "Action-packed pheasant hunting in South Dakota." },
    { title: "South Dakota's Pheasant Hunt Getaway", videoId: "32yWJZECW5k", url: "https://youtu.be/32yWJZECW5k", description: "Experience the ultimate pheasant hunting getaway." },
    { title: "UGUIDE's Meadow Creek Pheasant Camp Movie 2", videoId: "pwv4_fKu2Po", url: "https://youtu.be/pwv4_fKu2Po", description: "Meadow Creek camp highlights and hunting action." },
    { title: "Meadow Creek Pheasant Camp Movie 1 - GoPro", videoId: "v4toDoyDtAU", url: "https://youtu.be/v4toDoyDtAU", description: "GoPro footage from Meadow Creek." },
    { title: "UGUIDE's Faulkton Pheasant Camp", videoId: "fiHRMGa8ATk", url: "https://youtu.be/fiHRMGa8ATk", description: "Explore the Faulkton camp experience." },
    { title: "UGUIDE's Pheasant Camp Lodge South Dakota", videoId: "_F078tRzuow", url: "https://youtu.be/_F078tRzuow", description: "Lodge tour and hunting scenes." },
    { title: "UGUIDE West River Adventures Pheasant Camp", videoId: "9a93ewFtOKs", url: "https://youtu.be/9a93ewFtOKs", description: "West River adventures and bird action." },
    { title: "Gunners Haven Pheasant Camp Video", videoId: "HuAeIAM9OK8", url: "https://youtu.be/HuAeIAM9OK8", description: "Gunners Haven camp overview." },
    { title: "2013 Flushing Bar South Dakota Pheasants UGUIDE", videoId: "sRIe81m4SWM", url: "https://youtu.be/sRIe81m4SWM", description: "Classic flushing action from 2013." },
  ];

  return (
    <>
      <Header />
      <main className="flex flex-col">
        {/* Banner Section */}
        <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-[#e8ded1] px-4 pb-12 pt-24 sm:min-h-[320px] sm:px-6 sm:pb-14 sm:pt-28 md:min-h-[360px]">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#241304] mb-4">
              UGUIDE Hunting & Camp Videos
            </h1>
            <nav className="text-sm text-[#281703]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#E4803A]">Home</Link>
              <span className="mx-2">›</span>
              <Link href="/resources" className="hover:text-[#E4803A]">Resources</Link>
              <span className="mx-2">›</span>
              <span>Videos</span>
            </nav>
          </div>
        </section>

        {/* Video Gallery Section */}
        <section className="bg-[#e8ded1] pb-12 md:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Intro text */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#241304] mb-4">
                Watch the Action
              </h2>
              <div className="w-20 h-1 bg-[#E4803A] mx-auto rounded-full mb-6"></div>
              <p className="text-gray-600 text-lg">
                Experience UGUIDE pheasant hunts, impressive dog work, and our wildlife management practices through these exciting videos.
              </p>
            </div>

            {/* Video Grid - each card is a link to YouTube */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <a
                  key={video.videoId}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                    {/* Thumbnail Container */}
                    <div className="relative aspect-video bg-gray-800 overflow-hidden">
                      <img
                        src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
                        }}
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-[#E4803A] rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:bg-[#cc6b2c]">
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
                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-semibold tracking-wide">
                        UGUIDE
                      </div>
                      
                      {/* Watch indicator */}
                      <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded text-white text-xs">
                        ▶ Watch
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5 flex-grow">
                      <h3 className="text-lg font-semibold text-[#241304] mb-2 line-clamp-2 group-hover:text-[#E4803A] transition-colors">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-gray-500 text-sm line-clamp-2">
                          {video.description}
                        </p>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <OurPartners />
      <LatestNews />
    </>
  );
}
