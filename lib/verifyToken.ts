import { requireAuth } from "@/lib/auth";

export async function verifyToken(req: Request) {
  const auth = requireAuth(req);
  return auth.user ?? null;
}
