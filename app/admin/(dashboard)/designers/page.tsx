"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, ExternalLink, IdCard, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminClientGuard } from "../admin-client-guard";
import { ApiAdminDesigner, getAdminDesigners, verifyAdminDesigner } from "@/lib/api-client";

export default function AdminDesignersPage() {
  const [designers, setDesigners] = useState<ApiAdminDesigner[]>([]);
  const [status, setStatus] = useState("");
  const [busyId, setBusyId] = useState("");

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
    setBusyId(userId);
    try {
      await verifyAdminDesigner(userId, action);
      setStatus(action === "approve" ? "Designer approved." : "Designer rejected.");
      await loadDesigners();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not update designer.");
    } finally {
      setBusyId("");
    }
  }

  const pendingCount = designers.filter((designer) => !designer.isVerified).length;

  return (
    <>
      <AdminClientGuard />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Designers</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-950 sm:text-3xl">Seller Verification</h2>
          <p className="mt-1 text-gray-600">Review submitted National IDs, portfolio details, and seller readiness.</p>
        </div>
        <div className="rounded-lg bg-white px-4 py-3 text-sm shadow-sm ring-1 ring-gray-100">
          <span className="text-gray-500">Pending review: </span>
          <span className="font-bold text-gray-950">{pendingCount}</span>
        </div>
      </div>

      {status && <div className="mb-6 rounded-lg bg-white p-4 text-sm text-gray-700 shadow-sm ring-1 ring-gray-100">{status}</div>}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {designers.map((designer) => (
          <div key={designer.id} className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-950">{designer.user.name}</h3>
                <p className="text-sm text-gray-500">{designer.user.email}</p>
              </div>
              <DesignerStatus isVerified={designer.isVerified} />
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-[1fr_220px]">
              <div className="space-y-4 text-sm">
                <InfoRow label="Bio" value={designer.bio || "No bio submitted"} />
                <InfoRow label="Skills" value={designer.skills || "No skills submitted"} />
                <InfoRow label="Portfolio" value={designer.portfolio || "No portfolio submitted"} isLink={Boolean(designer.portfolio)} />
                <InfoRow label="National ID" value={designer.nationalId || "Not submitted"} />
                <InfoRow label="Submitted" value={new Date(designer.createdAt).toLocaleDateString()} />
              </div>

              <div>
                <div className="relative h-48 overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-100">
                  {designer.idImage ? (
                    <Image src={designer.idImage} alt={`${designer.user.name} ID`} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-sm text-gray-500">
                      <IdCard className="mb-2 h-8 w-8 text-gray-400" />
                      No ID image
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-gray-100 bg-gray-50 p-5">
              <Button
                onClick={() => handleVerify(designer.userId, "approve")}
                disabled={busyId === designer.userId || designer.isVerified}
                className="bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={() => handleVerify(designer.userId, "reject")}
                disabled={busyId === designer.userId}
                variant="outline"
                className="bg-white text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        ))}
        {designers.length === 0 && (
          <div className="rounded-xl bg-white p-12 text-center text-gray-500 shadow-sm ring-1 ring-gray-100">No designer applications found.</div>
        )}
      </div>
    </>
  );
}

function DesignerStatus({ isVerified }: { isVerified: boolean }) {
  return (
    <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
      isVerified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
    }`}>
      {isVerified ? "Verified" : "Pending"}
    </span>
  );
}

function InfoRow({ label, value, isLink = false }: { label: string; value: string; isLink?: boolean }) {
  const href = value.startsWith("http") ? value : `https://${value}`;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      {isLink && value !== "No portfolio submitted" ? (
        <a href={href} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-gray-900 hover:text-primary">
          Portfolio
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ) : (
        <p className="mt-1 text-gray-900">{value}</p>
      )}
    </div>
  );
}
