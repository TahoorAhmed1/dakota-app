"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminLoadingState from "@/components/admin/admin-loading-state";
import { getAdminKeyFromStorage } from "@/lib/admin-client";

type WaitlistEntry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  weekPref: string | null;
  notes: string | null;
  createdAt: string;
};

export default function WaitlistPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const adminKey = getAdminKeyFromStorage();
        if (!adminKey) {
          router.push("/admin/login");
          return;
        }
        const res = await fetch("/api/admin/waitlist", {
          headers: { "x-admin-key": adminKey },
        });
        if (!res.ok) throw new Error("Access denied");
        const data = await res.json();
        setEntries(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
        setTimeout(() => router.push("/admin/login"), 2000);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  if (loading) return <AdminLoadingState label="Waitlist" />;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#281703] sm:text-3xl">Waitlist</h1>
          <p className="mt-1 text-sm text-[#281703]/60">{entries.length} entr{entries.length === 1 ? "y" : "ies"}</p>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-xl border border-[#e8ddd2] bg-white px-8 py-12 text-center">
          <p className="text-[#281703]/60">No waitlist entries yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#e8ddd2] bg-white">
          <table className="w-full min-w-175 text-sm">
            <thead>
              <tr className="border-b border-[#e8ddd2] bg-[#fdf8f3]">
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-[#281703]">Name</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-[#281703]">Email</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-[#281703]">Phone</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-[#281703]">Pref. Week</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-[#281703]">Notes</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-[#281703]">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-b border-[#e8ddd2] last:border-0 hover:bg-[#fdf8f3]">
                  <td className="px-5 py-3 font-medium text-[#281703]">{e.name}</td>
                  <td className="px-5 py-3">
                    <a href={`mailto:${e.email}`} className="text-orange-600 hover:underline">
                      {e.email}
                    </a>
                  </td>
                  <td className="px-5 py-3 text-[#281703]/70">{e.phone ?? "—"}</td>
                  <td className="px-5 py-3 text-[#281703]/70">{e.weekPref ?? "—"}</td>
                  <td className="max-w-50 truncate px-5 py-3 text-[#281703]/70" title={e.notes ?? ""}>
                    {e.notes ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-[#281703]/60">
                    {new Date(e.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
