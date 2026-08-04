import jwt from "jsonwebtoken";
import { describe, expect, it, vi } from "vitest";

const mockPrisma = vi.hoisted(() => ({
  designerProfile: {
    findUnique: vi.fn(),
  },
  order: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
  product: {
    findUnique: vi.fn(),
  },
  notification: {
    create: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));

function authHeader(role = "BUYER") {
  const token = jwt.sign({ id: "buyer-1", email: "buyer@example.com", role }, process.env.JWT_SECRET!);
  return { authorization: `Bearer ${token}` };
}

describe("orders API routes", () => {
  it("lists orders for the authenticated buyer", async () => {
    const { GET } = await import("@/app/api/orders/route");
    mockPrisma.designerProfile.findUnique.mockResolvedValue(null);
    mockPrisma.order.findMany.mockResolvedValue([{ id: "order-1", buyerId: "buyer-1" }]);

    const response = await GET(new Request("http://localhost/api/orders", { headers: authHeader() }) as never);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ orders: [{ id: "order-1" }] });
    expect(mockPrisma.order.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([expect.objectContaining({ buyerId: "buyer-1" })]),
        }),
      })
    );
  });

  it("creates a pending order from a real product", async () => {
    const { POST } = await import("@/app/api/orders/route");
    mockPrisma.product.findUnique.mockResolvedValue({
      id: "product-1",
      name: "Seed Dress",
      price: 1000,
      designerProfileId: "designer-profile-1",
      designerProfile: {
        userId: "designer-user-1",
        user: { email: "designer@example.com" },
      },
    });
    mockPrisma.order.create.mockResolvedValue({ id: "order-2", status: "PENDING" });
    mockPrisma.notification.create.mockResolvedValue({ id: "notification-1" });

    const response = await POST(
      new Request("http://localhost/api/orders", {
        method: "POST",
        headers: { ...authHeader(), "content-type": "application/json" },
        body: JSON.stringify({ productId: "product-1", quantity: 2 }),
      }) as never
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ order: { id: "order-2" } });
    expect(mockPrisma.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: "PENDING",
          totalAmount: 2000,
        }),
      })
    );
  });
});
