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

  // Ensure all numeric fields are actually numbers
  const sanitizedConfig = {
    ...config,
    pricingRows: (config.pricingRows || []).map((row: any) => ({
      ...row,
      baseRate: Number(row.baseRate) || 0,
      minGroupSize: Number(row.minGroupSize) || 1,
    })),
    volumeRules: (config.volumeRules || []).map((rule: any) => ({
      ...rule,
      minHunters: Number(rule.minHunters) || 1,
      maxHunters: rule.maxHunters ? Number(rule.maxHunters) : null,
      amountOffPerHead: Number(rule.amountOffPerHead) || 0,
      displayOrder: Number(rule.displayOrder) || 0,
    })),
    discountRules: (config.discountRules || []).map((discount: any) => ({
      ...discount,
      value: Number(discount.value) || 0,
      stackOrder: Number(discount.stackOrder) || 0,
    })),
  };

  const response = await fetch("/api/admin/calculator/config", {
    method: "PUT",
    headers,
    body: JSON.stringify(sanitizedConfig),
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
  document.cookie = `admin-key=${encodeURIComponent(key)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Strict`;
}

export function clearAdminKey() {
  localStorage.removeItem("adminKey");
  document.cookie = "admin-key=; path=/; max-age=0; SameSite=Strict";
}
