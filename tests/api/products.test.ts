import jwt from "jsonwebtoken";
import { describe, expect, it, vi } from "vitest";

const mockPrisma = vi.hoisted(() => ({
  designerProfile: {
    findUnique: vi.fn(),
  },
  product: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
  review: {
    findMany: vi.fn(),
    groupBy: vi.fn(),
    aggregate: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));

function adminHeader() {
  const token = jwt.sign({ id: "admin-1", email: "admin@example.com", role: "ADMIN" }, process.env.JWT_SECRET!);
  return { authorization: `Bearer ${token}` };
}

describe("products API routes", () => {
  it("filters public product listings to verified designers", async () => {
    const { GET } = await import("@/app/api/products/route");
    mockPrisma.product.findMany.mockResolvedValue([]);
    mockPrisma.review.findMany.mockResolvedValue([]);
    mockPrisma.review.groupBy.mockResolvedValue([]);

    const response = await GET(new Request("http://localhost/api/products") as never);

    expect(response.status).toBe(200);
    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          designerProfile: { isVerified: true },
        }),
      })
    );
  });

  it("allows admins to query a designer profile without the public verified filter", async () => {
    const { GET } = await import("@/app/api/products/route");
    mockPrisma.designerProfile.findUnique.mockResolvedValue({ userId: "designer-user-1" });
    mockPrisma.product.findMany.mockResolvedValue([]);
    mockPrisma.review.findMany.mockResolvedValue([]);
    mockPrisma.review.groupBy.mockResolvedValue([]);

    const response = await GET(
      new Request("http://localhost/api/products?designerProfileId=designer-profile-1", {
        headers: adminHeader(),
      }) as never
    );

    expect(response.status).toBe(200);
    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.not.objectContaining({
          designerProfile: { isVerified: true },
        }),
      })
    );
  });
});
