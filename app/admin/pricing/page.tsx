"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import AdminLoadingState from "@/components/admin/admin-loading-state";
import { fetchAdminConfig, updateAdminConfig, getAdminKeyFromStorage } from "@/lib/admin-client";

type Camp = { id: string; name: string };
type HuntWeek = { id: string; label: string };
type Package = { id: string; nights: number; days: number };
type PricingRow = {
  campId: string;
  weekId: string;
  packageId: string;
  baseRate: number;
  minGroupSize: number;
};
type VolumeRule = {
  minHunters: number;
  maxHunters: number;
  discountPerHunter: number;
};

type CalculatorConfig = {
  camps: Camp[];
  weeks: HuntWeek[];
  packages: Package[];
  pricingRows: PricingRow[];
  volumeRules: VolumeRule[];
  discountRules: Record<string, unknown>[];
};

export default function PricingPage() {
  const router = useRouter();
  const [config, setConfig] = useState<CalculatorConfig | null>(null);
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
    minGroupSize: 0,
  });
  const [newVolumeRule, setNewVolumeRule] = useState({
    minHunters: 0,
    maxHunters: 0,
    discountPerHunter: 0,
  });

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const adminKey = getAdminKeyFromStorage();
        const data = await fetchAdminConfig(adminKey || undefined);
        setConfig(data);
        setPricingRows(data.pricingRows);
        setVolumeRules(data.volumeRules);
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
      const updatedConfig = { ...config, pricingRows, volumeRules };
      await updateAdminConfig(updatedConfig, adminKey || undefined);
      toast.success("Pricing rules updated successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save changes";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddPricingRule = () => {
    if (
      !newPricing.campId ||
      !newPricing.weekId ||
      !newPricing.packageId ||
      newPricing.baseRate === 0
    ) {
      setError("Please fill in all pricing fields");
      return;
    }
    setPricingRows([...pricingRows, newPricing]);
    setNewPricing({
      campId: "",
      weekId: "",
      packageId: "",
      baseRate: 0,
      minGroupSize: 0,
    });
  };

  const handleDeletePricingRule = (index: number) => {
    if (confirm("Delete this pricing rule?")) {
      setPricingRows(pricingRows.filter((_, i) => i !== index));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdatePricingRule = (index: number, field: string, value: any) => {
    const updated = [...pricingRows];
    updated[index] = { ...updated[index], [field]: value };
    setPricingRows(updated);
  };

  const handleAddVolumeRule = () => {
    if (newVolumeRule.minHunters === 0 || newVolumeRule.maxHunters === 0) {
      setError("Please fill in all volume rule fields");
      return;
    }
    setVolumeRules([...volumeRules, newVolumeRule]);
    setNewVolumeRule({
      minHunters: 0,
      maxHunters: 0,
      discountPerHunter: 0,
    });
  };

  const handleDeleteVolumeRule = (index: number) => {
    if (confirm("Delete this volume rule?")) {
      setVolumeRules(volumeRules.filter((_, i) => i !== index));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateVolumeRule = (index: number, field: string, value: any) => {
    const updated = [...volumeRules];
    updated[index] = { ...updated[index], [field]: value };
    setVolumeRules(updated);
  };

  if (loading) {
    return <AdminLoadingState label="Loading pricing rules..." />;
  }

  if (!config) {
    return null;
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <select
              value={newPricing.campId}
              onChange={(e) => setNewPricing({ ...newPricing, campId: e.target.value })}
              className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="">Select Camp</option>
              {config.camps.map((camp) => (
                <option key={camp.id} value={camp.id}>
                  {camp.name}
                </option>
              ))}
            </select>
            <select
              value={newPricing.weekId}
              onChange={(e) => setNewPricing({ ...newPricing, weekId: e.target.value })}
              className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="">Select Week</option>
              {config.weeks.map((week) => (
                <option key={week.id} value={week.id}>
                  {week.label}
                </option>
              ))}
            </select>
            <select
              value={newPricing.packageId}
              onChange={(e) => setNewPricing({ ...newPricing, packageId: e.target.value })}
              className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="">Select Package</option>
              {config.packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.nights}N/{pkg.days}D
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Base Rate"
              value={newPricing.baseRate || ""}
              onChange={(e) =>
                setNewPricing({ ...newPricing, baseRate: parseInt(e.target.value) })
              }
              className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <input
              type="number"
              placeholder="Min Group"
              value={newPricing.minGroupSize || ""}
              onChange={(e) =>
                setNewPricing({ ...newPricing, minGroupSize: parseInt(e.target.value) })
              }
              className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <button
            onClick={handleAddPricingRule}
            className="mt-4 rounded-xl bg-orange-500 px-4 py-2 font-medium text-black transition hover:bg-orange-400"
          >
            Add Pricing Rule
          </button>
        </div>

        {/* Pricing Rules Table */}
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
              {pricingRows.map((row, idx) => {
                const camp = config.camps.find((c) => c.id === row.campId);
                const week = config.weeks.find((w) => w.id === row.weekId);
                const pkg = config.packages.find((p) => p.id === row.packageId);
                return (
                  <tr key={idx} className="border-b border-black/10 hover:bg-orange-50">
                    <td className="px-6 py-4">{camp?.name || row.campId}</td>
                    <td className="px-6 py-4">{week?.label || row.weekId}</td>
                    <td className="px-6 py-4">
                      {pkg ? `${pkg.nights}N/${pkg.days}D` : row.packageId}
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={row.baseRate}
                        onChange={(e) =>
                          handleUpdatePricingRule(idx, "baseRate", parseInt(e.target.value))
                        }
                        className="w-32 rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={row.minGroupSize}
                        onChange={(e) =>
                          handleUpdatePricingRule(idx, "minGroupSize", parseInt(e.target.value))
                        }
                        className="w-32 rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeletePricingRule(idx)}
                        className="rounded-lg bg-black px-3 py-1 text-sm text-white transition hover:bg-orange-500 hover:text-black"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="number"
              placeholder="Min Hunters"
              value={newVolumeRule.minHunters || ""}
              onChange={(e) =>
                setNewVolumeRule({ ...newVolumeRule, minHunters: parseInt(e.target.value) })
              }
              className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <input
              type="number"
              placeholder="Max Hunters"
              value={newVolumeRule.maxHunters || ""}
              onChange={(e) =>
                setNewVolumeRule({ ...newVolumeRule, maxHunters: parseInt(e.target.value) })
              }
              className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <input
              type="number"
              placeholder="Discount per Hunter"
              value={newVolumeRule.discountPerHunter || ""}
              onChange={(e) =>
                setNewVolumeRule({
                  ...newVolumeRule,
                  discountPerHunter: parseInt(e.target.value),
                })
              }
              className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <button
              onClick={handleAddVolumeRule}
              className="rounded-xl bg-orange-500 px-4 py-2 font-medium text-black transition hover:bg-orange-400"
            >
              Add Rule
            </button>
          </div>
        </div>

        {/* Volume Rules Table */}
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
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
              {volumeRules.map((rule, idx) => (
                <tr key={idx} className="border-b border-black/10 hover:bg-orange-50">
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={rule.minHunters}
                      onChange={(e) =>
                        handleUpdateVolumeRule(idx, "minHunters", parseInt(e.target.value))
                      }
                      className="w-24 rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={rule.maxHunters}
                      onChange={(e) =>
                        handleUpdateVolumeRule(idx, "maxHunters", parseInt(e.target.value))
                      }
                      className="w-24 rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={rule.discountPerHunter}
                      onChange={(e) =>
                        handleUpdateVolumeRule(
                          idx,
                          "discountPerHunter",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-24 rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteVolumeRule(idx)}
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
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-black transition hover:bg-orange-400 disabled:bg-black/30 disabled:text-white"
      >
        {saving ? "Saving..." : "Save All Changes"}
      </button>
    </div>
  );
}
