"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AdminLoadingState from "@/components/admin/admin-loading-state";
import { fetchAdminConfig, getAdminKeyFromStorage, updateAdminConfig, clearAdminKey } from "@/lib/admin-client";
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

  // JSON editors
  const [depositScheduleJson, setDepositScheduleJson] = useState("");
  const [labelsJson, setLabelsJson] = useState("");

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const adminKey = getAdminKeyFromStorage();
        const data = (await fetchAdminConfig(adminKey || undefined)) as AdminConfig;

        setConfig(data);
        setSettings(data.settings);

        setDepositScheduleJson(JSON.stringify(data.settings.depositSchedule || {}, null, 2));
        setLabelsJson(JSON.stringify(data.settings.labels || {}, null, 2));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load configuration";
        setError(message);
        clearAdminKey();
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [router]);

  const optionStrings = useMemo(() => {
    if (!settings) {
      return { hunterCountOptions: "", extraDayOptions: "", extraNightOptions: "" };
    }
    return {
      hunterCountOptions: settings.hunterCountOptions?.join(", ") || "",
      extraDayOptions: settings.extraDayOptions?.join(", ") || "",
      extraNightOptions: settings.extraNightOptions?.join(", ") || "",
    };
  }, [settings]);

  const handleSave = async () => {
    if (!config || !settings) return;

    setSaving(true);
    setError("");

    try {
      // Validate and parse JSON
      let parsedDepositSchedule = {};
      let parsedLabels = {};

      try {
        parsedDepositSchedule = JSON.parse(depositScheduleJson);
      } catch {
        throw new Error("Invalid JSON in Deposit Schedule");
      }

      try {
        parsedLabels = JSON.parse(labelsJson);
      } catch {
        throw new Error("Invalid JSON in Labels");
      }

      const nextSettings: any = {
        ...settings,
        depositSchedule: parsedDepositSchedule,
        labels: parsedLabels,
      };

      const adminKey = getAdminKeyFromStorage();
      await updateAdminConfig({ ...config, settings: nextSettings }, adminKey || undefined);

      setConfig({ ...config, settings: nextSettings });
      setSettings(nextSettings);

      toast.success("Calculator settings updated successfully!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save settings";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const resetJsonToDefault = (field: "deposit" | "labels") => {
    if (!settings) return;

    if (field === "deposit") {
      setDepositScheduleJson(JSON.stringify(settings.depositSchedule || {}, null, 2));
    } else {
      setLabelsJson(JSON.stringify(settings.labels || {}, null, 2));
    }
    toast.info("JSON reset to current saved value");
  };

  if (loading) {
    return <AdminLoadingState label="Loading calculator settings..." />;
  }

  if (!config || !settings) {
    return <div className="p-8 text-red-600">Failed to load settings. Please try again.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-black">Calculator Settings</h2>
        <p className="mt-2 text-sm text-black/70">
          Manage rates, field options, deposit schedule, labels, and other calculator configuration.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-400 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Rates Section */}
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <h3 className="text-lg font-semibold text-black mb-4">Rates</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Sales Tax Rate (%)", "salesTaxRate"],
              ["Early Bird Rate (%)", "earlyBirdRate"],
              ["Extra Day Rate", "extraDayRate"],
              ["Extra Night Rate", "extraNightRate"],
              ["Processing Fee Rate (%)", "processingFeeRate"],
            ].map(([label, key]) => (
              <label key={key} className="space-y-1 text-sm font-medium text-black">
                <span>{label}</span>
                <input
                  type="number"
                  step="0.0001"
                  value={settings[key as keyof CalculatorSettings] as number ?? 0}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      [key]: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-black/20 px-3 py-2.5 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Field Options */}
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <h3 className="text-lg font-semibold text-black mb-4">Field Options</h3>
          <div className="grid gap-4">
            <label className="space-y-1 text-sm font-medium text-black">
              <span>Hunter Count Options (comma separated)</span>
              <input
                type="text"
                value={optionStrings.hunterCountOptions}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hunterCountOptions: parseNumberList(e.target.value),
                  })
                }
                className="w-full rounded-xl border border-black/20 px-3 py-2.5 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                placeholder="1, 2, 3, 4, 5, 6, 7, 8"
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
                className="w-full rounded-xl border border-black/20 px-3 py-2.5 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                placeholder="0, 1, 2, 3"
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
                className="w-full rounded-xl border border-black/20 px-3 py-2.5 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                placeholder="0, 1, 2, 3, 4"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Deposit Schedule JSON */}
      {/* <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-black">Deposit Schedule (JSON)</h3>
          <button
            type="button"
            onClick={() => resetJsonToDefault("deposit")}
            className="text-xs text-orange-600 hover:underline"
          >
            Reset to saved value
          </button>
        </div>
        <textarea
          value={depositScheduleJson}
          onChange={(e) => setDepositScheduleJson(e.target.value)}
          className="mt-2 h-56 w-full rounded-xl border border-black/20 px-4 py-3 font-mono text-sm text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
          spellCheck={false}
        />
        <p className="mt-2 text-xs text-black/50">Example: array of objects with percentage and daysBefore</p>
      </div> */}

      {/* Labels JSON */}
      {/* <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-black">Labels & Copy (JSON)</h3>
          <button
            type="button"
            onClick={() => resetJsonToDefault("labels")}
            className="text-xs text-orange-600 hover:underline"
          >
            Reset to saved value
          </button>
        </div>
        <textarea
          value={labelsJson}
          onChange={(e) => setLabelsJson(e.target.value)}
          className="mt-2 h-96 w-full rounded-xl border border-black/20 px-4 py-3 font-mono text-sm text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
          spellCheck={false}
        />
      </div> */}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-xl bg-orange-500 px-8 py-3.5 font-semibold text-white transition hover:bg-orange-600 disabled:bg-black/30 disabled:text-white sm:w-auto"
      >
        {saving ? "Saving Changes..." : "Save All Calculator Settings"}
      </button>
    </div>
  );
}