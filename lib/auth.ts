import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { getJwtSecret } from "@/lib/jwt";

export type Role = "BUYER" | "DESIGNER" | "ADMIN";

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
};

type AuthSuccess = {
  user: AuthUser;
  response?: never;
};

type AuthFailure = {
  user?: never;
  response: NextResponse;
};

export type AuthResult = AuthSuccess | AuthFailure;

export function requireAuth(req: Request, allowedRoles?: Role[]): AuthResult {
  const authHeader = req.headers.get("authorization");
  const [scheme, token] = authHeader?.split(" ") ?? [];

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return {
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as Partial<AuthUser>;

    if (!decoded.id || !decoded.email || !decoded.role) {
      return {
        response: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
      };
    }

    const user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    } as AuthUser;

    if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
      return {
        response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      };
    }

    return { user };
  } catch {
    return {
      response: NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      ),
    };
  }
}

export function getOptionalAuthUser(req: Request): AuthUser | null {
  const authHeader = req.headers.get("authorization");
  const [scheme, token] = authHeader?.split(" ") ?? [];

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as Partial<AuthUser>;
    if (!decoded.id || !decoded.email || !decoded.role) return null;
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    } as AuthUser;
  } catch {
    return null;
  }
}
