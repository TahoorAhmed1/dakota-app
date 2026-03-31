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
      <section className="CampsImage relative flex h-screen min-h-[640px] items-center justify-center">
        <div className="absolute inset-0 bg-[#f1c08b]/35" />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          <h1 className="text-[58px] font-bold uppercase leading-none text-[#281703] md:text-[82px]">
            {camp.name}
          </h1>

          <div className="mt-6 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#281703]">
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

        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2">
          <div className="h-20 w-full rounded-t-[100%] border-t-[4px] border-[#281703] bg-[#E7DCCF]" />
        </div>
      </section>

      {/* Camp Details */}
      <section className="bg-[#E7DCCF] px-6 pb-16 pt-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-[34px] font-bold text-[#281703] mb-6">{camp.name}</h2>
              <p className="text-[#2f2b27] text-lg mb-6">{camp.description}</p>

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
                <h3 className="text-xl font-bold text-[#281703] mb-4">Amenities</h3>
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
                  className="inline-block bg-[#F16724] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#e55a1f] transition-colors"
                >
                  Request Quote
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              {camp.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${camp.name} - Image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-md"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}