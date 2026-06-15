// app/resources/photos/page.tsx
"use client";

import { useEffect, useState } from "react";
import LatestNews from "@/components/NewsEvent";
import Link from "next/link";

type GalleryImage = {
  id: string;
  url: string;
  alt: string;
  caption: string;
  category: string;
  width: number;
  height: number;
};

export default function PhotosPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGallery() {
      try {
        const response = await fetch("/api/gallery", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Unable to load gallery images.");
        }

        const payload = (await response.json()) as GalleryImage[];
        setImages(payload);
      } catch (err) {
        console.error("Gallery fetch failed:", err);
        setError("Unable to load photos at this time. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    loadGallery();
  }, []);

  return (
    <>
      <main className="flex flex-col">
        {/* Banner Section */}
        <section className="relative flex min-h-70 items-center justify-center overflow-hidden bg-[#E7DCCF] px-4 pb-12 pt-24 sm:min-h-80 sm:px-6 sm:pb-14 sm:pt-28 md:min-h-90">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#241304] mb-4">
              UGUIDE South Dakota Pheasant Hunting Photo Gallery
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
              <span>Photos</span>
            </nav>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">
          <p className="text-[#31261d] italic mb-6">
            Browse recent photos from our galleries and jump into the categories that interest you.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {[
              { title: "Unguided", href: "/resources/photos/unguided" },
              { title: "Self Guided", href: "/resources/photos/self-guided" },
              { title: "Prescribed Burns", href: "/resources/photos/prescribed-burns" },
              { title: "Hatch!", href: "/resources/photos/hatch" },
              { title: "UGUIDE Food Cover Plots", href: "/resources/photos/food-cover-plots" },
              { title: "Conservation Farming 2018", href: "/resources/photos/conservation-farming-2018" },
              { title: "Gunner's Haven", href: "/resources/photos/gunners-haven" },
              { title: "Pheasant Hunting", href: "/resources/photos/pheasant-hunting" },
              { title: "Covers", href: "/resources/photos/covers" },
              { title: "Waterfowl Hunting", href: "/resources/photos/waterfowl" },
              { title: "Pheasant Camp Lodge", href: "/resources/photos/pheasant-camp-lodge" },
            ].map((gallery) => (
              <div key={gallery.title} className="p-4 border rounded shadow-sm hover:shadow-md">
                <h2 className="font-semibold text-lg mb-2">{gallery.title}</h2>
                <Link href={gallery.href} className="text-[#E4803A] underline">
                  View Gallery
                </Link>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#281703] mb-4">Featured Photos</h2>
            {isLoading ? (
              <p className="text-sm text-[#31261d]">Loading photos…</p>
            ) : error ? (
              <p className="text-sm text-[#b02a37]">{error}</p>
            ) : images.length === 0 ? (
              <p className="text-sm text-[#31261d]">No photos are available at this time.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.slice(0, 12).map((image) => (
                  <article key={image.id} className="overflow-hidden rounded-3xl border bg-white shadow-sm">
                    <img
                      src={image.url}
                      alt={image.alt || image.caption || "UGUIDE photo"}
                      className="h-72 w-full object-cover"
                    />
                    <div className="p-4">
                      <p className="text-sm font-semibold text-[#281703]">{image.caption || image.category}</p>
                      <p className="text-xs text-[#4d433d]">{image.category}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <LatestNews />
    </>
  );
}
