import { beforeEach, vi } from "vitest";

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret-with-enough-length";
process.env.NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
process.env.PAYMENT_PROVIDER = "manual";

beforeEach(() => {
  vi.clearAllMocks();
});
