"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
      alert("Discount rules updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
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
    return <div className="text-lg text-gray-600">Loading discount rules...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Manage Discounts</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>FIXED:</strong> Subtract a fixed dollar amount | <strong>PERCENT:</strong> Subtract a percentage of base rate
        </p>
      </div>

      {/* Add New Discount */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Discount</h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <input
            type="text"
            placeholder="Code (e.g., MILITARY)"
            value={newDiscount.code}
            onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Label (e.g., Military Discount)"
            value={newDiscount.label}
            onChange={(e) => setNewDiscount({ ...newDiscount, label: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded"
          />
          <select
            value={newDiscount.type || ""}
            onChange={(e) => setNewDiscount({ ...newDiscount, type: e.target.value as "FIXED" | "PERCENT" })}
            className="px-3 py-2 border border-gray-300 rounded"
          >
            <option value="FIXED">Fixed ($)</option>
            <option value="PERCENT">Percent (%)</option>
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={newDiscount.amount || ""}
            onChange={(e) => setNewDiscount({ ...newDiscount, amount: parseInt(e.target.value) })}
            className="px-3 py-2 border border-gray-300 rounded"
          />
          <select
            value={newDiscount.category || ""}
            onChange={(e) => setNewDiscount({ ...newDiscount, category: e.target.value as "INDIVIDUAL" | "JUNIOR" })}
            className="px-3 py-2 border border-gray-300 rounded"
          >
            <option value="INDIVIDUAL">Individual</option>
            <option value="JUNIOR">Junior</option>
          </select>
          <button
            onClick={handleAddDiscount}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition font-medium"
          >
            Add Discount
          </button>
        </div>
      </div>

      {/* Discounts List */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Code</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Label</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Active</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={discount.code}
                    onChange={(e) => handleUpdateDiscount(idx, "code", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded w-full"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={discount.label}
                    onChange={(e) => handleUpdateDiscount(idx, "label", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded w-full"
                  />
                </td>
                <td className="px-6 py-4">
                  <select
                    value={discount.type}
                    onChange={(e) => handleUpdateDiscount(idx, "type", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded w-full"
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
                    className="px-3 py-2 border border-gray-300 rounded w-24"
                  />
                </td>
                <td className="px-6 py-4">
                  <select
                    value={discount.category}
                    onChange={(e) => handleUpdateDiscount(idx, "category", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded w-full"
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
                    className="w-4 h-4"
                  />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteDiscount(idx)}
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
