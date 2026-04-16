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

export default function AdminCampsPage() {
  const router = useRouter();
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <AdminLoadingState label="Loading camps..." />;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-black">Manage Camps</h2>

      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <h4 className="mb-4 text-lg font-semibold text-black">Camps</h4>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

