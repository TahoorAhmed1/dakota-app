"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import AdminLoadingState from "@/components/admin/admin-loading-state";
import { getAdminKeyFromStorage, clearAdminKey } from "@/lib/admin-client";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPackages(adminKey?: string) {
  const headers: HeadersInit = {};
  if (adminKey) {
    headers["x-admin-key"] = adminKey;
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch("/api/admin/packages", {
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
      `Failed to fetch packages: ${response.statusText}`;

    throw new Error(message);
  }

  throw new Error("Failed to fetch packages.");
}

async function createPackage(data: Omit<Package, 'id' | 'createdAt' | 'updatedAt'>, adminKey?: string) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (adminKey) {
    headers["x-admin-key"] = adminKey;
  }

  const response = await fetch("/api/admin/packages", {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (typeof payload?.error === "string" && payload.error) ||
      (typeof payload?.message === "string" && payload.message) ||
      `Failed to create package: ${response.statusText}`;

    throw new Error(message);
  }

  return payload;
}

async function updatePackage(id: string, data: Partial<Omit<Package, 'id' | 'createdAt' | 'updatedAt'>>, adminKey?: string) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (adminKey) {
    headers["x-admin-key"] = adminKey;
  }

  const response = await fetch(`/api/admin/packages/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (typeof payload?.error === "string" && payload.error) ||
      (typeof payload?.message === "string" && payload.message) ||
      `Failed to update package: ${response.statusText}`;

    throw new Error(message);
  }

  return payload;
}

async function deletePackage(id: string, adminKey?: string) {
  const headers: HeadersInit = {};
  if (adminKey) {
    headers["x-admin-key"] = adminKey;
  }

  const response = await fetch(`/api/admin/packages/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message =
      (typeof payload?.error === "string" && payload.error) ||
      (typeof payload?.message === "string" && payload.message) ||
      `Failed to delete package: ${response.statusText}`;

    throw new Error(message);
  }

  return true;
}

type Package = {
  id: string;
  code: string;
  label: string;
  nights: number;
  days: number;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function PackagesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [packages, setPackages] = useState<Package[]>([]);
  const [newPackage, setNewPackage] = useState({ code: '', label: '', nights: 3, days: 2, displayOrder: 0, isActive: true });

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const adminKey = getAdminKeyFromStorage();
        const data = await fetchPackages(adminKey || undefined);
        setPackages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load packages");
        clearAdminKey();
        router.push("/admin/login");
        return;
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, [router]);

  const handleAddPackage = async () => {
    if (!newPackage.code || !newPackage.label) {
      toast.error("Code and Label are required");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const adminKey = getAdminKeyFromStorage();
      const createdPackage = await createPackage(newPackage, adminKey || undefined);
      setPackages([...packages, createdPackage]);
      setNewPackage({ code: '', label: '', nights: 3, days: 2, displayOrder: 0, isActive: true });
      toast.success("Package created successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create package";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    
    setSaving(true);
    setError("");

    try {
      const adminKey = getAdminKeyFromStorage();
      await deletePackage(id, adminKey || undefined);
      setPackages(packages.filter((p) => p.id !== id));
      toast.success("Package deleted successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete package";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdatePackage = async (id: string, field: keyof Omit<Package, 'id' | 'createdAt' | 'updatedAt'>, value: any) => {
    setSaving(true);
    setError("");

    try {
      const adminKey = getAdminKeyFromStorage();
      const updatedPackage = await updatePackage(id, { [field]: value }, adminKey || undefined);
      setPackages(packages.map((p) => (p.id === id ? updatedPackage : p)));
      toast.success("Package updated successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update package";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-black">Code</label>
            <input
              type="text"
              value={newPackage.code}
              onChange={(e) => setNewPackage({ ...newPackage, code: e.target.value })}
              className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="e.g. 3N2D"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-black">Label</label>
            <input
              type="text"
              value={newPackage.label}
              onChange={(e) => setNewPackage({ ...newPackage, label: e.target.value })}
              className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="e.g. 3 Nights / 2 Days"
            />
          </div>
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
              checked={newPackage.isActive}
              onChange={(e) => setNewPackage({ ...newPackage, isActive: e.target.checked })}
              className="mt-2 h-4 w-4 accent-orange-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddPackage}
              disabled={saving}
              className="w-full rounded-xl bg-orange-500 px-4 py-2 font-medium text-black transition hover:bg-orange-400 disabled:opacity-50"
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
                Code
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Label</th>
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
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={pkg.code}
                    onChange={(e) =>
                      handleUpdatePackage(pkg.id, "code", e.target.value)
                    }
                    className="w-24 rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    disabled={saving}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={pkg.label}
                    onChange={(e) =>
                      handleUpdatePackage(pkg.id, "label", e.target.value)
                    }
                    className="w-32 rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    disabled={saving}
                  />
                </td>
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
                    disabled={saving}
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
                    disabled={saving}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={pkg.isActive}
                    onChange={(e) => handleUpdatePackage(pkg.id, "isActive", e.target.checked)}
                    className="h-4 w-4 accent-orange-500"
                    disabled={saving}
                  />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeletePackage(pkg.id)}
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
