import catalogue1 from "@/assets/catalogue1.png";
import catalogue2 from "@/assets/catalogue2.png";
import catalogue3 from "@/assets/catalogue3.png";
import catalogue4 from "@/assets/catalogue4.png";
import catalogue5 from "@/assets/catalogue5.png";
import catalogue6 from "@/assets/catalogue6.png";
import Image from "next/image";

function ImagesCatalog() {
  const images = [catalogue1, catalogue2, catalogue3, catalogue4, catalogue5,catalogue6];
  return <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 pb-14 pt-20 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 md:gap-8 md:px-6 md:pb-20 md:pt-40 lg:pt-60">
    {images.map((src, index)=>{ 
        return <Image key={index} src={src} alt="Gallery item" className="h-60 w-full rounded-xl object-cover sm:h-70 md:h-82.5" />
    })}
  </div>;
}

export default ImagesCatalog;
