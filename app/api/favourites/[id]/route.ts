// app/api/favourites/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await context.params; // unwrap promise

    const auth = requireAuth(req);
    if (auth.response) return auth.response;
    const userId = auth.user.id;

    const deleted = await prisma.favorite.deleteMany({
      where: { userId, productId },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { message: "Favorite not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Removed from favorites" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing favorite:", error);
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 });
  }
}
