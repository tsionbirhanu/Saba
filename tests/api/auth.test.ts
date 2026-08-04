import bcrypt from "bcryptjs";
import { describe, expect, it, vi } from "vitest";

const mockPrisma = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  notification: {
    create: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));

describe("auth API routes", () => {
  it("registers a buyer without returning a password", async () => {
    const { POST } = await import("@/app/api/auth/register/route");
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({
      id: "user-1",
      name: "Test Buyer",
      email: "buyer@example.com",
      phoneNumber: null,
      role: "BUYER",
      profileImage: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      designerProfile: null,
      password: "hashed",
    });
    mockPrisma.notification.create.mockResolvedValue({ id: "notification-1" });

    const response = await POST(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Test Buyer",
          email: "buyer@example.com",
          password: "Password123!",
          role: "BUYER",
        }),
      }) as never
    );

    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.user.email).toBe("buyer@example.com");
    expect(body.user.password).toBeUndefined();
    expect(mockPrisma.notification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ type: "ACCOUNT_REGISTERED" }),
      })
    );
  });

  it("rejects ADMIN as a public registration role", async () => {
    const { POST } = await import("@/app/api/auth/register/route");

    const response = await POST(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Bad Actor",
          email: "admin-picker@example.com",
          password: "Password123!",
          role: "ADMIN",
        }),
      }) as never
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: "Invalid role" });
  });

  it("logs in with a valid password and returns a token", async () => {
    const { POST } = await import("@/app/api/auth/login/route");
    const hashed = await bcrypt.hash("Password123!", 10);
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user-2",
      name: "Login Buyer",
      email: "login@example.com",
      password: hashed,
      phoneNumber: null,
      role: "BUYER",
      profileImage: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      designerProfile: null,
    });

    const response = await POST(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "login@example.com", password: "Password123!" }),
      }) as never
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.token).toEqual(expect.any(String));
    expect(body.user.password).toBeUndefined();
  });
});
