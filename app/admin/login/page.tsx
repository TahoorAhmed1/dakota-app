"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { setAdminKeyInStorage } from "@/lib/admin-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Try to fetch config with the provided key to validate it
      const response = await fetch("/api/admin/calculator/config", {
        headers: {
          "x-admin-key": apiKey,
        },
      });

      if (!response.ok) {
        setError("Invalid API key. Please try again.");
        setLoading(false);
        return;
      }

      // Store the key and redirect to dashboard
      setAdminKeyInStorage(apiKey);
      router.push("/admin");
    } catch {
      setError("Failed to authenticate. Please check your API key and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#000_0%,#000_58%,#f37021_100%)] px-4">
      <div className="w-full max-w-md rounded-3xl border border-black bg-white p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
        <h1 className="mb-2 text-center text-3xl font-bold text-black">Admin Portal</h1>
        <p className="mb-6 text-center text-black/70">Dakota Hunting Adventures</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="mb-1 block text-sm font-medium text-black">
              Admin API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your admin API key"
              className="w-full rounded-xl border border-black/20 px-4 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-black/60">
              If no key is set, you can access without entering one
            </p>
          </div>

          {error && <div className="rounded-xl border border-orange-400 bg-orange-100 p-3 text-sm text-black">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-orange-500 py-2 font-medium text-black transition hover:bg-orange-400 disabled:bg-black/30 disabled:text-white"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-orange-300 bg-orange-100 p-4 text-sm text-black">
          <p className="font-semibold mb-2">Demo Access:</p>
          <p>Leave the API key field empty to access the admin portal without authentication.</p>
        </div>
      </div>
    </div>
  );
}
