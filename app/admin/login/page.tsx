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
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Admin Portal</h1>
        <p className="text-gray-600 text-center mb-6">Dakota Hunting Adventures</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
              Admin API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your admin API key"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              If no key is set, you can access without entering one
            </p>
          </div>

          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
          <p className="font-semibold mb-2">Demo Access:</p>
          <p>Leave the API key field empty to access the admin portal without authentication.</p>
        </div>
      </div>
    </div>
  );
}
