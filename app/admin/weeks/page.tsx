"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import AdminLoadingState from "@/components/admin/admin-loading-state";
import { getAdminKeyFromStorage, clearAdminKey } from "@/lib/admin-client";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWeeks(adminKey?: string) {
  const headers: HeadersInit = {};
  if (adminKey) {
    headers["x-admin-key"] = adminKey;
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch("/api/admin/weeks", {
      headers,
      cache: "no-store",
    });

    const payload = await response.json().catch(() => ({}));

    if (response.ok) {
      return payload;
    }

    if (response.status === 503 && attempt < 2) {
      await delay(500 * (attempt + 1));
      continue;
    }

    const message =
      (typeof payload?.error === "string" && payload.error) ||
      (typeof payload?.message === "string" && payload.message) ||
      `Failed to fetch weeks: ${response.statusText}`;

    throw new Error(message);
  }

  throw new Error("Failed to fetch weeks.");
}

async function createWeek(data: Omit<HuntWeek, 'id' | 'createdAt' | 'updatedAt'>, adminKey?: string) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (adminKey) {
    headers["x-admin-key"] = adminKey;
  }

  const response = await fetch("/api/admin/weeks", {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (typeof payload?.error === "string" && payload.error) ||
      (typeof payload?.message === "string" && payload.message) ||
      `Failed to create week: ${response.statusText}`;

    throw new Error(message);
  }

  return payload;
}

async function updateWeek(id: string, data: Partial<Omit<HuntWeek, 'id' | 'createdAt' | 'updatedAt'>>, adminKey?: string) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (adminKey) {
    headers["x-admin-key"] = adminKey;
  }

  const response = await fetch(`/api/admin/weeks/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (typeof payload?.error === "string" && payload.error) ||
      (typeof payload?.message === "string" && payload.message) ||
      `Failed to update week: ${response.statusText}`;

    throw new Error(message);
  }

  return payload;
}

async function deleteWeek(id: string, adminKey?: string) {
  const headers: HeadersInit = {};
  if (adminKey) {
    headers["x-admin-key"] = adminKey;
  }

  const response = await fetch(`/api/admin/weeks/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message =
      (typeof payload?.error === "string" && payload.error) ||
      (typeof payload?.message === "string" && payload.message) ||
      `Failed to delete week: ${response.statusText}`;

    throw new Error(message);
  }

  return true;
}

type HuntWeek = {
  id: string;
  label: string;
  slug: string;
  seasonLabel: string;
  startDate: string | null;
  endDate: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [weeks, setWeeks] = useState<HuntWeek[]>([]);
  const [newWeek, setNewWeek] = useState({
    label: "",
    slug: "",
    seasonLabel: "2026 Season",
    startDate: "",
    endDate: "",
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    const loadWeeks = async () => {
      try {
        const adminKey = getAdminKeyFromStorage();
        const data = await fetchWeeks(adminKey || undefined);
        setWeeks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load weeks");
        clearAdminKey();
        router.push("/admin/login");
        return;
      } finally {
        setLoading(false);
      }
    };

    loadWeeks();
  }, [router]);

  const handleAddWeek = async () => {
    if (!newWeek.label || !newWeek.slug || !newWeek.startDate || !newWeek.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const adminKey = getAdminKeyFromStorage();
      const createdWeek = await createWeek(newWeek, adminKey || undefined);
      setWeeks([...weeks, createdWeek]);
      setNewWeek({
        label: "",
        slug: "",
        seasonLabel: "2026 Season",
        startDate: "",
        endDate: "",
        displayOrder: 0,
        isActive: true,
      });
      toast.success("Week created successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create week";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteWeek = async (id: string) => {
    if (!confirm("Are you sure you want to delete this week?")) return;

    setSaving(true);
    setError("");

    try {
      const adminKey = getAdminKeyFromStorage();
      await deleteWeek(id, adminKey || undefined);
      setWeeks(weeks.filter((w) => w.id !== id));
      toast.success("Week deleted successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete week";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateWeek = async (id: string, field: keyof Omit<HuntWeek, 'id' | 'createdAt' | 'updatedAt'>, value: any) => {
    setSaving(true);
    setError("");

    try {
      const adminKey = getAdminKeyFromStorage();
      const updatedWeek = await updateWeek(id, { [field]: value }, adminKey || undefined);
      setWeeks(weeks.map((w) => (w.id === id ? updatedWeek : w)));
      toast.success("Week updated successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update week";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-black">Label</label>
            <input
              type="text"
              placeholder="e.g., Week 1"
              value={newWeek.label}
              onChange={(e) => setNewWeek({ ...newWeek, label: e.target.value })}
              className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-black">Slug</label>
            <input
              type="text"
              placeholder="e.g., week-1"
              value={newWeek.slug}
              onChange={(e) => setNewWeek({ ...newWeek, slug: e.target.value })}
              className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-black">Season</label>
            <input
              type="text"
              placeholder="e.g., 2026 Season"
              value={newWeek.seasonLabel}
              onChange={(e) => setNewWeek({ ...newWeek, seasonLabel: e.target.value })}
              className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-black">Start Date</label>
            <input
              type="date"
              value={newWeek.startDate}
              onChange={(e) => setNewWeek({ ...newWeek, startDate: e.target.value })}
              className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-black">End Date</label>
            <input
              type="date"
              value={newWeek.endDate}
              onChange={(e) => setNewWeek({ ...newWeek, endDate: e.target.value })}
              className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddWeek}
              disabled={saving}
              className="w-full rounded-xl bg-orange-500 px-4 py-2 font-medium text-black transition hover:bg-orange-400 disabled:opacity-50"
            >
              Add Week
            </button>
          </div>
        </div>
      </div>

      {/* Weeks List */}
      <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <table className="w-full">
          <thead className="border-b border-black bg-black">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Label</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Slug</th>
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
                    disabled={saving}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={week.slug}
                    onChange={(e) => handleUpdateWeek(week.id, "slug", e.target.value)}
                    className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    disabled={saving}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={week.seasonLabel}
                    onChange={(e) => handleUpdateWeek(week.id, "seasonLabel", e.target.value)}
                    className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    disabled={saving}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="date"
                    value={week.startDate ? week.startDate.split('T')[0] : ''}
                    onChange={(e) => handleUpdateWeek(week.id, "startDate", e.target.value)}
                    className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    disabled={saving}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="date"
                    value={week.endDate ? week.endDate.split('T')[0] : ''}
                    onChange={(e) => handleUpdateWeek(week.id, "endDate", e.target.value)}
                    className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    disabled={saving}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={week.isActive}
                    onChange={(e) => handleUpdateWeek(week.id, "isActive", e.target.checked)}
                    className="h-4 w-4 accent-orange-500"
                    disabled={saving}
                  />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteWeek(week.id)}
                    disabled={saving}
                    className="rounded-lg bg-black px-3 py-1 text-sm text-white transition hover:bg-orange-500 hover:text-black disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
