"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminClientGuard } from "../admin-client-guard";
import { ApiAdminDesigner, getAdminDesigners, verifyAdminDesigner } from "@/lib/api-client";

export default function AdminDesignersPage() {
  const [designers, setDesigners] = useState<ApiAdminDesigner[]>([]);
  const [status, setStatus] = useState("");

  async function loadDesigners() {
    try {
      setDesigners(await getAdminDesigners());
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not load designers.");
    }
  }

  useEffect(() => {
    queueMicrotask(loadDesigners);
  }, []);

  async function handleVerify(userId: string, action: "approve" | "reject") {
    setStatus("");
    try {
      await verifyAdminDesigner(userId, action);
      setStatus(action === "approve" ? "Designer approved." : "Designer rejected.");
      await loadDesigners();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not update designer.");
    }
  }

  return (
    <>
      <AdminClientGuard />
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Designers</h2>
        <p className="text-gray-600 mt-1">Review seller applications and verification details.</p>
      </div>

      {status && <div className="mb-6 rounded-lg bg-white p-4 text-sm text-gray-700 shadow-sm">{status}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {designers.map((designer) => (
          <div key={designer.id} className="bg-white rounded-lg border p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{designer.user.name}</h3>
                <p className="text-sm text-gray-500">{designer.user.email}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                designer.isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}>
                {designer.isVerified ? "Verified" : "Pending"}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-700 mb-4">
              <p><span className="font-medium">Bio:</span> {designer.bio || "No bio submitted"}</p>
              <p><span className="font-medium">Skills:</span> {designer.skills || "No skills submitted"}</p>
              <p><span className="font-medium">Portfolio:</span> {designer.portfolio || "No portfolio submitted"}</p>
              <p><span className="font-medium">National ID:</span> {designer.nationalId || "Not submitted"}</p>
            </div>

            <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden mb-4">
              {designer.idImage ? (
                <Image src={designer.idImage} alt={`${designer.user.name} ID`} fill className="object-cover" />
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-gray-500">No ID image submitted</div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => handleVerify(designer.userId, "approve")} className="bg-green-600 hover:bg-green-700 text-white">
                <Check className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button onClick={() => handleVerify(designer.userId, "reject")} variant="outline" className="text-red-600 bg-transparent">
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        ))}
        {designers.length === 0 && (
          <div className="bg-white rounded-lg border p-10 text-center text-gray-500">No designer applications found.</div>
        )}
      </div>
    </>
  );
}
