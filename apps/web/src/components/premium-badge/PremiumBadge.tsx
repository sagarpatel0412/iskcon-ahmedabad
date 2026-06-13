import { Crown } from "lucide-react";

export function PremiumBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
      <Crown className="h-3 w-3" />
      Premium
    </span>
  );
}