"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import AdminLoadingState from "@/components/admin/admin-loading-state";
import { getAdminKeyFromStorage, clearAdminKey } from "@/lib/admin-client";

// ─── Types ───────────────────────────────────────────────────────────────────

type AvailabilityTag = "OPEN" | "RESERVED" | "PENDING" | "NA";

type AvailabilityRow = {
  id: string;
  campId: string;
  campName: string;
  weekId: string;
  weekLabel: string;
  packageId: string;
  packageLabel: string;
  availabilityTag: AvailabilityTag;
  isAvailable: boolean;
};

type Camp = { id: string; name: string; slug: string };
type Week = { id: string; label: string; seasonLabel: string };
type Package = { id: string; label: string; code: string };

// ─── API helpers ─────────────────────────────────────────────────────────────

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchAvailability(adminKey?: string): Promise<AvailabilityRow[]> {
  const headers: HeadersInit = {};
  if (adminKey) headers["x-admin-key"] = adminKey;

  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch("/api/admin/availability", {
      headers,
      cache: "no-store",
    });
    const payload = await res.json().catch(() => ({}));
    if (res.ok) return payload;
    if (res.status === 503 && attempt < 2) {
      await delay(500 * (attempt + 1));
      continue;
    }
    throw new Error(
      payload?.error || payload?.message || `Failed to fetch availability: ${res.statusText}`
    );
  }
  throw new Error("Failed to fetch availability.");
}

