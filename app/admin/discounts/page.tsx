"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import AdminLoadingState from "@/components/admin/admin-loading-state";
import { fetchAdminConfig, updateAdminConfig, getAdminKeyFromStorage } from "@/lib/admin-client";

type DiscountRule = {
  code: string;
  label: string;
  type: "FIXED" | "PERCENT";
  amount: number;
  category: "INDIVIDUAL" | "JUNIOR";
  active: boolean;
};

type CalculatorConfig = {
  camps: Record<string, unknown>[];
  weeks: Record<string, unknown>[];
  packages: Record<string, unknown>[];
  pricingRows: Record<string, unknown>[];
  volumeRules: Record<string, unknown>[];
  discountRules: DiscountRule[];
};

export default function DiscountsPage() {
  const router = useRouter();
  const [config, setConfig] = useState<CalculatorConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [discounts, setDiscounts] = useState<DiscountRule[]>([]);
  const [newDiscount, setNewDiscount] = useState<Partial<DiscountRule>>({
    code: "",
    label: "",
    type: "FIXED",
    amount: 0,
    category: "INDIVIDUAL",
    active: true,
  });

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const adminKey = getAdminKeyFromStorage();
        const data = await fetchAdminConfig(adminKey || undefined);
        setConfig(data);
        setDiscounts(data.discountRules);
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
      const updatedConfig = { ...config, discountRules: discounts };
      await updateAdminConfig(updatedConfig, adminKey || undefined);
      toast.success("Discount rules updated successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save changes";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddDiscount = () => {
    if (!newDiscount.code || !newDiscount.label || newDiscount.amount === 0) {
      setError("Please fill in all discount fields");
      return;
    }
    setDiscounts([...discounts, newDiscount as DiscountRule]);
    setNewDiscount({
      code: "",
      label: "",
      type: "FIXED",
      amount: 0,
      category: "INDIVIDUAL",
      active: true,
    });
  };

  const handleDeleteDiscount = (index: number) => {
    if (confirm("Are you sure you want to delete this discount?")) {
      setDiscounts(discounts.filter((_, i) => i !== index));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateDiscount = (index: number, field: keyof DiscountRule, value: any) => {
    const updated = [...discounts];
    updated[index] = { ...updated[index], [field]: value };
    setDiscounts(updated);
  };

  if (loading) {
    return <AdminLoadingState label="Loading discount rules..." />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-black">Manage Discounts</h2>

      {error && (
        <div className="rounded-2xl border border-orange-400 bg-orange-100 p-4">
          <p className="text-black">{error}</p>
        </div>
      )}

      {/* Info Box */}
      <div className="rounded-2xl border border-orange-400 bg-orange-100 p-4">
        <p className="text-sm text-black">
          <strong>FIXED:</strong> Subtract a fixed dollar amount | <strong>PERCENT:</strong> Subtract a percentage of base rate
        </p>
      </div>

      {/* Add New Discount */}
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <h3 className="mb-4 text-lg font-semibold text-black">Add New Discount</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
          <input
            type="text"
            placeholder="Code (e.g., MILITARY)"
            value={newDiscount.code}
            onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value })}
            className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <input
            type="text"
            placeholder="Label (e.g., Military Discount)"
            value={newDiscount.label}
            onChange={(e) => setNewDiscount({ ...newDiscount, label: e.target.value })}
            className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <select
            value={newDiscount.type || ""}
            onChange={(e) => setNewDiscount({ ...newDiscount, type: e.target.value as "FIXED" | "PERCENT" })}
            className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            <option value="FIXED">Fixed ($)</option>
            <option value="PERCENT">Percent (%)</option>
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={newDiscount.amount || ""}
            onChange={(e) => setNewDiscount({ ...newDiscount, amount: parseInt(e.target.value) })}
            className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <select
            value={newDiscount.category || ""}
            onChange={(e) => setNewDiscount({ ...newDiscount, category: e.target.value as "INDIVIDUAL" | "JUNIOR" })}
            className="rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            <option value="INDIVIDUAL">Individual</option>
            <option value="JUNIOR">Junior</option>
          </select>
          <button
            onClick={handleAddDiscount}
            className="rounded-xl bg-orange-500 px-4 py-2 font-medium text-black transition hover:bg-orange-400"
          >
            Add Discount
          </button>
        </div>
      </div>

      {/* Discounts List */}
      <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <table className="w-full">
          <thead className="border-b border-black bg-black">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Code</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Label</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Active</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount, idx) => (
              <tr key={idx} className="border-b border-black/10 hover:bg-orange-50">
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={discount.code}
                    onChange={(e) => handleUpdateDiscount(idx, "code", e.target.value)}
                    className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={discount.label}
                    onChange={(e) => handleUpdateDiscount(idx, "label", e.target.value)}
                    className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </td>
                <td className="px-6 py-4">
                  <select
                    value={discount.type}
                    onChange={(e) => handleUpdateDiscount(idx, "type", e.target.value)}
                    className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    <option value="FIXED">Fixed</option>
                    <option value="PERCENT">Percent</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={discount.amount}
                    onChange={(e) => handleUpdateDiscount(idx, "amount", parseInt(e.target.value))}
                    className="w-24 rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </td>
                <td className="px-6 py-4">
                  <select
                    value={discount.category}
                    onChange={(e) => handleUpdateDiscount(idx, "category", e.target.value)}
                    className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="JUNIOR">Junior</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={discount.active}
                    onChange={(e) => handleUpdateDiscount(idx, "active", e.target.checked)}
                    className="h-4 w-4 accent-orange-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteDiscount(idx)}
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
