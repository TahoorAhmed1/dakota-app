"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { clearAdminKey } from "@/lib/admin-client";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Camps", href: "/admin/camps" },
  { label: "Hunt Weeks", href: "/admin/weeks" },
  { label: "Packages", href: "/admin/packages" },
  { label: "Pricing", href: "/admin/pricing" },
  { label: "Discounts", href: "/admin/discounts" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    clearAdminKey();
    router.push("/admin/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="w-full mt-8 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition text-white font-medium"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-sm px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Dakota Hunting Adventures Admin</h1>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