async function updateAvailability(
  id: string,
  availabilityTag: AvailabilityTag,
  adminKey?: string
): Promise<AvailabilityRow> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (adminKey) headers["x-admin-key"] = adminKey;

  const res = await fetch(`/api/admin/availability/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ availabilityTag }),
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      payload?.error || payload?.message || `Failed to update: ${res.statusText}`
    );
  }
  return payload;
}

// ─── Tag config ──────────────────────────────────────────────────────────────

const TAG_STYLES: Record<AvailabilityTag, { bg: string; text: string; border: string }> = {
  OPEN:     { bg: "bg-green-100",  text: "text-green-800",  border: "border-green-300" },
  RESERVED: { bg: "bg-red-100",    text: "text-red-800",    border: "border-red-300" },
  PENDING:  { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300" },
  NA:       { bg: "bg-gray-100",   text: "text-gray-500",   border: "border-gray-200" },
};

const ALL_TAGS: AvailabilityTag[] = ["OPEN", "RESERVED", "PENDING", "NA"];

// ─── Component ───────────────────────────────────────────────────────────────

export default function AvailabilityPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null); // row id being saved
  const [error, setError] = useState("");
  const [rows, setRows] = useState<AvailabilityRow[]>([]);

  // Filters
  const [filterSeason, setFilterSeason] = useState<string>("all");
  const [filterCamp, setFilterCamp] = useState<string>("all");
  const [filterPackage, setFilterPackage] = useState<string>("all");
  const [filterTag, setFilterTag] = useState<string>("all");

  useEffect(() => {
    (async () => {
      try {
        const adminKey = getAdminKeyFromStorage();
        const data = await fetchAvailability(adminKey || undefined);
        setRows(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load availability");
        clearAdminKey();
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  // Derived filter options
  const seasons = Array.from(new Set(rows.map((r) => r.weekLabel.match(/\d{4}/)?.[0] ?? ""))).filter(Boolean).sort();
  const camps: Camp[] = Array.from(
    new Map(rows.map((r) => [r.campId, { id: r.campId, name: r.campName, slug: r.campId }])).values()
  );
  const packages: Package[] = Array.from(
    new Map(rows.map((r) => [r.packageId, { id: r.packageId, label: r.packageLabel, code: r.packageId }])).values()
  );

  const filtered = rows.filter((r) => {
    if (filterSeason !== "all" && !r.weekLabel.includes(filterSeason)) return false;
    if (filterCamp !== "all" && r.campId !== filterCamp) return false;
    if (filterPackage !== "all" && r.packageId !== filterPackage) return false;
    if (filterTag !== "all" && r.availabilityTag !== filterTag) return false;
    return true;
  });

  const handleTagChange = async (row: AvailabilityRow, tag: AvailabilityTag) => {
    if (tag === row.availabilityTag) return;
    setSaving(row.id);
    setError("");
    try {
      const adminKey = getAdminKeyFromStorage();
      const updated = await updateAvailability(row.id, tag, adminKey || undefined);
      setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      toast.success(`Updated to ${tag}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(null);
    }
  };

  // Summary counts
  const counts = rows.reduce(
    (acc, r) => {
      acc[r.availabilityTag] = (acc[r.availabilityTag] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  if (loading) return <AdminLoadingState label="Loading availability..." />;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-black">Manage Availability</h2>

      {/* Summary badges */}
      <div className="flex flex-wrap gap-3">
        {ALL_TAGS.map((tag) => {
          const s = TAG_STYLES[tag];
          return (
            <span
              key={tag}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${s.bg} ${s.text} ${s.border}`}
            >
              {tag}
              <span className="rounded-full bg-white/60 px-1.5 py-0.5 text-xs font-bold">
                {counts[tag] ?? 0}
              </span>
            </span>
          );
        })}
      </div>

      {error && (
        <div className="rounded-2xl border border-orange-400 bg-orange-100 p-4">
          <p className="text-black">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {/* Season */}
          <div>
            <label className="mb-1 block text-xs font-medium text-black/60">Season</label>
            <select
              value={filterSeason}
              onChange={(e) => setFilterSeason(e.target.value)}
              className="w-full rounded-xl border border-black/20 px-3 py-2 text-sm text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="all">All Seasons</option>
              {seasons.map((s) => (
                <option key={s} value={s}>{s} Season</option>
              ))}
            </select>
          </div>

          {/* Camp */}
          <div>
            <label className="mb-1 block text-xs font-medium text-black/60">Camp</label>
            <select
              value={filterCamp}
              onChange={(e) => setFilterCamp(e.target.value)}
              className="w-full rounded-xl border border-black/20 px-3 py-2 text-sm text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="all">All Camps</option>
              {camps.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Package */}
          <div>
            <label className="mb-1 block text-xs font-medium text-black/60">Package</label>
            <select
              value={filterPackage}
              onChange={(e) => setFilterPackage(e.target.value)}
              className="w-full rounded-xl border border-black/20 px-3 py-2 text-sm text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="all">All Packages</option>
              {packages.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Tag */}
          <div>
            <label className="mb-1 block text-xs font-medium text-black/60">Status</label>
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="w-full rounded-xl border border-black/20 px-3 py-2 text-sm text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="all">All Statuses</option>
              {ALL_TAGS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-2 text-xs text-black/40">
          Showing {filtered.length} of {rows.length} rows
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <table className="w-full">
          <thead className="border-b border-black bg-black">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Camp</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Week</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Package</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-sm text-black/40">
                  No rows match your filters.
                </td>
              </tr>
            )}
            {filtered.map((row) => {
              const isSaving = saving === row.id;
              const s = TAG_STYLES[row.availabilityTag];
              return (
                <tr key={row.id} className="border-b border-black/10 hover:bg-orange-50">
                  <td className="px-6 py-4 text-sm font-medium text-black">{row.campName}</td>
                  <td className="px-6 py-4 text-sm text-black/70">{row.weekLabel}</td>
                  <td className="px-6 py-4 text-sm text-black/70">{row.packageLabel}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={row.availabilityTag}
                        onChange={(e) => handleTagChange(row, e.target.value as AvailabilityTag)}
                        disabled={isSaving}
                        className={`rounded-xl border px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50 ${s.bg} ${s.text} ${s.border}`}
                      >
                        {ALL_TAGS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      {isSaving && (
                        <span className="text-xs text-black/40 animate-pulse">Saving…</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}