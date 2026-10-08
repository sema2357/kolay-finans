const nf = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 });

export function formatMoney(value: number, currency: string) {
  return `${nf.format(value)} ${currency}`;
}

function termLabel(days: number) {
  if (days % 365 === 0) return `${days / 365} yıl`;
  if (days % 30 === 0) return `${days / 30} ay`;
  if (days === 180 || days === 720) return `${Math.round(days / 30)} ay`;
  return `${days} gün`;
}

export function formatTerm(min: number | null, max: number | null) {
  if (min === null && max === null) return "Vadesiz / esnek";
  if (min !== null && max !== null) {
    return min === max ? termLabel(min) : `${termLabel(min)} – ${termLabel(max)}`;
  }
  if (min !== null) return `En az ${termLabel(min)}`;
  return `En fazla ${termLabel(max as number)}`;
}

export const RISK_LABELS = ["Çok düşük", "Düşük", "Orta", "Yüksek", "Çok yüksek"];

export const RISK_STYLES = [
  "bg-emerald-100 text-emerald-800",
  "bg-lime-100 text-lime-800",
  "bg-amber-100 text-amber-800",
  "bg-orange-100 text-orange-800",
  "bg-red-100 text-red-800",
];

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR");
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
