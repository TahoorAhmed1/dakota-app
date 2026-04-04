"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import AdminLoadingState from "@/components/admin/admin-loading-state";
import { fetchAdminConfig, updateAdminConfig, getAdminKeyFromStorage, clearAdminKey } from "@/lib/admin-client";

type Package = {
  id: string;
  nights: number;
  days: number;
  active: boolean;
};

type CalculatorConfig = {
  camps: Record<string, unknown>[];
  weeks: Record<string, unknown>[];
  packages: Package[];
  pricingRows: Record<string, unknown>[];
  volumeRules: Record<string, unknown>[];
  discountRules: Record<string, unknown>[];
};

export default function PackagesPage() {
  const router = useRouter();
  const [config, setConfig] = useState<CalculatorConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [packages, setPackages] = useState<Package[]>([]);
  const [newPackage, setNewPackage] = useState({ nights: 3, days: 2, active: true });

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const adminKey = getAdminKeyFromStorage();
        const data = await fetchAdminConfig(adminKey || undefined);
        setConfig(data);
        setPackages(data.packages);
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

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    setError("");

    try {
      const adminKey = getAdminKeyFromStorage();
      const updatedConfig = { ...config, packages };
      await updateAdminConfig(updatedConfig, adminKey || undefined);
      toast.success("Packages updated successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save changes";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddPackage = () => {
    const pkg: Package = {
      id: Math.random().toString(36).substr(2, 9),
      nights: newPackage.nights,
      days: newPackage.days,
      active: newPackage.active,
    };
    setPackages([...packages, pkg]);
    setNewPackage({ nights: 3, days: 2, active: true });
  };

  const handleDeletePackage = (id: string) => {
    if (confirm("Are you sure you want to delete this package?")) {
      setPackages(packages.filter((p) => p.id !== id));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdatePackage = (id: string, field: keyof Package, value: any) => {
    setPackages(
      packages.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  if (loading) {
    return <AdminLoadingState label="Loading packages..." />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-black">Manage Packages</h2>

      {error && (
        <div className="rounded-2xl border border-orange-400 bg-orange-100 p-4">
          <p className="text-black">{error}</p>
        </div>
      )}

      {/* Add New Package */}
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <h3 className="mb-4 text-lg font-semibold text-black">Add New Package</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-black">Nights</label>
            <input
              type="number"
              min="1"
              value={newPackage.nights}
              onChange={(e) => setNewPackage({ ...newPackage, nights: parseInt(e.target.value) })}
              className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-black">Days</label>
            <input
              type="number"
              min="1"
              value={newPackage.days}
              onChange={(e) => setNewPackage({ ...newPackage, days: parseInt(e.target.value) })}
              className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-black">Active</label>
            <input
              type="checkbox"
              checked={newPackage.active}
              onChange={(e) => setNewPackage({ ...newPackage, active: e.target.checked })}
              className="mt-2 h-4 w-4 accent-orange-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddPackage}
              className="w-full rounded-xl bg-orange-500 px-4 py-2 font-medium text-black transition hover:bg-orange-400"
            >
              Add Package
            </button>
          </div>
        </div>
      </div>

      {/* Packages List */}
      <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <table className="w-full">
          <thead className="border-b border-black bg-black">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Nights</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Days</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Active</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id} className="border-b border-black/10 hover:bg-orange-50">
                <td className="px-6 py-4 font-medium text-black">
                  {pkg.nights}N/{pkg.days}D
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    min="1"
                    value={pkg.nights}
                    onChange={(e) =>
                      handleUpdatePackage(pkg.id, "nights", parseInt(e.target.value))
                    }
                    className="w-24 rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    min="1"
                    value={pkg.days}
                    onChange={(e) =>
                      handleUpdatePackage(pkg.id, "days", parseInt(e.target.value))
                    }
                    className="w-24 rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={pkg.active}
                    onChange={(e) => handleUpdatePackage(pkg.id, "active", e.target.checked)}
                    className="h-4 w-4 accent-orange-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeletePackage(pkg.id)}
                    className="rounded-lg bg-black px-3 py-1 text-sm text-white transition hover:bg-orange-500 hover:text-black"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-xl bg-orange-500 px-6 py-3 font-semibold text-black transition hover:bg-orange-400 disabled:bg-black/30 disabled:text-white sm:w-auto"
      >
        {saving ? "Saving..." : "Save All Changes"}
      </button>
    </div>
  );
}
