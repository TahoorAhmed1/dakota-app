"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchAdminConfig, getAdminKeyFromStorage } from "@/lib/admin-client";

type CalculatorConfig = {
  camps: Array<{ id: string; name: string }>;
  weeks: Array<{ id: string; label: string }>;
  packages: Array<{ id: string; nights: number }>;
  pricingRows: Array<{ campId: string; weekId: string; packageId: string }>;
  volumeRules: Array<{ minHunters: number; maxHunters: number }>;
  discountRules: Array<{ code: string }>;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [config, setConfig] = useState<CalculatorConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const adminKey = getAdminKeyFromStorage();
        const data = await fetchAdminConfig(adminKey || undefined);
        setConfig(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load configuration");
        // Redirect to login if unauthorized
        setTimeout(() => {
          router.push("/admin/login");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-600">Loading configuration...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error: {error}</p>
        <p className="text-sm text-gray-600 mt-2">Redirecting to login...</p>
      </div>
    );
  }

  if (!config) {
    return null;
  }

  const stats = [
    { label: "Active Camps", value: config.camps.length, href: "/admin/camps" },
    { label: "Hunt Weeks", value: config.weeks.length, href: "/admin/weeks" },
    { label: "Package Types", value: config.packages.length, href: "/admin/packages" },
    { label: "Pricing Rules", value: config.pricingRows.length, href: "/admin/pricing" },
    { label: "Volume Discounts", value: config.volumeRules.length, href: "/admin/pricing" },
    { label: "Discount Codes", value: config.discountRules.length, href: "/admin/discounts" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Admin Dashboard</h2>
        <p className="text-gray-600">Manage your calculator configuration, pricing, and discounts.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
          >
            <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: "View All Camps", href: "/admin/camps" },
            { label: "Manage Weeks", href: "/admin/weeks" },
            { label: "Edit Packages", href: "/admin/packages" },
            { label: "Configure Pricing", href: "/admin/pricing" },
            { label: "Set Up Discounts", href: "/admin/discounts" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition text-center text-sm font-medium"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">System Status</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ Admin API is operational</li>
          <li>✓ Configuration is loaded and ready to edit</li>
          <li>✓ All {config.camps.length} camps are available</li>
          <li>✓ Database connection is active</li>
        </ul>
      </div>
    </div>
  );
}
