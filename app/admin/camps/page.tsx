"use client"

import { useEffect, useState } from "react";
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
  const [saving, setSaving] = useState("");

  useEffect(() => {
    loadCamps();
  }, []);

  async function loadCamps() {
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
  }

  async function handleUpdate(id: string, field: keyof Omit<Camp, 'id'>, value: any) {
    setSaving(id);
    try {
      const adminKey = getAdminKeyFromStorage();
      const updated = await updateCamp(id, { [field]: value }, adminKey || undefined);
      setCamps(camps.map(c => c.id === id ? updated : c));
      toast.success("Camp updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving("");
    }
  }

  if (loading) return <AdminLoadingState label="Loading camps..." />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Camps</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left">Name</th>
              <th className="border border-gray-300 p-3 text-left">Slug</th>
              <th className="border border-gray-300 p-3 text-left">Nightly Rate</th>
              <th className="border border-gray-300 p-3 text-left">Min Group</th>
              <th className="border border-gray-300 p-3 text-left">Capacity</th>
              <th className="border border-gray-300 p-3 text-left">Active</th>
            </tr>
          </thead>
          <tbody>
            {camps.map((camp) => (
              <tr key={camp.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-3">
                  <input
                    value={camp.name}
                    onChange={(e) => handleUpdate(camp.id, "name", e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="border border-gray-300 p-3">
                  <input
                    value={camp.slug}
                    onChange={(e) => handleUpdate(camp.id, "slug", e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="border border-gray-300 p-3">
                  <input
                    type="number"
                    value={camp.nightlyLodgingRate}
                    onChange={(e) => handleUpdate(camp.id, "nightlyLodgingRate", Number(e.target.value))}
                    className="w-20 p-1 border rounded"
                  />
                </td>
                <td className="border border-gray-300 p-3">
                  <input
                    type="number"
                    value={camp.minGroupSize}
                    onChange={(e) => handleUpdate(camp.id, "minGroupSize", Number(e.target.value))}
                    className="w-20 p-1 border rounded"
                  />
                </td>
                <td className="border border-gray-300 p-3">
                  <input
                    type="number"
                    value={camp.lodgingCapacity}
                    onChange={(e) => handleUpdate(camp.id, "lodgingCapacity", Number(e.target.value))}
                    className="w-20 p-1 border rounded"
                  />
                </td>
                <td className="border border-gray-300 p-3">
                  <input
                    type="checkbox"
                    checked={camp.isActive}
                    onChange={(e) => handleUpdate(camp.id, "isActive", e.target.checked)}
                    className="w-5 h-5"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

