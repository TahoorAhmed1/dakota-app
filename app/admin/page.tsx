"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminLoadingState from "@/components/admin/admin-loading-state";
import { fetchAdminConfig, getAdminKeyFromStorage, clearAdminKey } from "@/lib/admin-client";

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
        clearAdminKey();
        router.push("/admin/login");
        return;
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
      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_12px_28px_rgba(0,0,0,0.06)] sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">Overview</p>
        <h2 className="mt-2 text-2xl font-bold text-black sm:text-3xl">Welcome to Admin Dashboard</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/70 sm:text-base">
          Manage your calculator configuration, pricing, and discounts from one place.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group cursor-pointer rounded-2xl border border-black/10 bg-white p-5 shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:border-orange-400 sm:p-6"
          >
            <p className="text-sm font-medium leading-5 text-black/65">{stat.label}</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <p className="text-3xl font-bold text-orange-500 sm:text-4xl">{stat.value}</p>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black/45 transition group-hover:text-orange-500">
                Open
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
        <h3 className="mb-4 text-xl font-bold text-black">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
              className="rounded-xl bg-orange-500 px-4 py-3 text-center text-sm font-medium text-black transition hover:bg-black hover:text-white"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
