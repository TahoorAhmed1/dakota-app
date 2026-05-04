"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import AdminLoadingState from "@/components/admin/admin-loading-state";
import { getAdminKeyFromStorage, clearAdminKey } from "@/lib/admin-client";

// ─── Types ────────────────────────────────────────────────────────────────────

type AvailabilityTag = "OPEN" | "RESERVED" | "PENDING" | "NA";

type SlotRow = {
  id: string;
  campId: string;
  campName: string;
  weekId: string;
  weekLabel: string;
  packageId: string;
  packageLabel: string;
  packageCode: string;
  availabilityTag: AvailabilityTag;
  isAvailable: boolean;
  minGroupSize: number;
  lodgingCapacity: number;
  hoverText: string;
};

// ─── API helpers ──────────────────────────────────────────────────────────────

async function fetchRows(adminKey?: string): Promise<SlotRow[]> {
  const res = await fetch("/api/admin/availability", {
    headers: adminKey ? { "x-admin-key": adminKey } : {},
    cache: "no-store",
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(payload?.error || "Failed to load");
  return payload;
}

async function patchSlot(
  id: string,
  patch: {
    availabilityTag: AvailabilityTag;
    minGroupSize?: number;
    lodgingCapacity?: number;
    hoverText?: string | null;
  },
  adminKey?: string
): Promise<SlotRow> {
  const res = await fetch(`/api/admin/availability/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(adminKey ? { "x-admin-key": adminKey } : {}),
    },
    body: JSON.stringify(patch),
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(payload?.error || "Failed to update");
  return payload;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TAG_META: Record<AvailabilityTag, { label: string; bg: string; text: string; dot: string }> = {
  OPEN:     { label: "Open",     bg: "bg-green-100",  text: "text-green-800",  dot: "bg-green-500" },
  PENDING:  { label: "Pending",  bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-500" },
  RESERVED: { label: "Reserved", bg: "bg-red-100",    text: "text-red-800",    dot: "bg-red-500" },
  NA:       { label: "N/A",      bg: "bg-gray-100",   text: "text-gray-500",   dot: "bg-gray-300" },
};
const ALL_TAGS: AvailabilityTag[] = ["OPEN", "PENDING", "RESERVED", "NA"];

// ─── Slot cell (inline-edit panel) ───────────────────────────────────────────

type CellEdit = {
  tag: AvailabilityTag;
  minGroupSize: string;
  lodgingCapacity: string;
  hoverText: string;
};

function SlotCell({
  slot,
  onSaved,
  adminKey,
}: {
  slot: SlotRow;
  onSaved: (updated: SlotRow) => void;
  adminKey: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [edit, setEdit] = useState<CellEdit>({
    tag: slot.availabilityTag,
    minGroupSize: String(slot.minGroupSize),
    lodgingCapacity: String(slot.lodgingCapacity),
    hoverText: slot.hoverText ?? "",
  });
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEdit({
      tag: slot.availabilityTag,
      minGroupSize: String(slot.minGroupSize),
      lodgingCapacity: String(slot.lodgingCapacity),
      hoverText: slot.hoverText ?? "",
    });
  }, [slot]);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const isDirty =
    edit.tag !== slot.availabilityTag ||
    edit.minGroupSize !== String(slot.minGroupSize) ||
    edit.lodgingCapacity !== String(slot.lodgingCapacity) ||
    edit.hoverText !== (slot.hoverText ?? "");

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await patchSlot(
        slot.id,
        {
          availabilityTag: edit.tag,
          minGroupSize: parseInt(edit.minGroupSize, 10) || slot.minGroupSize,
          lodgingCapacity: parseInt(edit.lodgingCapacity, 10),
          hoverText: edit.hoverText || null,
        },
        adminKey ?? undefined
      );
      onSaved(updated);
      setOpen(false);
      toast.success(`${slot.campName} / ${slot.weekLabel} updated`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const meta = TAG_META[slot.availabilityTag];

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center gap-1.5 rounded-lg border px-2 py-1.5 text-left text-[11px] font-semibold transition-colors hover:opacity-80 ${meta.bg} ${meta.text} border-current/20`}
      >
        <span className={`h-2 w-2 shrink-0 rounded-full ${meta.dot}`} />
        <span className="truncate">{slot.packageCode}</span>
        <span className="ml-auto shrink-0 opacity-60">✎</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-2xl border border-black/10 bg-white p-4 shadow-2xl">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-black/40">
            {slot.campName} · {slot.weekLabel} · {slot.packageLabel}
          </p>

          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-black/60">Status</label>
            <div className="grid grid-cols-2 gap-1.5">
              {ALL_TAGS.map((t) => {
                const m = TAG_META[t];
                return (
                  <button
                    key={t}
                    onClick={() => setEdit((d) => ({ ...d, tag: t }))}
                    className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs font-semibold transition-all ${
                      edit.tag === t
                        ? `${m.bg} ${m.text} border-current ring-2 ring-offset-1 ring-orange-400`
                        : "border-black/10 bg-gray-50 text-black/50 hover:bg-gray-100"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${m.dot}`} />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-black/60">Min. Group</label>
              <input
                type="number"
                min={1}
                value={edit.minGroupSize}
                onChange={(e) => setEdit((d) => ({ ...d, minGroupSize: e.target.value }))}
                className="w-full rounded-xl border border-black/20 px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-black/60">Lodging Cap.</label>
              <input
                type="number"
                min={0}
                value={edit.lodgingCapacity}
                onChange={(e) => setEdit((d) => ({ ...d, lodgingCapacity: e.target.value }))}
                className="w-full rounded-xl border border-black/20 px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium text-black/60">Hover Tooltip Text</label>
            <textarea
              rows={3}
              placeholder="e.g. 4 spots available · 3-day package · min 4 hunters"
              value={edit.hoverText}
              onChange={(e) => setEdit((d) => ({ ...d, hoverText: e.target.value }))}
              className="w-full resize-none rounded-xl border border-black/20 px-2 py-1.5 text-sm placeholder:text-black/30 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving || !isDirty}
              className="flex-1 rounded-xl bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-40"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-xl border border-black/20 px-3 py-1.5 text-sm font-medium text-black/60 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AvailabilityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rows, setRows] = useState<SlotRow[]>([]);
  const [adminKey, setAdminKey] = useState<string | null>(null);

  const [filterCamp, setFilterCamp] = useState("all");
  const [filterWeek, setFilterWeek] = useState("all");
  const [filterTag, setFilterTag] = useState("all");

  useEffect(() => {
    const key = getAdminKeyFromStorage();
    setAdminKey(key);
    (async () => {
      try {
        const data = await fetchRows(key ?? undefined);
        setRows(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
        clearAdminKey();
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const handleSaved = (updated: SlotRow) => {
    setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const camps = Array.from(new Map(rows.map((r) => [r.campId, r.campName])).entries());
  const weeks = Array.from(new Map(rows.map((r) => [r.weekId, r.weekLabel])).entries());

  const filteredRows = rows.filter((r) => {
    if (filterCamp !== "all" && r.campId !== filterCamp) return false;
    if (filterWeek !== "all" && r.weekId !== filterWeek) return false;
    if (filterTag !== "all" && r.availabilityTag !== filterTag) return false;
    return true;
  });

  const visibleCamps = filterCamp === "all" ? camps : camps.filter(([id]) => id === filterCamp);
  const visibleWeeks = filterWeek === "all" ? weeks : weeks.filter(([id]) => id === filterWeek);

  type Grid = Record<string, Record<string, SlotRow[]>>;
  const grid: Grid = {};
  for (const [campId] of visibleCamps) {
    grid[campId] = {};
    for (const [weekId] of visibleWeeks) {
      grid[campId][weekId] = [];
    }
  }
  for (const row of filteredRows) {
    if (grid[row.campId]?.[row.weekId] !== undefined) {
      grid[row.campId][row.weekId].push(row);
    }
  }

  const counts = rows.reduce((acc, r) => {
    acc[r.availabilityTag] = (acc[r.availabilityTag] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) return <AdminLoadingState label="Loading schedule…" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-black">Season Schedule</h2>
          <p className="mt-1 text-sm text-black/50">
            Click any slot to edit status, group minimum, lodging capacity, and hover tooltip.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((tag) => {
            const m = TAG_META[tag];
            return (
              <span
                key={tag}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${m.bg} ${m.text}`}
              >
                <span className={`h-2 w-2 rounded-full ${m.dot}`} />
                {m.label}
                <span className="rounded-full bg-white/60 px-1.5 py-0.5 text-[10px] font-bold">
                  {counts[tag] ?? 0}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-black/50">Camp</label>
            <select
              value={filterCamp}
              onChange={(e) => setFilterCamp(e.target.value)}
              className="w-full rounded-xl border border-black/20 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="all">All Camps</option>
              {camps.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-black/50">Week</label>
            <select
              value={filterWeek}
              onChange={(e) => setFilterWeek(e.target.value)}
              className="w-full rounded-xl border border-black/20 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="all">All Weeks</option>
              {weeks.map(([id, label]) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-black/50">Status</label>
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="w-full rounded-xl border border-black/20 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="all">All Statuses</option>
              {ALL_TAGS.map((t) => (
                <option key={t} value={t}>{TAG_META[t].label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-black bg-black">
              <th className="sticky left-0 z-10 bg-black px-4 py-3 text-left font-semibold text-white whitespace-nowrap">
                Camp
              </th>
              {visibleWeeks.map(([weekId, weekLabel]) => (
                <th
                  key={weekId}
                  className="px-3 py-3 text-center font-semibold text-white whitespace-nowrap min-w-35"
                >
                  {weekLabel}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleCamps.length === 0 && (
              <tr>
                <td
                  colSpan={visibleWeeks.length + 1}
                  className="px-4 py-10 text-center text-black/40"
                >
                  No data matches your filters.
                </td>
              </tr>
            )}
            {visibleCamps.map(([campId, campName], campIdx) => (
              <tr key={campId} className={campIdx % 2 === 0 ? "bg-white" : "bg-orange-50/40"}>
                <td className="sticky left-0 z-10 border-r border-black/10 bg-inherit px-4 py-3 font-semibold text-black whitespace-nowrap">
                  {campName}
                </td>
                {visibleWeeks.map(([weekId]) => {
                  const slots = grid[campId]?.[weekId] ?? [];
                  return (
                    <td key={weekId} className="border-r border-black/10 px-2 py-2 align-top">
                      {slots.length === 0 ? (
                        <span className="text-xs text-black/20">—</span>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {slots.map((slot) => (
                            <SlotCell
                              key={slot.id}
                              slot={slot}
                              onSaved={handleSaved}
                              adminKey={adminKey}
                            />
                          ))}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-black/30">
        Each cell shows one chip per package. Click a chip to open the inline editor.
      </p>
    </div>
  );
}
