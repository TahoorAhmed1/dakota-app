"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import AdminLoadingState from "@/components/admin/admin-loading-state";
import { fetchAdminConfig, getAdminKeyFromStorage, updateAdminConfig } from "@/lib/admin-client";
import { CalculatorSettings } from "@/lib/calculator-settings";

type AdminConfig = {
  camps: Record<string, unknown>[];
  weeks: Record<string, unknown>[];
  packages: Record<string, unknown>[];
  pricingRows: Record<string, unknown>[];
  volumeRules: Record<string, unknown>[];
  discountRules: Record<string, unknown>[];
  settings: CalculatorSettings;
};

function parseNumberList(value: string): number[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item));
}

export default function CalculatorSettingsPage() {
  const router = useRouter();
  const [config, setConfig] = useState<AdminConfig | null>(null);
  const [settings, setSettings] = useState<CalculatorSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [depositScheduleJson, setDepositScheduleJson] = useState("");
  const [labelsJson, setLabelsJson] = useState("");

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const adminKey = getAdminKeyFromStorage();
        const data = (await fetchAdminConfig(adminKey || undefined)) as AdminConfig;
        setConfig(data);
        setSettings(data.settings);
        setDepositScheduleJson(JSON.stringify(data.settings.depositSchedule, null, 2));
        setLabelsJson(JSON.stringify(data.settings.labels, null, 2));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load configuration");
        setTimeout(() => router.push("/admin/login"), 2000);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [router]);

  const optionStrings = useMemo(() => {
    if (!settings) {
      return {
        hunterCountOptions: "",
        extraDayOptions: "",
        extraNightOptions: "",
      };
    }

    return {
      hunterCountOptions: settings.hunterCountOptions.join(", "),
      extraDayOptions: settings.extraDayOptions.join(", "),
      extraNightOptions: settings.extraNightOptions.join(", "),
    };
  }, [settings]);

  const handleSave = async () => {
    if (!config || !settings) return;

    setSaving(true);
    setError("");

    try {
      const nextSettings: CalculatorSettings = {
        ...settings,
        depositSchedule: JSON.parse(depositScheduleJson),
        labels: JSON.parse(labelsJson),
      };

      const adminKey = getAdminKeyFromStorage();
      await updateAdminConfig({ ...config, settings: nextSettings }, adminKey || undefined);
      setConfig({ ...config, settings: nextSettings });
      setSettings(nextSettings);
      toast.success("Calculator settings updated successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save calculator settings";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <AdminLoadingState label="Loading calculator settings..." />;
  }

  if (!config || !settings) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-black">Calculator Settings</h2>
        <p className="mt-2 text-sm text-black/70">
          Manage quote field options, rates, deposit schedule, and editable copy from one place.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-orange-400 bg-orange-100 p-4 text-black">{error}</div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <h3 className="text-lg font-semibold text-black">Rates</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              ["Sales Tax Rate", "salesTaxRate"],
              ["Early Bird Rate", "earlyBirdRate"],
              ["Extra Day Rate", "extraDayRate"],
              ["Extra Night Rate", "extraNightRate"],
              ["Processing Fee Rate", "processingFeeRate"],
            ].map(([label, key]) => (
              <label key={key} className="space-y-1 text-sm font-medium text-black">
                <span>{label}</span>
                <input
                  type="number"
                  step="0.0001"
                  value={settings[key as keyof CalculatorSettings] as number}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      [key]: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <h3 className="text-lg font-semibold text-black">Field Options</h3>
          <div className="mt-4 grid gap-4">
            <label className="space-y-1 text-sm font-medium text-black">
              <span>Hunter Count Options</span>
              <input
                type="text"
                value={optionStrings.hunterCountOptions}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hunterCountOptions: parseNumberList(e.target.value),
                  })
                }
                className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-black">
              <span>Extra Day Options</span>
              <input
                type="text"
                value={optionStrings.extraDayOptions}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    extraDayOptions: parseNumberList(e.target.value),
                  })
                }
                className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-black">
              <span>Extra Night Options</span>
              <input
                type="text"
                value={optionStrings.extraNightOptions}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    extraNightOptions: parseNumberList(e.target.value),
                  })
                }
                className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <h3 className="text-lg font-semibold text-black">Deposit Schedule JSON</h3>
        <textarea
          value={depositScheduleJson}
          onChange={(e) => setDepositScheduleJson(e.target.value)}
          className="mt-4 h-56 w-full rounded-xl border border-black/20 px-3 py-2 font-mono text-sm text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <h3 className="text-lg font-semibold text-black">Labels JSON</h3>
        <textarea
          value={labelsJson}
          onChange={(e) => setLabelsJson(e.target.value)}
          className="mt-4 h-130 w-full rounded-xl border border-black/20 px-3 py-2 font-mono text-sm text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-black transition hover:bg-orange-400 disabled:bg-black/30 disabled:text-white"
      >
        {saving ? "Saving..." : "Save Calculator Settings"}
      </button>
    </div>
  );
}