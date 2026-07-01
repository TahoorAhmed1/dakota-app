import type { StaticImageData } from "next/image";
import Image from "next/image";
import React from "react";
import FaulktonCamp1 from "@/assets/FaulktonCamp/1.jpg";
import FaulktonCamp2 from "@/assets/FaulktonCamp/2.jpg";
import FaulktonCamp3 from "@/assets/FaulktonCamp/3.jpg";
import FaulktonCamp4 from "@/assets/FaulktonCamp/4.jpeg";
import FaulktonCamp5 from "@/assets/FaulktonCamp/5.jpg";
import FaulktonCamp6 from "@/assets/FaulktonCamp/6.jpg";
import GunnerHeaven1 from "@/assets/GunnerHeaven/1.jpg";
import GunnerHeaven2 from "@/assets/GunnerHeaven/2.jpg";
import GunnerHeaven3 from "@/assets/GunnerHeaven/3.jpg";
import GunnerHeaven4 from "@/assets/GunnerHeaven/4.jpg";
import GunnerHeaven5 from "@/assets/GunnerHeaven/5.jpg";
import MeadowCreek1 from "@/assets/MeadowCreek/1.jpg";
import MeadowCreek2 from "@/assets/MeadowCreek/2.jpg";
import MeadowCreek3 from "@/assets/MeadowCreek/3.jpg";
import MeadowCreek4 from "@/assets/MeadowCreek/4.jpg";
import MeadowCreek5 from "@/assets/MeadowCreek/5.jpg";
import MeadowCreek6 from "@/assets/MeadowCreek/6.jpg";
import MeadowCreek7 from "@/assets/MeadowCreek/7.jpg";
import MeadowCreek8 from "@/assets/MeadowCreek/8.jpg";
import MeadowCreek10 from "@/assets/MeadowCreek/10.jpg";
import MeadowCreek11 from "@/assets/MeadowCreek/11.jpg";
import MeadowCreek12 from "@/assets/MeadowCreek/12.jpg";
import MeadowCreek13 from "@/assets/MeadowCreek/13.jpg";
import PhesantCamp1 from "@/assets/PhesantCamp/1.jpg";
import PhesantCamp2 from "@/assets/PhesantCamp/2.jpg";
import PhesantCamp3 from "@/assets/PhesantCamp/3.jpg";
import PhesantCamp4 from "@/assets/PhesantCamp/4.jpg";
import PhesantCamp5 from "@/assets/PhesantCamp/5.jpg";
import PhesantCamp6 from "@/assets/PhesantCamp/6.jpg";
import PhesantCamp7 from "@/assets/PhesantCamp/7.jpg";
import PhesantCamp8 from "@/assets/PhesantCamp/8.jpg";
import PhesantCamp9 from "@/assets/PhesantCamp/9.jpg";
import WestRiver1 from "@/assets/WestRiver/1.jpg";
import WestRiver2 from "@/assets/WestRiver/2.jpg";
import WestRiver3 from "@/assets/WestRiver/3.jpg";
import WestRiver4 from "@/assets/WestRiver/4.jpg";
import WestRiver5 from "@/assets/WestRiver/5.jpg";
import WestRiver6 from "@/assets/WestRiver/6.jpg";
import WestRiver7 from "@/assets/WestRiver/7.jpg";
import WestRiver8 from "@/assets/WestRiver/8.jpg";
import WestRiver9 from "@/assets/WestRiver/9.jpg";
import WestRiver10 from "@/assets/WestRiver/10.jpg";
import WestRiver11 from "@/assets/WestRiver/11.jpg";
import WestRiver12 from "@/assets/WestRiver/12.jpg";

const campImages: Record<string, StaticImageData[]> = {
  faulkton: [
    FaulktonCamp1,
    FaulktonCamp2,
    FaulktonCamp3,
    FaulktonCamp4,
    FaulktonCamp5,
    FaulktonCamp6,
  ],
  "gunners-haven": [
    GunnerHeaven1,
    GunnerHeaven2,
    GunnerHeaven3,
    GunnerHeaven4,
    GunnerHeaven5,
  ],
  "meadow-creek": [
    MeadowCreek1,
    MeadowCreek2,
    MeadowCreek3,
    MeadowCreek4,
    MeadowCreek5,
    MeadowCreek6,
    MeadowCreek7,
    MeadowCreek8,
    MeadowCreek10,
    MeadowCreek11,
    MeadowCreek12,
    MeadowCreek13,
  ],
  "pheasant-camp-lodge": [
    PhesantCamp1,
    PhesantCamp2,
    PhesantCamp3,
    PhesantCamp4,
    PhesantCamp5,
    PhesantCamp6,
    PhesantCamp7,
    PhesantCamp8,
    PhesantCamp9,
  ],
  "west-river": [
    WestRiver1,
    WestRiver2,
    WestRiver3,
    WestRiver4,
    WestRiver5,
    WestRiver6,
    WestRiver7,
    WestRiver8,
    WestRiver9,
    WestRiver10,
    WestRiver11,
    WestRiver12,
  ],
};

type GalleryProps = {
  params: {
    id: string;
  };
};

export default async function Gallery({ params }: GalleryProps) {
  const { id } = await params;
  const images = campImages[id] ?? [];

  return (
    <div className="min-h-screen  py-42 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#281703]">Camp Gallery</h1>
          <p className="mt-2 text-sm text-[#4b4b4b]">
            Showing photos for{" "}
            <span className="font-semibold">{id}</span>.
          </p>
        </div>

        {images.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-16 text-center text-sm text-gray-600">
            No gallery images found for this camp yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl shadow-lg group cursor-pointer"
              >
                <Image
                  src={image}
                  width={2000}
                  height={2000}
                  
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-72 object-cover transition duration-500 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
