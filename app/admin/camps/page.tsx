"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import AdminLoadingState from "@/components/admin/admin-loading-state";
import { fetchAdminConfig, updateAdminConfig, getAdminKeyFromStorage, clearAdminKey } from "@/lib/admin-client";

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
      const updatedConfig = { ...config, camps };
      await updateAdminConfig(updatedConfig, adminKey || undefined);
      toast.success("Camps updated successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save changes";
      setError(message);
      toast.error(message);
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
    return <AdminLoadingState label="Loading camps..." />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-black">Manage Camps</h2>

      {error && (
        <div className="rounded-2xl border border-orange-400 bg-orange-100 p-4">
          <p className="text-black">{error}</p>
        </div>
      )}

      {/* Add New Camp */}
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <h3 className="mb-4 text-lg font-semibold text-black">Add New Camp</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input
            type="text"
            placeholder="Camp name"
            value={newCamp.name}
            onChange={(e) => setNewCamp({ ...newCamp, name: e.target.value })}
            className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <input
            type="text"
            placeholder="Slug (URL friendly)"
            value={newCamp.slug}
            onChange={(e) => setNewCamp({ ...newCamp, slug: e.target.value })}
            className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <input
            type="number"
            placeholder="Display order"
            value={newCamp.displayOrder}
            onChange={(e) => setNewCamp({ ...newCamp, displayOrder: parseInt(e.target.value) })}
            className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <button
            onClick={handleAddCamp}
            className="rounded-xl bg-orange-500 px-4 py-2 font-medium text-black transition hover:bg-orange-400"
          >
            Add Camp
          </button>
        </div>
      </div>

      {/* Camps List */}
      <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <table className="w-full">
          <thead className="border-b border-black bg-black">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Slug</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Order</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Active</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {camps.map((camp) => (
              <tr key={camp.id} className="border-b border-black/10 hover:bg-orange-50">
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={camp.name}
                    onChange={(e) => handleUpdateCamp(camp.id, "name", e.target.value)}
                    className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={camp.slug}
                    onChange={(e) => handleUpdateCamp(camp.id, "slug", e.target.value)}
                    className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={camp.displayOrder}
                    onChange={(e) => handleUpdateCamp(camp.id, "displayOrder", parseInt(e.target.value))}
                    className="w-24 rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={camp.active}
                    onChange={(e) => handleUpdateCamp(camp.id, "active", e.target.checked)}
                    className="h-4 w-4 accent-orange-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteCamp(camp.id)}
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
