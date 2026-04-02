"use client";

import logo from "@/assets/logo 1.png";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          <Link href="/" className="flex items-center" aria-label="Go to homepage" onClick={() => setIsSidebarOpen(false)}>
            <Image
              src={logo}
              alt="U Guide"
              className="h-9 w-auto object-contain sm:h-10 lg:h-12"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-6 text-[13px] font-semibold tracking-wide xl:flex">
            {menu.map((item) => {
              const isActive = item.href !== "#" && pathname === item.href;

              if (item.href === "#") {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-gray-700 transition-colors hover:text-orange-500"
                  >
                    {item.label}
                    {item.label === "RESOURCES" && <span className="ml-1">▾</span>}
                  </a>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`transition-colors ${
                    isActive ? "text-orange-500" : "text-gray-700 hover:text-orange-500"
                  }`}
                >
                  {item.label}
                  {item.label === "RESOURCES" && <span className="ml-1">▾</span>}
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
          isSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="mobile-navigation"
        className={`fixed right-0 top-0 z-50 flex h-full w-[min(84vw,340px)] flex-col bg-[linear-gradient(180deg,#3b220c_0%,#1f1206_100%)] px-5 pb-6 pt-5 text-white shadow-[-12px_0_40px_rgba(0,0,0,0.28)] transition-transform duration-300 xl:hidden ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isSidebarOpen}
      >
        <div className="mb-8 flex items-center justify-between">
          <Image src={logo} alt="U Guide" className="h-9 w-auto object-contain" />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/8 text-white transition hover:bg-white/14"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close navigation menu"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5">
          {menu.map((item) => {
            const isActive = item.href !== "#" && pathname === item.href;

            if (item.href === "#") {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-xl px-4 py-3 text-sm font-semibold tracking-[0.08em] text-white/84 transition hover:bg-white/8 hover:text-white"
                >
                  {item.label}
                  {item.label === "RESOURCES" && <span className="ml-2">▾</span>}
                </a>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-semibold tracking-[0.08em] transition ${
                  isActive
                    ? "bg-[#f16724] text-white shadow-[0_10px_24px_rgba(241,103,36,0.28)]"
                    : "text-white/84 hover:bg-white/8 hover:text-white"
                }`}
              >
                {item.label}
                {item.label === "RESOURCES" && <span className="ml-2">▾</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default Header;