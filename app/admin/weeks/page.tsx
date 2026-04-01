"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAdminConfig, updateAdminConfig, getAdminKeyFromStorage } from "@/lib/admin-client";

type HuntWeek = {
  id: string;
  label: string;
  seasonLabel: string;
  startDate: string;
  endDate: string;
  active: boolean;
};

type CalculatorConfig = {
  camps: Record<string, unknown>[];
  weeks: HuntWeek[];
  packages: Record<string, unknown>[];
  pricingRows: Record<string, unknown>[];
  volumeRules: Record<string, unknown>[];
  discountRules: Record<string, unknown>[];
};

export default function WeeksPage() {
  const router = useRouter();
  const [config, setConfig] = useState<CalculatorConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [weeks, setWeeks] = useState<HuntWeek[]>([]);
  const [newWeek, setNewWeek] = useState({
    label: "",
    seasonLabel: "2026 Season",
    startDate: "",
    endDate: "",
    active: true,
  });

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const adminKey = getAdminKeyFromStorage();
        const data = await fetchAdminConfig(adminKey || undefined);
        setConfig(data);
        setWeeks(data.weeks);
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
      const updatedConfig = { ...config, weeks };
      await updateAdminConfig(updatedConfig, adminKey || undefined);
      alert("Hunt weeks updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleAddWeek = () => {
    if (!newWeek.label || !newWeek.startDate || !newWeek.endDate) {
      setError("Please fill in all fields");
      return;
    }
    const week: HuntWeek = {
      id: Math.random().toString(36).substr(2, 9),
      ...newWeek,
    };
    setWeeks([...weeks, week]);
    setNewWeek({
      label: "",
      seasonLabel: "2026 Season",
      startDate: "",
      endDate: "",
      active: true,
    });
  };

  const handleDeleteWeek = (id: string) => {
    if (confirm("Are you sure you want to delete this week?")) {
      setWeeks(weeks.filter((w) => w.id !== id));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateWeek = (id: string, field: keyof HuntWeek, value: any) => {
    setWeeks(
      weeks.map((w) =>
        w.id === id ? { ...w, [field]: value } : w
      )
    );
  };

  if (loading) {
    return <div className="text-lg text-gray-600">Loading hunt weeks...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Manage Hunt Weeks</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Add New Week */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Week</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Label (e.g., Week 1)"
            value={newWeek.label}
            onChange={(e) => setNewWeek({ ...newWeek, label: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Season (e.g., 2026 Season)"
            value={newWeek.seasonLabel}
            onChange={(e) => setNewWeek({ ...newWeek, seasonLabel: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded"
          />
          <input
            type="date"
            value={newWeek.startDate}
            onChange={(e) => setNewWeek({ ...newWeek, startDate: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded"
          />
          <input
            type="date"
            value={newWeek.endDate}
            onChange={(e) => setNewWeek({ ...newWeek, endDate: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleAddWeek}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition font-medium"
          >
            Add Week
          </button>
        </div>
      </div>

      {/* Weeks List */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Label</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Season</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Start Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">End Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Active</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((week) => (
              <tr key={week.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={week.label}
                    onChange={(e) => handleUpdateWeek(week.id, "label", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded w-full"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={week.seasonLabel}
                    onChange={(e) => handleUpdateWeek(week.id, "seasonLabel", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded w-full"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="date"
                    value={week.startDate}
                    onChange={(e) => handleUpdateWeek(week.id, "startDate", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded w-full"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="date"
                    value={week.endDate}
                    onChange={(e) => handleUpdateWeek(week.id, "endDate", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded w-full"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={week.active}
                    onChange={(e) => handleUpdateWeek(week.id, "active", e.target.checked)}
                    className="w-4 h-4"
                  />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteWeek(week.id)}
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
