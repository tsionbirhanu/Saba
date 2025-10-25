import jwt from "jsonwebtoken";

export async function verifyToken(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    return decoded as { id: string; email: string };
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}
