import partner1 from "@/assets/partner1.png";
import partner2 from "@/assets/partner2.png";
import partner3 from "@/assets/partner3.png";
import partner5 from "@/assets/partner4.png";
import Image from "next/image";
function OurPartners() {
  const image = [partner1, partner2, partner3, partner5];
  return (
    <div className="bg-[#F5F5F5] py-10">
      <h1 className="text-[#281703] text-center text-2xl font-bold">Our Partners</h1>
      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-10 ">
        {image.map((src) => {
          return (
            <Image src={src} alt="" className="w-full h-full object-contain" />
          );
        })}
      </div>
    </div>
  );
}

export default OurPartners;
