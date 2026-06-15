"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminLoadingState from "@/components/admin/admin-loading-state";
import { clearAdminKey, getAdminKeyFromStorage } from "@/lib/admin-client";

type NewsletterSubscriber = {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export default function AdminNewsletterPage() {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const adminKey = getAdminKeyFromStorage();
        const res = await fetch("/api/admin/newsletter", {
          headers: adminKey ? { "x-admin-key": adminKey } : {},
        });

        if (!res.ok) {
          throw new Error("Access denied");
        }

        const data = await res.json();
        setSubscribers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load subscribers");
        clearAdminKey();
        router.push("/admin/login");
        return;
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  if (loading) {
    return <AdminLoadingState label="Newsletter subscribers" />;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-black">Newsletter Subscribers</h2>
          <p className="mt-1 text-sm text-black/70">
            {subscribers.length} subscribed {subscribers.length === 1 ? "email" : "emails"}
          </p>
        </div>
      </div>

      {subscribers.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white px-8 py-12 text-center shadow-[0_12px_28px_rgba(0,0,0,0.06)]">
          <p className="text-black/60">No newsletter subscribers yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-[0_12px_28px_rgba(0,0,0,0.06)]">
          <table className="w-full min-w-130 text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-[#fff7ef]">
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-black">Email</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-black">Subscribed</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-black">Updated</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="border-b border-black/5 last:border-0 hover:bg-[#fffaf4]">
                  <td className="px-5 py-3 font-medium text-black">
                    <a href={`mailto:${subscriber.email}`} className="text-orange-600 hover:underline">
                      {subscriber.email}
                    </a>
                  </td>
                  <td className="px-5 py-3 text-black/70">
                    {new Date(subscriber.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3 text-black/70">
                    {new Date(subscriber.updatedAt).toLocaleDateString("en-US", {
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