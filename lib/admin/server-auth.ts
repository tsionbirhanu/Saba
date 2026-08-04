import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "@/lib/jwt";
import type { AuthUser } from "@/lib/auth";

export async function requireAdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const user = jwt.verify(token, getJwtSecret()) as Partial<AuthUser>;
    if (user.role !== "ADMIN") {
      redirect("/login");
    }
    return user as AuthUser;
  } catch {
    redirect("/login");
  }
}
