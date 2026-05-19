import { env } from "@/lib/server/env";

type PayPalLink = {
  href: string;
  rel: string;
  method: string;
};

type PayPalOrderResponse = {
  id: string;
  links?: PayPalLink[];
};

type PayPalCaptureResponse = {
  id: string;
  status: string;
};

function getPayPalBaseUrl(): string {
  return env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

async function getPayPalAccessToken(): Promise<string> {
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal client credentials are not configured.");
  }

  const basicAuth = Buffer.from(
    `${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`PayPal token request failed: ${response.status} ${body}`);
  }

  const payload = await response.json();
  if (!payload.access_token) {
    throw new Error("PayPal response did not include an access token.");
  }

  return payload.access_token;
}

export async function createPayPalOrder(
  amount: number,
  returnUrl: string,
  cancelUrl: string
): Promise<{ orderId: string; approvalUrl: string }> {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount.toFixed(2),
          },
        },
      ],
      application_context: {
        brand_name: "UGUIDE",
        landing_page: "BILLING",
        user_action: "PAY_NOW",
        return_url: returnUrl,
        cancel_url: cancelUrl,
        shipping_preference: "NO_SHIPPING",
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`PayPal create order failed: ${response.status} ${body}`);
  }

  const payload = (await response.json()) as PayPalOrderResponse;
  const approvalLink = payload.links?.find((link) => link.rel === "approve")?.href;

  if (!payload.id || !approvalLink) {
    throw new Error("PayPal order response did not include approval link.");
  }

  return {
    orderId: payload.id,
    approvalUrl: approvalLink,
  };
}

export async function capturePayPalOrder(orderId: string): Promise<PayPalCaptureResponse> {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    `${getPayPalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`PayPal capture failed: ${response.status} ${body}`);
  }

  const payload = (await response.json()) as PayPalCaptureResponse;
  return payload;
}
