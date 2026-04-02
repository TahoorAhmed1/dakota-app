// Client-side utilities for admin API calls

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchAdminConfig(adminKey?: string) {
  const headers: HeadersInit = {};
  if (adminKey) {
    headers["x-admin-key"] = adminKey;
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch("/api/admin/calculator/config", {
      headers,
      cache: "no-store",
    });

    const payload = await response.json().catch(() => ({}));

    if (response.ok) {
      return payload;
    }

    if (response.status === 503 && attempt < 2) {
      await delay(500 * (attempt + 1));
      continue;
    }

    const message =
      (typeof payload?.error === "string" && payload.error) ||
      (typeof payload?.message === "string" && payload.message) ||
      `Failed to fetch admin config: ${response.statusText}`;

    throw new Error(message);
  }

  throw new Error("Failed to fetch admin config.");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateAdminConfig(config: any, adminKey?: string) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (adminKey) {
    headers["x-admin-key"] = adminKey;
  }

  const response = await fetch("/api/admin/calculator/config", {
    method: "PUT",
    headers,
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to update config: ${response.statusText}`);
  }
  return response.json();
}

export function getAdminKeyFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminKey");
}

export function setAdminKeyInStorage(key: string) {
  localStorage.setItem("adminKey", key);
}

export function clearAdminKey() {
  localStorage.removeItem("adminKey");
}
