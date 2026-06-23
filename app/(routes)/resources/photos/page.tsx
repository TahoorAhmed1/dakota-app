"use client";

import { useEffect, useState } from "react";
import LatestNews from "@/components/NewsEvent";
import Link from "next/link";
import ImagesCatalog from "@/components/common/images-catalog";

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

        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
       

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
                 
                  </article>
                ))}
              </div>
            )}
        </section>
      </main>
      <LatestNews />
    </>
  );
}
