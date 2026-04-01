"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminLoadingState from "@/components/admin/admin-loading-state";
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
    return <AdminLoadingState label="Loading dashboard configuration..." />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-orange-400 bg-orange-100 p-4">
        <p className="font-medium text-black">Error: {error}</p>
        <p className="mt-2 text-sm text-black/70">Redirecting to login...</p>
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
        <h2 className="mb-2 text-3xl font-bold text-black">Welcome to Admin Dashboard</h2>
        <p className="text-black/70">Manage your calculator configuration, pricing, and discounts.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="cursor-pointer rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:border-orange-400"
          >
            <p className="text-sm font-medium text-black/65">{stat.label}</p>
            <p className="mt-2 text-4xl font-bold text-orange-500">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
        <h3 className="mb-4 text-xl font-bold text-black">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: "View All Camps", href: "/admin/camps" },
            { label: "Manage Weeks", href: "/admin/weeks" },
            { label: "Edit Packages", href: "/admin/packages" },
            { label: "Configure Pricing", href: "/admin/pricing" },
            { label: "Edit Calculator Settings", href: "/admin/settings" },
            { label: "Set Up Discounts", href: "/admin/discounts" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="rounded-lg bg-orange-500 px-4 py-2 text-center text-sm font-medium text-black transition hover:bg-black hover:text-white"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
