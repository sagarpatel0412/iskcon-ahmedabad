export const badgeClass = (status?: string) => {
  if (status === "published") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "completed") return "bg-blue-50 text-blue-700 border-blue-200";
  if (status === "cancelled") return "bg-red-50 text-red-700 border-red-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
};

export const posterUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `http://localhost:3000${url}`;
};

export const formatDate = (date?: string) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};