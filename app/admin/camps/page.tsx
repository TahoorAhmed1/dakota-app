"use client"

import { useEffect, useState, useCallback } from "react";
import { getAdminKeyFromStorage, clearAdminKey } from "@/lib/admin-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AdminLoadingState from "@/components/admin/admin-loading-state";

type Camp = {
  id: string;
  name: string;
  slug: string;
  nightlyLodgingRate: number;
  minGroupSize: number;
  lodgingCapacity: number;
  isActive: boolean;
};

async function fetchCamps(adminKey?: string) {
  const headers: HeadersInit = {};
  if (adminKey) headers["x-admin-key"] = adminKey;
  
  const response = await fetch("/api/admin/camps", { headers });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || `Failed to fetch camps: ${response.statusText}`);
  }
  return response.json();
}

async function updateCamp(id: string, data: Partial<Omit<Camp, 'id'>>, adminKey?: string) {
  const headers: HeadersInit = {};
  if (adminKey) headers["x-admin-key"] = adminKey;
  
  const response = await fetch(`/api/admin/camps/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || `Failed to update camp: ${response.statusText}`);
  }
  return response.json();
}

async function createCamp(data: Partial<Omit<Camp, 'id'>>, adminKey?: string) {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (adminKey) headers['x-admin-key'] = adminKey;

  const response = await fetch(`/api/admin/camps`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || `Failed to create camp: ${response.statusText}`);
  }
  return response.json();
}

async function deleteCamp(id: string, adminKey?: string) {
  const headers: HeadersInit = {};
  if (adminKey) headers['x-admin-key'] = adminKey;

  const response = await fetch(`/api/admin/camps/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || `Failed to delete camp: ${response.statusText}`);
  }
  return response.json();
}

