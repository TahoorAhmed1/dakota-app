"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAdminConfig, updateAdminConfig, getAdminKeyFromStorage } from "@/lib/admin-client";

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
        setTimeout(() => router.push("/admin/login"), 2000);
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
      alert("Packages updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
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
    return <div className="text-lg text-gray-600">Loading packages...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Manage Packages</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Add New Package */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Package</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nights</label>
            <input
              type="number"
              min="1"
              value={newPackage.nights}
              onChange={(e) => setNewPackage({ ...newPackage, nights: parseInt(e.target.value) })}
              className="px-3 py-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Days</label>
            <input
              type="number"
              min="1"
              value={newPackage.days}
              onChange={(e) => setNewPackage({ ...newPackage, days: parseInt(e.target.value) })}
              className="px-3 py-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Active</label>
            <input
              type="checkbox"
              checked={newPackage.active}
              onChange={(e) => setNewPackage({ ...newPackage, active: e.target.checked })}
              className="w-4 h-4 mt-2"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddPackage}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition font-medium"
            >
              Add Package
            </button>
          </div>
        </div>
      </div>

      {/* Packages List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nights</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Days</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Active</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
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
                    className="px-3 py-2 border border-gray-300 rounded w-24"
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
                    className="px-3 py-2 border border-gray-300 rounded w-24"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={pkg.active}
                    onChange={(e) => handleUpdatePackage(pkg.id, "active", e.target.checked)}
                    className="w-4 h-4"
                  />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeletePackage(pkg.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
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
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded font-semibold transition"
      >
        {saving ? "Saving..." : "Save All Changes"}
      </button>
    </div>
  );
}
