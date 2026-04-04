"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import AdminLoadingState from "@/components/admin/admin-loading-state";
import { fetchAdminConfig, updateAdminConfig, getAdminKeyFromStorage, clearAdminKey } from "@/lib/admin-client";

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
      const updatedConfig = { ...config, weeks };
      await updateAdminConfig(updatedConfig, adminKey || undefined);
      toast.success("Hunt weeks updated successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save changes";
      setError(message);
      toast.error(message);
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
    return <AdminLoadingState label="Loading hunt weeks..." />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-black">Manage Hunt Weeks</h2>

      {error && (
        <div className="rounded-2xl border border-orange-400 bg-orange-100 p-4">
          <p className="text-black">{error}</p>
        </div>
      )}

      {/* Add New Week */}
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <h3 className="mb-4 text-lg font-semibold text-black">Add New Week</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <input
            type="text"
            placeholder="Label (e.g., Week 1)"
            value={newWeek.label}
            onChange={(e) => setNewWeek({ ...newWeek, label: e.target.value })}
            className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <input
            type="text"
            placeholder="Season (e.g., 2026 Season)"
            value={newWeek.seasonLabel}
            onChange={(e) => setNewWeek({ ...newWeek, seasonLabel: e.target.value })}
            className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <input
            type="date"
            value={newWeek.startDate}
            onChange={(e) => setNewWeek({ ...newWeek, startDate: e.target.value })}
            className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <input
            type="date"
            value={newWeek.endDate}
            onChange={(e) => setNewWeek({ ...newWeek, endDate: e.target.value })}
            className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <button
            onClick={handleAddWeek}
            className="rounded-xl bg-orange-500 px-4 py-2 font-medium text-black transition hover:bg-orange-400"
          >
            Add Week
          </button>
        </div>
      </div>

      {/* Weeks List */}
      <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <table className="w-full">
          <thead className="border-b border-black bg-black">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Label</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Season</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Start Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">End Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Active</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((week) => (
              <tr key={week.id} className="border-b border-black/10 hover:bg-orange-50">
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={week.label}
                    onChange={(e) => handleUpdateWeek(week.id, "label", e.target.value)}
                    className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={week.seasonLabel}
                    onChange={(e) => handleUpdateWeek(week.id, "seasonLabel", e.target.value)}
                    className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="date"
                    value={week.startDate}
                    onChange={(e) => handleUpdateWeek(week.id, "startDate", e.target.value)}
                    className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="date"
                    value={week.endDate}
                    onChange={(e) => handleUpdateWeek(week.id, "endDate", e.target.value)}
                    className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={week.active}
                    onChange={(e) => handleUpdateWeek(week.id, "active", e.target.checked)}
                    className="h-4 w-4 accent-orange-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteWeek(week.id)}
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