export default function AdminCampsPage() {
  const router = useRouter();
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCamp, setNewCamp] = useState<Partial<Camp>>({
    name: "",
    slug: "",
    nightlyLodgingRate: 0,
    minGroupSize: 1,
    lodgingCapacity: 0,
    isActive: true,
  });
  // Removed unused 'saving' state

  // useCallback to avoid missing dependency warning
  const loadCamps = useCallback(async () => {
    try {
      const adminKey = getAdminKeyFromStorage();
      const data = await fetchCamps(adminKey || undefined);
      setCamps(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load camps");
      clearAdminKey();
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadCamps();
  }, [loadCamps]);

  async function handleUpdate(
    id: string,
    field: keyof Omit<Camp, 'id'>,
    value: string | number | boolean | null
  ) {
    try {
      const adminKey = getAdminKeyFromStorage();
      const updated = await updateCamp(id, { [field]: value }, adminKey || undefined);
      setCamps(camps.map(c => c.id === id ? updated : c));
      toast.success("Camp updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function handleCreate() {
    try {
      setCreating(true);
      const adminKey = getAdminKeyFromStorage();
      const created = await createCamp(newCamp, adminKey || undefined);
      setCamps((prev) => [created, ...prev]);
      setNewCamp({ name: "", slug: "", nightlyLodgingRate: 0, minGroupSize: 1, lodgingCapacity: 0, isActive: true });
      setAddModalOpen(false);
      toast.success("Camp created");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Create failed");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this camp? This cannot be undone.')) return;
    try {
      const adminKey = getAdminKeyFromStorage();
      await deleteCamp(id, adminKey || undefined);
      setCamps((prev) => prev.filter((c) => c.id !== id));
      toast.success('Camp deleted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  if (loading) return <AdminLoadingState label="Loading camps..." />;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-black">Manage Camps</h2>
        <button
          onClick={() => setAddModalOpen(true)}
          className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-black shadow-sm transition hover:bg-yellow-700"
        >
          Add Camp
        </button>
      </div>

        <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)] mt-2">
          <table className="w-full">
            <thead className="border-b border-black bg-black">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Slug</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Nightly Rate</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Min Group</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Capacity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Active</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {camps.map((camp) => (
                <tr key={camp.id} className="border-b border-black/10 hover:bg-orange-50">
                  <td className="px-6 py-4">
                    <input
                      value={camp.name || ""}
                      onChange={(e) => handleUpdate(camp.id, "name", e.target.value)}
                      className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300 w-full"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      value={camp.slug || ""}
                      onChange={(e) => handleUpdate(camp.id, "slug", e.target.value)}
                      className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300 w-full"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={camp.nightlyLodgingRate ?? ""}
                      onChange={(e) => handleUpdate(camp.id, "nightlyLodgingRate", e.target.value === "" ? null : Number(e.target.value))}
                      className="w-28 rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={camp.minGroupSize ?? ""}
                      onChange={(e) => handleUpdate(camp.id, "minGroupSize", e.target.value === "" ? null : Number(e.target.value))}
                      className="w-24 rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={camp.lodgingCapacity ?? ""}
                      onChange={(e) => handleUpdate(camp.id, "lodgingCapacity", e.target.value === "" ? null : Number(e.target.value))}
                      className="w-24 rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={!!camp.isActive}
                      onChange={(e) => handleUpdate(camp.id, "isActive", e.target.checked)}
                      className="w-5 h-5 accent-orange-500 focus:ring-2 focus:ring-orange-300"
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(camp.id)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-4xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-black/40">New camp</p>
                <h3 className="text-2xl font-bold text-black">Add a new camp</h3>
                <p className="mt-1 text-sm text-black/60">Fill out the required details below to create a new camp listing.</p>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-3xl leading-none text-black/40 transition hover:text-black"
                aria-label="Close add camp modal"
              >
                ×
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs font-semibold text-black/70">Name <span className="text-red-500">*</span></span>
                <input
                  value={newCamp.name}
                  onChange={(e) => setNewCamp((s) => ({ ...s, name: e.target.value }))}
                  className="w-full rounded-2xl border border-black/10 px-4 py-3 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  placeholder="Camp name"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-semibold text-black/70">Slug <span className="text-red-500">*</span></span>
                <input
                  value={newCamp.slug}
                  onChange={(e) => setNewCamp((s) => ({ ...s, slug: e.target.value }))}
                  className="w-full rounded-2xl border border-black/10 px-4 py-3 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  placeholder="camp-slug"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-semibold text-black/70">Nightly Lodging Rate</span>
                <input
                  type="number"
                  min={0}
                  value={newCamp.nightlyLodgingRate ?? 0}
                  onChange={(e) => setNewCamp((s) => ({ ...s, nightlyLodgingRate: Number(e.target.value) }))}
                  className="w-full rounded-2xl border border-black/10 px-4 py-3 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  placeholder="0"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-semibold text-black/70">Min Group Size</span>
                <input
                  type="number"
                  min={1}
                  value={newCamp.minGroupSize ?? 1}
                  onChange={(e) => setNewCamp((s) => ({ ...s, minGroupSize: Number(e.target.value) }))}
                  className="w-full rounded-2xl border border-black/10 px-4 py-3 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-semibold text-black/70">Lodging Capacity</span>
                <input
                  type="number"
                  min={0}
                  value={newCamp.lodgingCapacity ?? 0}
                  onChange={(e) => setNewCamp((s) => ({ ...s, lodgingCapacity: Number(e.target.value) }))}
                  className="w-full rounded-2xl border border-black/10 px-4 py-3 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-semibold text-black/70">Active</span>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={!!newCamp.isActive}
                    onChange={(e) => setNewCamp((s) => ({ ...s, isActive: e.target.checked }))}
                    className="h-5 w-5 accent-orange-500 focus:ring-2 focus:ring-orange-300"
                  />
                  <span className="text-sm text-black/70">Publish camp immediately</span>
                </div>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 justify-end">
              <button
                onClick={() => setAddModalOpen(false)}
                className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-semibold text-black transition hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !newCamp.name || !newCamp.slug}
                className="rounded-2xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-40"
              >
                {creating ? 'Creating…' : 'Create camp'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

