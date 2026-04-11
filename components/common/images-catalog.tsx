import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function ImagesCatalog() {
  const images = await prisma.imageCatalog.findMany({
    where: { isPublished: true },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 py-10 pb-10 gap-4 px-4 md:pb-14  sm:grid-cols-2 md:grid-cols-3 md:gap-8 md:px-6 md:pt-64 md:min-h-[500px]">
      {images.length === 0 ? (
        <p className="text-center col-span-full">No images found</p>
      ) : (
        images.map((image) => (
          <Image
            key={image.id}
            width={1000}
            height={1000}
            src={image.url}
            alt={image.alt || "Catalog image"}
            className="h-60 w-full rounded-xl object-cover md:h-[330px]"
          />
        ))
      )}
    </div>
  );
}