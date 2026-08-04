type ChapaInitializeInput = {
  amount: number;
  email: string;
  firstName: string;
  lastName?: string;
  phoneNumber?: string;
  txRef: string;
  callbackUrl: string;
  returnUrl: string;
  customization?: {
    title?: string;
    description?: string;
  };
};

type ChapaInitializeResponse = {
  status: string;
  message: unknown;
  data?: {
    checkout_url?: string;
  };
};

type ChapaVerifyResponse = {
  status: string;
  message: unknown;
  data?: {
    status?: string;
    tx_ref?: string;
    reference?: string;
  };
};

function formatChapaMessage(message: unknown): string | null {
  if (!message) return null;
  if (typeof message === "string") {
    if (message === "validation.email") return "Please enter a real email address for Chapa checkout.";
    return message;
  }
  if (Array.isArray(message)) return message.map(formatChapaMessage).filter(Boolean).join(" ");
  if (typeof message === "object") {
    const values: string[] = Object.values(message as Record<string, unknown>)
      .map(formatChapaMessage)
      .filter((value): value is string => Boolean(value));
    return values.length > 0 ? values.join(" ") : JSON.stringify(message);
  }
  return String(message);
}

function getChapaSecretKey() {
  return process.env.CHAPA_SECRET_KEY;
}

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

function requireChapaSecretKey() {
  const secretKey = getChapaSecretKey();
  if (!secretKey) {
    throw new Error("CHAPA_SECRET_KEY is required when PAYMENT_PROVIDER=chapa.");
  }
  return secretKey;
}

export function isChapaEnabled() {
  return (process.env.PAYMENT_PROVIDER || "manual").toLowerCase() === "chapa";
}

export function getChapaCheckoutPhoneNumber(phoneNumber: string) {
  const configuredTestPhone = process.env.CHAPA_TEST_PHONE_NUMBER;
  if (configuredTestPhone) return configuredTestPhone;

  const secretKey = getChapaSecretKey();
  if (secretKey?.startsWith("CHASECK_TEST")) {
    return "0900123456";
  }

  return phoneNumber;
}

export function buildChapaUrls(txRef: string) {
  const appUrl = getAppUrl().replace(/\/$/, "");
  const encodedRef = encodeURIComponent(txRef);

  return {
    callbackUrl: `${appUrl}/api/payments/chapa/callback?tx_ref=${encodedRef}`,
    returnUrl: `${appUrl}/checkout/success?tx_ref=${encodedRef}`,
  };
}

export async function initializeChapaPayment(input: ChapaInitializeInput) {
  const response = await fetch("https://api.chapa.co/v1/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireChapaSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: String(input.amount),
      currency: "ETB",
      email: input.email,
      first_name: input.firstName,
      last_name: input.lastName || "",
      phone_number: input.phoneNumber,
      tx_ref: input.txRef,
      callback_url: input.callbackUrl,
      return_url: input.returnUrl,
      customization: input.customization,
    }),
  });

  const payload = (await response.json()) as ChapaInitializeResponse;
  if (!response.ok || payload.status !== "success" || !payload.data?.checkout_url) {
    throw new Error(formatChapaMessage(payload.message) || "Could not initialize Chapa checkout.");
  }

  return payload.data.checkout_url;
}

export async function verifyChapaPayment(txRef: string) {
  const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${encodeURIComponent(txRef)}`, {
    headers: {
      Authorization: `Bearer ${requireChapaSecretKey()}`,
    },
  });

  const payload = (await response.json()) as ChapaVerifyResponse;
  if (!response.ok || payload.status !== "success") {
    throw new Error(formatChapaMessage(payload.message) || "Could not verify Chapa payment.");
  }

  return payload;
}
