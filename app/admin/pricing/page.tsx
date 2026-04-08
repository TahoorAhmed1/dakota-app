"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import AdminLoadingState from "@/components/admin/admin-loading-state";
import { getAdminKeyFromStorage, clearAdminKey } from "@/lib/admin-client";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type Camp = { id: string; name: string };
type HuntWeek = { id: string; label: string };
type Package = { id: string; code: string; label: string; nights: number; days: number };
type PricingRow = {
  id: string;
  campId: string;
  weekId: string;
  packageId: string;
  baseRate: number;
  minGroupSize: number;
  isAvailable: boolean;
  availabilityTag: string | null;
  camp: { name: string };
  week: { label: string };
  package: { code: string; label: string; nights: number; days: number };
};
type VolumeRule = {
  id: string;
  minHunters: number;
  maxHunters: number | null;
  amountOffPerHead: number;
  displayOrder: number;
  isActive: boolean;
};

async function fetchCampsAndPackages(adminKey?: string) {
  const headers: HeadersInit = {};
  if (adminKey) {
    headers["x-admin-key"] = adminKey;
  }

  try {
    const response = await fetch("/api/admin/calculator/config", {
      headers,
      cache: "no-store",
    });
    if (response.ok) {
      const data = await response.json();
      return { camps: data.camps, weeks: data.weeks, packages: data.packages };
    }
  } catch (err) {
    console.error("Failed to fetch camps/weeks/packages", err);
  }
  return { camps: [], weeks: [], packages: [] };
}

