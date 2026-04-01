// Client-side utilities for admin API calls

export async function fetchAdminConfig(adminKey?: string) {
  const headers: HeadersInit = {};
  if (adminKey) {
    headers["x-admin-key"] = adminKey;
  }
  
  const response = await fetch("/api/admin/calculator/config", { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch admin config: ${response.statusText}`);
  }
  return response.json();
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
