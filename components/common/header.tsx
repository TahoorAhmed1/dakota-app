"use client";

import logo from "@/assets/logo 1.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "AVAILABILITY", href: "/availability" },
  { label: "CONTACT", href: "/contact" },
  { label: "QUOTE-RESERVE", href: "/quote-reserve" },
  { label: "CAMPS", href: "/camps" },
  { label: "MAP", href: "/map" },
  { label: "RATES", href: "/rates" },
  { label: "DISCOUNTS", href: "/discounts" },
  { label: "RESOURCES", href: "/resources" },
];

function Header() {
  const pathname = usePathname();

  return (
    <header className="absolute z-20 flex w-full justify-center py-10">
      <div className="flex w-[90%] items-center justify-between rounded-xl bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center">
          <Image
            src={logo}
            alt="U Guide"
            className="h-12 w-auto object-contain"
          />
        </div>

        <nav className="flex items-center gap-6 text-[13px] font-semibold tracking-wide">
          {menu.map((item) => {
            const isActive =
              item.href !== "#" && pathname === item.href;

            if (item.href === "#") {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-700 transition-colors hover:text-orange-500"
                >
                  {item.label}
                  {item.label === "RESOURCES" && (
                    <span className="ml-1">▾</span>
                  )}
                </a>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`transition-colors ${
                  isActive
                    ? "text-orange-500"
                    : "text-gray-700 hover:text-orange-500"
                }`}
              >
                {item.label}
                {item.label === "RESOURCES" && (
                  <span className="ml-1">▾</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default Header;