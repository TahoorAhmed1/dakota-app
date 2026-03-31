import catalogue1 from "@/assets/catalogue1.png";
import catalogue2 from "@/assets/catalogue2.png";
import catalogue3 from "@/assets/catalogue3.png";
import catalogue4 from "@/assets/catalogue4.png";
import catalogue5 from "@/assets/catalogue5.png";
import catalogue6 from "@/assets/catalogue6.png";
import Image from "next/image";

function ImagesCatalog() {
  const images = [catalogue1, catalogue2, catalogue3, catalogue4, catalogue5,catalogue6];
  return <div className="max-w-7xl mx-auto grid grid-cols-3 gap-10  pt-60 pb-20">
    {images.map((src, index)=>{ 
        return <Image key={index} src={src} alt="" className="w-full h-[330px] object-cover" />
    })}
  </div>;
}

export default ImagesCatalog;
