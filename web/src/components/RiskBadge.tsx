import { RISK_LABELS, RISK_STYLES } from "@/lib/format";

export default function RiskBadge({ level }: { level: number }) {
  const i = Math.min(Math.max(level, 1), 5) - 1;
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${RISK_STYLES[i]}`}>
      Risk: {RISK_LABELS[i]}
    </span>
  );
}