async function fetchPricingRows(adminKey?: string) {
  const headers: HeadersInit = {};
  if (adminKey) {
    headers["x-admin-key"] = adminKey;
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch("/api/admin/pricing-rows", {
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
      `Failed to fetch pricing rows: ${response.statusText}`;
    throw new Error(message);
  }

  throw new Error("Failed to fetch pricing rows.");
}

async function createPricingRow(data: Omit<PricingRow, 'id' | 'camp' | 'week' | 'package'>, adminKey?: string) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (adminKey) {
    headers["x-admin-key"] = adminKey;
  }

  const response = await fetch("/api/admin/pricing-rows", {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (typeof payload?.error === "string" && payload.error) ||
      (typeof payload?.details === "object" && payload.details ? JSON.stringify(payload.details) : null) ||
      `Failed to create pricing row: ${response.statusText}`;
    throw new Error(message);
  }

  return payload;
}

async function updatePricingRow(id: string, data: Partial<Omit<PricingRow, 'id' | 'campId' | 'weekId' | 'packageId' | 'camp' | 'week' | 'package'>>, adminKey?: string) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (adminKey) {
    headers["x-admin-key"] = adminKey;
  }

  const response = await fetch(`/api/admin/pricing-rows/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (typeof payload?.error === "string" && payload.error) ||
      `Failed to update pricing row: ${response.statusText}`;
    throw new Error(message);
  }

  return payload;
}

async function deletePricingRow(id: string, adminKey?: string) {
  const headers: HeadersInit = {};
  if (adminKey) {
    headers["x-admin-key"] = adminKey;
  }

  const response = await fetch(`/api/admin/pricing-rows/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message =
      (typeof payload?.error === "string" && payload.error) ||
      `Failed to delete pricing row: ${response.statusText}`;
    throw new Error(message);
  }

  return true;
}

async function fetchVolumeRules(adminKey?: string) {
  const headers: HeadersInit = {};
  if (adminKey) {
    headers["x-admin-key"] = adminKey;
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch("/api/admin/volume-rules", {
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
      `Failed to fetch volume rules: ${response.statusText}`;
    throw new Error(message);
  }

  throw new Error("Failed to fetch volume rules.");
}

async function createVolumeRule(data: Omit<VolumeRule, 'id'>, adminKey?: string) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (adminKey) {
    headers["x-admin-key"] = adminKey;
  }

  const response = await fetch("/api/admin/volume-rules", {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (typeof payload?.error === "string" && payload.error) ||
      `Failed to create volume rule: ${response.statusText}`;
    throw new Error(message);
  }

  return payload;
}

async function updateVolumeRule(id: string, data: Partial<Omit<VolumeRule, 'id'>>, adminKey?: string) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (adminKey) {
    headers["x-admin-key"] = adminKey;
  }

  const response = await fetch(`/api/admin/volume-rules/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (typeof payload?.error === "string" && payload.error) ||
      `Failed to update volume rule: ${response.statusText}`;
    throw new Error(message);
  }

  return payload;
}

async function deleteVolumeRule(id: string, adminKey?: string) {
  const headers: HeadersInit = {};
  if (adminKey) {
    headers["x-admin-key"] = adminKey;
  }

  const response = await fetch(`/api/admin/volume-rules/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message =
      (typeof payload?.error === "string" && payload.error) ||
      `Failed to delete volume rule: ${response.statusText}`;
    throw new Error(message);
  }

  return true;
}

export default function PricingPage() {
  const router = useRouter();
  const [camps, setCamps] = useState<Camp[]>([]);
  const [weeks, setWeeks] = useState<HuntWeek[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pricingRows, setPricingRows] = useState<PricingRow[]>([]);
  const [volumeRules, setVolumeRules] = useState<VolumeRule[]>([]);
  const [newPricing, setNewPricing] = useState({
    campId: "",
    weekId: "",
    packageId: "",
    baseRate: 0,
    minGroupSize: 1,
    isAvailable: true,
    availabilityTag: null,
  });
  const [newVolumeRule, setNewVolumeRule] = useState({
    minHunters: 1,
    maxHunters: null as number | null,
    amountOffPerHead: 0,
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const adminKey = getAdminKeyFromStorage();
        const [campsData, pricingData, volumeData] = await Promise.all([
          fetchCampsAndPackages(adminKey || undefined),
          fetchPricingRows(adminKey || undefined),
          fetchVolumeRules(adminKey || undefined),
        ]);
        setCamps(campsData.camps);
        setWeeks(campsData.weeks);
        setPackages(campsData.packages);
        setPricingRows(pricingData);
        setVolumeRules(volumeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        clearAdminKey();
        router.push("/admin/login");
        return;
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);



  const handleAddPricingRule = async () => {
    if (
      !newPricing.campId ||
      !newPricing.weekId ||
      !newPricing.packageId ||
      newPricing.baseRate === 0
    ) {
      toast.error("Please fill in all required pricing fields");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const adminKey = getAdminKeyFromStorage();
      const { camp, week, package: pkg, ...rest } = await createPricingRow(newPricing, adminKey || undefined);
      setPricingRows([...pricingRows, { ...rest, camp, week, package: pkg }]);
      setNewPricing({
        campId: "",
        weekId: "",
        packageId: "",
        baseRate: 0,
        minGroupSize: 1,
        isAvailable: true,
        availabilityTag: null,
      });
      toast.success("Pricing rule created successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create pricing rule";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePricingRule = async (id: string) => {
    if (!confirm("Delete this pricing rule?")) return;

    setSaving(true);
    setError("");

    try {
      const adminKey = getAdminKeyFromStorage();
      await deletePricingRow(id, adminKey || undefined);
      setPricingRows(pricingRows.filter((r) => r.id !== id));
      toast.success("Pricing rule deleted successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete pricing rule";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdatePricingRule = async (id: string, field: string, value: any) => {
    setSaving(true);
    setError("");

    try {
      const adminKey = getAdminKeyFromStorage();
      const { camp, week, package: pkg, ...rest } = await updatePricingRow(id, { [field]: value }, adminKey || undefined);
      setPricingRows(
        pricingRows.map((r) => (r.id === id ? { ...rest, camp, week, package: pkg } : r))
      );
      toast.success("Pricing rule updated successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update pricing rule";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddVolumeRule = async () => {
    if (newVolumeRule.minHunters === 0) {
      toast.error("Please fill in all required volume rule fields");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const adminKey = getAdminKeyFromStorage();
      const createdRule = await createVolumeRule(newVolumeRule, adminKey || undefined);
      setVolumeRules([...volumeRules, createdRule]);
      setNewVolumeRule({
        minHunters: 1,
        maxHunters: null,
        amountOffPerHead: 0,
        displayOrder: 0,
        isActive: true,
      });
      toast.success("Volume rule created successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create volume rule";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVolumeRule = async (id: string) => {
    if (!confirm("Delete this volume rule?")) return;

    setSaving(true);
    setError("");

    try {
      const adminKey = getAdminKeyFromStorage();
      await deleteVolumeRule(id, adminKey || undefined);
      setVolumeRules(volumeRules.filter((r) => r.id !== id));
      toast.success("Volume rule deleted successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete volume rule";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateVolumeRule = async (id: string, field: string, value: any) => {
    setSaving(true);
    setError("");

    try {
      const adminKey = getAdminKeyFromStorage();
      const updatedRule = await updateVolumeRule(id, { [field]: value }, adminKey || undefined);
      setVolumeRules(volumeRules.map((r) => (r.id === id ? updatedRule : r)));
      toast.success("Volume rule updated successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update volume rule";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <AdminLoadingState label="Loading pricing rules..." />;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-black">Manage Pricing</h2>

      {error && (
        <div className="rounded-2xl border border-orange-400 bg-orange-100 p-4">
          <p className="text-black">{error}</p>
        </div>
      )}

      {/* Pricing Matrix */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-black">Pricing Matrix</h3>

        {/* Add New Pricing Rule */}
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <h4 className="mb-4 text-lg font-semibold text-black">Add Pricing Rule</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            <select
              value={newPricing.campId}
              onChange={(e) => setNewPricing({ ...newPricing, campId: e.target.value })}
              className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
              disabled={saving}
            >
              <option value="">Select Camp</option>
              {camps.map((camp) => (
                <option key={camp.id} value={camp.id}>
                  {camp.name}
                </option>
              ))}
            </select>
            <select
              value={newPricing.weekId}
              onChange={(e) => setNewPricing({ ...newPricing, weekId: e.target.value })}
              className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
              disabled={saving}
            >
              <option value="">Select Week</option>
              {weeks.map((week) => (
                <option key={week.id} value={week.id}>
                  {week.label}
                </option>
              ))}
            </select>
            <select
              value={newPricing.packageId}
              onChange={(e) => setNewPricing({ ...newPricing, packageId: e.target.value })}
              className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
              disabled={saving}
            >
              <option value="">Select Package</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.code} - {pkg.nights}N/{pkg.days}D
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Base Rate"
              value={newPricing.baseRate || ""}
              onChange={(e) =>
                setNewPricing({ ...newPricing, baseRate: parseFloat(e.target.value) })
              }
              className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
              disabled={saving}
            />
            <input
              type="number"
              placeholder="Min Group"
              value={newPricing.minGroupSize || ""}
              onChange={(e) =>
                setNewPricing({ ...newPricing, minGroupSize: parseInt(e.target.value) })
              }
              className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
              disabled={saving}
            />
          </div>
          <button
            onClick={handleAddPricingRule}
            disabled={saving}
            className="mt-4 w-full rounded-xl bg-orange-500 px-4 py-2 font-medium text-black transition hover:bg-orange-400 disabled:opacity-50 sm:w-auto"
          >
            Add Pricing Rule
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <table className="w-full">
            <thead className="border-b border-black bg-black">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Camp</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Week</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Base Rate
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Min Group
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pricingRows.map((row) => (
              <tr key={row.id} className="border-b border-black/10 hover:bg-orange-50">
                <td className="px-6 py-4">{row.camp?.name || row.campId}</td>
                <td className="px-6 py-4">{row.week?.label || row.weekId}</td>
                <td className="px-6 py-4">
                  {row.package ? `${row.package.nights}N/${row.package.days}D` : row.packageId}
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={row.baseRate}
                    onChange={(e) =>
                      handleUpdatePricingRule(row.id, "baseRate", parseFloat(e.target.value))
                    }
                    className="w-24 rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300 sm:w-32"
                    disabled={saving}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={row.minGroupSize}
                    onChange={(e) =>
                      handleUpdatePricingRule(row.id, "minGroupSize", parseInt(e.target.value))
                    }
                    className="w-24 rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300 sm:w-32"
                    disabled={saving}
                  />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeletePricingRule(row.id)}
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

      {/* Volume Discount Rules */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-black">Volume Discount Rules</h3>

        {/* Add New Volume Rule */}
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <h4 className="mb-4 text-lg font-semibold text-black">Add Volume Rule</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <input
              type="number"
              placeholder="Min Hunters"
              value={newVolumeRule.minHunters || ""}
              onChange={(e) =>
                setNewVolumeRule({ ...newVolumeRule, minHunters: parseInt(e.target.value) })
              }
              className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
              disabled={saving}
            />
            <input
              type="number"
              placeholder="Max Hunters (optional)"
              value={newVolumeRule.maxHunters || ""}
              onChange={(e) =>
                setNewVolumeRule({ ...newVolumeRule, maxHunters: e.target.value ? parseInt(e.target.value) : null })
              }
              className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
              disabled={saving}
            />
            <input
              type="number"
              placeholder="Discount per Hunter"
              value={newVolumeRule.amountOffPerHead || ""}
              onChange={(e) =>
                setNewVolumeRule({
                  ...newVolumeRule,
                  amountOffPerHead: parseFloat(e.target.value) || 0,
                })
              }
              className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
              disabled={saving}
            />
            <button
              onClick={handleAddVolumeRule}
              disabled={saving}
              className="rounded-xl bg-orange-500 px-4 py-2 font-medium text-black transition hover:bg-orange-400 disabled:opacity-50"
            >
              Add Rule
            </button>
          </div>
        </div>

        {/* Volume Rules Table */}
        <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <table className="w-full">
            <thead className="border-b border-black bg-black">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Min Hunters
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Max Hunters
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Discount per Hunter
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {volumeRules.map((rule) => (
              <tr key={rule.id} className="border-b border-black/10 hover:bg-orange-50">
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={rule.minHunters}
                    onChange={(e) =>
                      handleUpdateVolumeRule(rule.id, "minHunters", parseInt(e.target.value))
                    }
                    className="w-24 rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    disabled={saving}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={rule.maxHunters || ""}
                    onChange={(e) =>
                      handleUpdateVolumeRule(rule.id, "maxHunters", e.target.value ? parseInt(e.target.value) : null)
                    }
                    className="w-24 rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    disabled={saving}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={rule.amountOffPerHead}
                    onChange={(e) =>
                      handleUpdateVolumeRule(
                        rule.id,
                        "amountOffPerHead",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-24 rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    disabled={saving}
                  />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteVolumeRule(rule.id)}
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


    </div>
  );
}
