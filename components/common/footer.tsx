import Image from "next/image";
import logo from "@/assets/logo-black.png";

function Footer() {
  return (
    <footer className="Footerback relative bg-cover bg-center py-4 text-black">
     
      <div className="relative z-10 max-w-6xl mx-auto px-6 ">

        <div className="flex flex-col items-center text-center">
          <Image src={logo} alt="U Guide" className=" mb-3 mt-20" />
         
          <div className="flex gap-4 mt-2">
            {["f", "t", "i", "y"].map((icon, i) => (
              <div
                key={i}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-black text-white text-sm cursor-pointer"
              >
                {icon}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-black/40 my-10"></div>

        <div className="grid md:grid-cols-3 gap-10">

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <p className="text-sm leading-7">
              021 Hollywood Boulevard, LA <br />
              customer@example.com <br />
              (021) 345-6789
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>Availability</li>
              <li>Quote-Reserve</li>
              <li>UGUIDE Pheasant Outlook</li>
              <li>Day Use</li>
              <li>Rates</li>
              <li>Discounts</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Newsletters</h3>
            <p className="text-sm mb-4">
              Sign up your email and get news and updates
            </p>

            <div className="flex bg-white rounded-md overflow-hidden w-full max-w-sm">
              <input
                type="email"
                placeholder="Your email here"
                className="flex-1 px-4 py-3 text-sm outline-none"
              />
              <button className="bg-[#3b220c] text-white px-6 text-sm font-semibold">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>


    
      </div>
          <p className="text-center text-sm  mt-8">
          © 2026 UGUIDE South Dakota Pheasant Hunting®
        </p>
    </footer>
  );
}

export default Footer;