"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAdminConfig, updateAdminConfig, getAdminKeyFromStorage } from "@/lib/admin-client";

type Camp = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  displayOrder: number;
};

type CalculatorConfig = {
  camps: Camp[];
  weeks: Record<string, unknown>[];
  packages: Record<string, unknown>[];
  pricingRows: Record<string, unknown>[];
  volumeRules: Record<string, unknown>[];
  discountRules: Record<string, unknown>[];
};

export default function CampsPage() {
  const router = useRouter();
  const [config, setConfig] = useState<CalculatorConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [camps, setCamps] = useState<Camp[]>([]);
  const [newCamp, setNewCamp] = useState({ name: "", slug: "", active: true, displayOrder: 999 });

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const adminKey = getAdminKeyFromStorage();
        const data = await fetchAdminConfig(adminKey || undefined);
        setConfig(data);
        setCamps(data.camps);
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
      const updatedConfig = { ...config, camps };
      await updateAdminConfig(updatedConfig, adminKey || undefined);
      setEditingId(null);
      alert("Camps updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleAddCamp = () => {
    if (!newCamp.name || !newCamp.slug) {
      setError("Please fill in all fields");
      return;
    }
    const camp: Camp = {
      id: Math.random().toString(36).substr(2, 9),
      ...newCamp,
    };
    setCamps([...camps, camp]);
    setNewCamp({ name: "", slug: "", active: true, displayOrder: 999 });
  };

  const handleDeleteCamp = (id: string) => {
    if (confirm("Are you sure you want to delete this camp?")) {
      setCamps(camps.filter((c) => c.id !== id));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateCamp = (id: string, field: keyof Camp, value: any) => {
    setCamps(
      camps.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      )
    );
  };

  if (loading) {
    return <div className="text-lg text-gray-600">Loading camps...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Manage Camps</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Add New Camp */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Camp</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Camp name"
            value={newCamp.name}
            onChange={(e) => setNewCamp({ ...newCamp, name: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Slug (URL friendly)"
            value={newCamp.slug}
            onChange={(e) => setNewCamp({ ...newCamp, slug: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            placeholder="Display order"
            value={newCamp.displayOrder}
            onChange={(e) => setNewCamp({ ...newCamp, displayOrder: parseInt(e.target.value) })}
            className="px-3 py-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleAddCamp}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition font-medium"
          >
            Add Camp
          </button>
        </div>
      </div>

      {/* Camps List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Slug</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Active</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {camps.map((camp) => (
              <tr key={camp.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={camp.name}
                    onChange={(e) => handleUpdateCamp(camp.id, "name", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded w-full"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={camp.slug}
                    onChange={(e) => handleUpdateCamp(camp.id, "slug", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded w-full"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={camp.displayOrder}
                    onChange={(e) => handleUpdateCamp(camp.id, "displayOrder", parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded w-24"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={camp.active}
                    onChange={(e) => handleUpdateCamp(camp.id, "active", e.target.checked)}
                    className="w-4 h-4"
                  />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteCamp(camp.id)}
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
