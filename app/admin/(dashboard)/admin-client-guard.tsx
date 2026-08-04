"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AdminClientGuard() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    try {
      const parsed = user ? JSON.parse(user) : null;
      if (!token || parsed?.role !== "ADMIN") {
        router.replace("/login");
      }
    } catch {
      router.replace("/login");
    }
  }, [router]);

  return null;
}
