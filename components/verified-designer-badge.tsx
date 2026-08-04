import { BadgeCheck } from "lucide-react";

export function VerifiedDesignerBadge({ isVerified }: { isVerified?: boolean | null }) {
  if (!isVerified) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 align-middle">
      <BadgeCheck className="h-3.5 w-3.5" />
      Verified
    </span>
  );
}
