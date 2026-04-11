import partner1 from "@/assets/partner1.png";
import partner2 from "@/assets/partner2.png";
import partner3 from "@/assets/partner3.png";
import partner5 from "@/assets/partner4.png";
import Image from "next/image";
function OurPartners() {
  const image = [partner1, partner2, partner3, partner5];
  return (
    <div className="bg-[#F5F5F5] px-4 py-8 md:px-6 md:py-16">
      <div className="text-center">
        <p className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-2">Affiliates</p>
        <h2 className="text-3xl font-bold text-[#281703] sm:text-4xl">Our Partners</h2>
      </div>
      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-4 sm:mt-12 sm:gap-6 md:grid-cols-4 md:gap-10">
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
