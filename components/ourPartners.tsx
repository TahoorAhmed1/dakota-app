import partner1 from "@/assets/partner1.png";
import partner2 from "@/assets/partner2.png";
import partner3 from "@/assets/partner3.png";
import partner5 from "@/assets/partner4.png";
import Image from "next/image";
function OurPartners() {
  const image = [partner1, partner2, partner3, partner5];
  return (
    <div className="bg-[#F5F5F5] px-4 py-10 sm:px-6">
      <h1 className="text-center text-2xl font-bold text-[#281703] sm:text-3xl">Our Partners</h1>
      <div className="mx-auto mt-6 grid max-w-6xl grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 md:gap-10">
        {image.map((src, index) => {
          return (
            <div key={index} className="rounded-xl bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
              <Image src={src} alt="Partner logo" className="h-16 w-full object-contain sm:h-20" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OurPartners;
