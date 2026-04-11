"use client";

import logo from "@/assets/logo 1.png";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

type MenuItem = {
  label: string;
  href: string;
  dropdown?: Array<{ label: string; href: string; desc: string }>;
};

const menu: MenuItem[] = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "AVAILABILITY", href: "/availability" },
  { label: "CONTACT", href: "/contact" },
  { label: "QUOTE-RESERVE", href: "/quote-reserve" },
  { label: "CAMPS & MAP", href: "/camps" },
  { label: "DISCOUNTS", href: "/discounts" },
  {
    label: "RESOURCES",
    href: "/resources",
    dropdown: [
      {
        label: "Rates & Pricing",
        href: "/rates",
        desc: "Package rates & booking info",
      },
      { label: "NEWS", href: "/news", desc: "Latest news & updates" },

      {
        label: "Policies & Info",
        href: "/resources",
        desc: "Hunting policies, FAQ & more",
      },
    ],
  },
];

function Header() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  return (
    <>
      <header className="absolute z-30 flex w-full justify-center px-3 py-4 sm:px-5 sm:py-6 lg:py-10">
        <div className="flex w-full max-w-345 items-center justify-between rounded-2xl bg-white/96 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur sm:px-6 lg:w-[90%] lg:px-7">
          <Link
            href="/"
            className="flex items-center"
            aria-label="Go to homepage"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Image
              src={logo}
              alt="U Guide"
              className="h-9 w-auto object-contain sm:h-12 lg:h-16"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-6 text-[13px] font-semibold tracking-wide xl:flex">
            {menu.map((item) => {
              const isActive = pathname === item.href;
              const hasDropdown = Boolean(item.dropdown?.length);

              if (hasDropdown) {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-1 transition-colors ${
                        isActive
                          ? "text-orange-500"
                          : "text-gray-700 hover:text-orange-500"
                      }`}
                    >
                      {item.label}
                      <span className="text-[10px]">▾</span>
                    </Link>
                    {openDropdown === item.label && (
                      <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3" onMouseLeave={() => setOpenDropdown(null)}>
                        <div className="min-w-56 overflow-hidden rounded-xl border border-[#e9e2db] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
                          {item.dropdown!.map((child) => (
                            <Link
                              key={child.href + child.label}
                              href={child.href}
                              className="block border-b border-[#f0e8df] px-5 py-3.5 transition-colors last:border-0 hover:bg-[#fdf5ee]"
                            >
                              <p className="text-xs font-bold text-[#281703]">
                                {child.label}
                              </p>
                              <p className="mt-0.5 text-[11px] text-[#281703]/55">
                                {child.desc}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#e9e2db] bg-[#f8f5f1] text-[#2d1a08] shadow-sm transition hover:bg-[#f1e6da] xl:hidden"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isSidebarOpen}
            aria-controls="mobile-navigation"
          >
            <span className="flex w-5 flex-col gap-1.5">
              <span className="h-0.5 w-full rounded-full bg-current" />
              <span className="h-0.5 w-full rounded-full bg-current" />
              <span className="h-0.5 w-full rounded-full bg-current" />
            </span>
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-black/45 transition-opacity duration-300 xl:hidden ${
          isSidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="mobile-navigation"
        className={`fixed right-0 top-0 z-50 flex h-full w-[min(84vw,340px)] flex-col bg-white px-5 pb-6 pt-5 text-black shadow-[-12px_0_40px_rgba(0,0,0,0.28)] transition-transform duration-300 xl:hidden ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isSidebarOpen}
      >
        <div className="mb-8 flex items-center justify-between">
          <Image
            src={logo}
            alt="U Guide"
            className="h-9 w-auto object-contain"
          />
          <button
            type="button"
            className="inline-flex p-3  items-center text-xl justify-center rounded-full border border-white/20 bg-white/8 text-black transition hover:bg-white/14"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close navigation menu"
          >
           <X className="w-4 h-4"/>
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5">
          {menu.map((item) => {
            const isActive = pathname === item.href;

            return (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold tracking-[0.08em] transition ${
                    isActive
                      ? "bg-[#f16724] text-black shadow-[0_10px_24px_rgba(241,103,36,0.28)]"
                      : "text-black/84 hover:bg-white/8 hover:text-black"
                  }`}
                >
                  {item.label}
                  {item.dropdown?.length ? (
                    <span className="text-[10px]">▾</span>
                  ) : null}
                </Link>
                {item.dropdown?.length ? (
                  <div className="mb-1 mt-0.5 space-y-0.5 pl-3">
                    {item.dropdown.map((child) => (
                      <Link
                        key={child.href + child.label}
                        href={child.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className="block rounded-lg px-4 py-2 text-xs font-semibold text-black/60 transition hover:bg-white/8 hover:text-black/90"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default Header;
