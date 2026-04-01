"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { clearAdminKey } from "@/lib/admin-client";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Camps", href: "/admin/camps" },
  { label: "Hunt Weeks", href: "/admin/weeks" },
  { label: "Packages", href: "/admin/packages" },
  { label: "Pricing", href: "/admin/pricing" },
  { label: "Discounts", href: "/admin/discounts" },
  { label: "Calculator Settings", href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    clearAdminKey();
    router.push("/admin/login");
  };

  return (
    <div className="flex h-screen bg-[#fff7ef] text-black">
      {/* Sidebar */}
      <div className="w-64 overflow-y-auto bg-black p-6 text-white">
        <h2 className="mb-2 text-2xl font-bold">Admin Panel</h2>
        <p className="mb-8 text-sm text-orange-300">Orange, white, and black control center</p>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-4 py-2 transition ${
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
          className="mt-8 w-full rounded-lg bg-orange-500 px-4 py-2 font-medium text-black transition hover:bg-orange-400"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b border-black/10 bg-white px-6 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <h1 className="text-2xl font-bold text-black">Dakota Hunting Adventures Admin</h1>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-[radial-gradient(circle_at_top_right,rgba(243,112,33,0.18),transparent_26%),linear-gradient(180deg,#fff7ef_0%,#ffffff_100%)] p-6">
          {children}
        </div>
      </div>

      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          classNames: {
            toast: "border border-black bg-white text-black shadow-[0_16px_40px_rgba(0,0,0,0.16)]",
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
