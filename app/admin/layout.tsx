"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { clearAdminKey } from "@/lib/admin-client";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "News & Events", href: "/admin/news" },
  { label: "Gallery", href: "/admin/gallery" },
  { label: "Image Catalog", href: "/admin/image-catalog" },
  { label: "Waitlist", href: "/admin/waitlist" },
  { label: "Camps", href: "/admin/camps" },
  { label: "Hunt Weeks", href: "/admin/weeks" },
  { label: "Availability", href: "/admin/availability" },
  { label: "Packages", href: "/admin/packages" },
  { label: "Pricing", href: "/admin/pricing" },
  { label: "Discounts", href: "/admin/discounts" },
  { label: "Calculator Settings", href: "/admin/settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);


  const handleLogout = () => {
    clearAdminKey();
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#fff7ef] text-black">
      {isSidebarOpen ? (
        <button
          type="button"
          aria-label="Close admin navigation"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/45 lg:hidden"
        />
      ) : null}

      <aside
        aria-hidden={
          !isSidebarOpen && typeof window !== "undefined" ? true : undefined
        }
        className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[82vw] flex-col overflow-y-auto bg-black p-5 text-white transition-transform duration-300 sm:p-6 lg:static lg:w-64 lg:max-w-none lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="mb-2 text-xl font-bold sm:text-2xl">Admin Panel</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white transition hover:bg-white/10 lg:hidden"
            aria-label="Close admin navigation"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-orange-500 text-black"
                    : "text-white hover:bg-white/10 hover:text-orange-300"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-6 w-full rounded-xl bg-orange-500 px-4 py-3 font-medium text-black transition hover:bg-orange-400"
        >
          Logout
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="border-b border-black/10 bg-white px-4 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold text-black sm:text-2xl">
                Dakota Hunting Adventures Admin
              </h1>
              <p className="mt-1 text-xs text-black/55 sm:hidden">
                Dashboard and calculator controls
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-black/10 text-black lg:hidden"
              aria-label="Open admin navigation"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-white p-4 sm:p-6">
          {children}
        </div>
      </div>

      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          classNames: {
            toast:
              "border border-black bg-white text-black shadow-[0_16px_40px_rgba(0,0,0,0.16)]",
            title: "text-black",
            description: "text-black/70",
            success: "border-orange-500",
            error: "border-black",
          },
        }}
      />
    </div>
  );
}
