import logo from "@/assets/logo 1.png";
import Image from "next/image";

function Header() {
  const menu = [
    "HOME",
    "ABOUT",
    "AVAILABILITY",
    "CONTACT",
    "QUOTE-RESERVE",
    "CAMPS",
    "MAP",
    "RATES",
    "DISCOUNTS",
    "RESOURCES",
  ];

  return (
    <header className="w-full absolute z-10 py-10 flex justify-center">
      <div className="w-[90%] bg-white rounded-xl shadow-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Image src={logo} alt="U Guide" className="h-12 object-contain" />
        </div>
        <nav className="flex items-center gap-6 text-[13px] font-semibold tracking-wide">
          {menu.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`transition-colors ${
                item === "ABOUT"
                  ? "text-orange-500"
                  : "text-gray-700 hover:text-orange-500"
              }`}
            >
              {item}
              {item === "RESOURCES" && <span className="ml-1">▾</span>}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;