import { create } from "zustand";

export type ImageCatalogImage = {
  id: string;
  url: string;
  alt: string;
  caption: string;
  category: string;
  width: number;
  height: number;
};

type ImageCatalogState = {
  // Catalog images
  catalogImages: ImageCatalogImage[];
  catalogLoading: boolean;

  // Actions
  fetchCatalogImages: () => Promise<void>;
};

export const useImageCatalogStore = create<ImageCatalogState>((set, get) => ({
  catalogImages: [],
  catalogLoading: false,

 fetchCatalogImages: async () => {
  try {
    set({ catalogLoading: true });

    const res = await fetch("/api/image-catalog",{  cache: "no-store"});
    const data = await res.json();
    console.log('data', data)
    set({ catalogImages: data, catalogLoading: false });
  } catch (error) {
    console.error(error);
    set({ catalogLoading: false });
  }
}
}));
