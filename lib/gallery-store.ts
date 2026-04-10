import { create } from "zustand";

export type GalleryImage = {
  id: string;
  url: string;
  alt: string;
  caption: string;
  category: string;
  width: number;
  height: number;
};

type GalleryState = {

  catalogImages: GalleryImage[];
  catalogLoading: boolean;

  fetchCatalogImages: () => Promise<void>;
};

export const useGalleryStore = create<GalleryState>((set, get) => ({


  catalogImages: [],
  catalogLoading: false,



  fetchCatalogImages: async () => {
    set({ catalogLoading: true });
    try {
      const res = await fetch("/api/image-catalog", { cache: "no-store" });
      console.log('GalleryStore: API response status:', res.status);
      if (res.ok) {
        const images: GalleryImage[] = await res.json();
        console.log('GalleryStore: Received images:', images);
        set({ catalogImages: images });
      } else {
        console.error('GalleryStore: API call failed with status:', res.status);
      }
    } catch (err) {
      console.warn("GalleryStore: Failed to fetch catalog images:", err);
    } finally {
      set({ catalogLoading: false });
    }
  },


})
);