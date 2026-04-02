import partner1 from "@/assets/partner1.png";
import partner2 from "@/assets/partner2.png";
import partner3 from "@/assets/partner3.png";
import partner5 from "@/assets/partner4.png";
import Image from "next/image";
function OurPartners() {
  const image = [partner1, partner2, partner3, partner5];
  return (
    <div className="bg-[#F5F5F5] py-10 px-4">
      <h1 className="text-[#281703] text-center text-3xl font-bold">Our Partners</h1>
      <div className="max-w-6xl mx-auto mt-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
        {image.map((src, index) => {
          return (
            <Image key={index} src={src} alt="Partner logo" className="w-full h-full object-contain" />
          );
        })}
      </div>
    </div>
  );
}

export default OurPartners;
