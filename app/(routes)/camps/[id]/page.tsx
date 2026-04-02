import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const campDetails = {
  "faulkton-pheasant-camp": {
    name: "Faulkton Pheasant Camp",
    location: "Faulkton, South Dakota",
    county: "Faulk County",
    description: "Located in the heart of pheasant country, Faulkton Pheasant Camp offers premium hunting grounds with excellent bird populations.",
    capacity: "6-10 hunters",
    amenities: ["Modern lodge", "Hot showers", "Full kitchen", "Guided hunts", "Dog training areas"],
    images: ["/assets/catalogue1.png", "/assets/catalogue2.png"]
  },
  "gunners-haven-pheasant-camp": {
    name: "Gunner's Haven Pheasant Camp",
    location: "Selby, South Dakota",
    county: "Walworth County",
    description: "A premier hunting destination with vast open fields and diverse terrain perfect for pheasant hunting.",
    capacity: "8-12 hunters",
    amenities: ["Luxury cabins", "Professional guides", "Dog boarding", "Equipment rental", "Evening meals"],
    images: ["/assets/catalogue3.png", "/assets/catalogue4.png"]
  },
  "meadow-creek-pheasant-camp": {
    name: "Meadow Creek Pheasant Camp",
    location: "Meadow, South Dakota",
    county: "Perkins County",
    description: "Nestled along scenic creeks, this camp offers both excellent hunting and beautiful natural surroundings.",
    capacity: "6-8 hunters",
    amenities: ["Riverfront location", "Fishing access", "Comfortable lodging", "Experienced guides", "Campfire areas"],
    images: ["/assets/catalogue5.png", "/assets/catalogue6.png"]
  },
  "pheasant-camp-lodge": {
    name: "Pheasant Camp Lodge",
    location: "Andes, South Dakota",
    county: "Charles Mix County",
    description: "A traditional hunting lodge with modern amenities, perfect for groups seeking authentic South Dakota pheasant hunting.",
    capacity: "10-15 hunters",
    amenities: ["Large dining hall", "Game cleaning facility", "Storage lockers", "Transportation service", "Laundry facilities"],
    images: ["/assets/catalogue7.png", "/assets/catalogue8.png"]
  },
  "west-river-adventures-pheasant-camp": {
    name: "West River Adventures Pheasant Camp",
    location: "Timberlake, SD",
    county: "Dewey County",
    description: "Experience the wild beauty of the West River region with top-notch pheasant hunting and outdoor adventures.",
    capacity: "8-10 hunters",
    amenities: ["Scenic views", "Adventure activities", "Modern facilities", "Expert local guides", "Wildlife viewing"],
    images: ["/assets/catalogue9.png", "/assets/catalogue1.png"]
  }
};

export default function CampDetailPage({ params }: { params: { id: string } }) {
  const camp = campDetails[params.id as keyof typeof campDetails];

  if (!camp) {
    notFound();
  }

  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="CampsImage relative flex min-h-[340px] items-center justify-center px-4 pb-20 pt-24 sm:min-h-[430px] sm:px-6 sm:pb-24 sm:pt-28 md:min-h-[520px] lg:min-h-[580px]">
        <div className="absolute inset-0 bg-[#f1c08b]/35" />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="text-[40px] font-bold uppercase leading-none text-[#281703] sm:text-[50px] md:text-[68px] lg:text-[82px]">
            {camp.name}
          </h1>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#281703] sm:mt-6 sm:gap-3 sm:text-[12px]">
            <Link
              href="/"
              className="flex items-center gap-2 transition-colors hover:text-[#F16724]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3.172 3 10.2V21h6v-6h6v6h6V10.2l-9-7.028Z" />
              </svg>
              <span>Home</span>
            </Link>
            <span>›</span>
            <Link href="/camps" className="transition-colors hover:text-[#F16724]">Camps</Link>
            <span>›</span>
            <span>{camp.name}</span>
          </div>
        </div>

        {/* <div className="absolute bottom-0 left-0 right-0 translate-y-1/2">
          <div className="h-20 w-full rounded-t-[100%] border-t-[4px] border-[#281703] bg-[#E7DCCF]" />
        </div> */}
      </section>

      {/* Camp Details */}
      <section className="bg-[#E7DCCF] px-4 pb-16 pt-14 sm:px-6 sm:pt-18">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-10 md:grid-cols-2 md:gap-12">
            <div>
              <h2 className="mb-6 text-[30px] font-bold text-[#281703] sm:text-[34px]">{camp.name}</h2>
              <p className="mb-6 text-base text-[#2f2b27] sm:text-lg">{camp.description}</p>

              <div className="space-y-4">
                <div>
                  <strong>Location:</strong> {camp.location}
                </div>
                <div>
                  <strong>County:</strong> {camp.county}
                </div>
                <div>
                  <strong>Capacity:</strong> {camp.capacity}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="mb-4 text-xl font-bold text-[#281703]">Amenities</h3>
                <ul className="space-y-2">
                  {camp.amenities.map((amenity, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-[#F16724]">✓</span>
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href="/quote-reserve"
                  className="inline-block rounded-md bg-[#F16724] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#e55a1f]"
                >
                  Request Quote
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              {camp.images.map((image, index) => (
                <div key={image} className="relative overflow-hidden rounded-md">
                  <Image
                    src={image}
                    alt={`${camp.name} - Image ${index + 1}`}
                    width={960}
                    height={640}
                    className="h-56 w-full object-cover sm:h-64 md:h-72"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}