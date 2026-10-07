import Link from "next/link";
import type { Product } from "@/lib/api";
import { formatMoney, formatTerm } from "@/lib/format";
import CompareButton from "./CompareButton";
import RiskBadge from "./RiskBadge";

export default function ProductCard({ product: p }: { product: Product }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{p.bank.name}</p>
          <h3 className="mt-1 text-lg font-semibold">{p.name}</h3>
        </div>
        <RiskBadge level={p.risk_level} />
      </div>

      <p className="mt-2 text-sm text-slate-600">{p.summary}</p>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs text-slate-500">Minimum tutar</dt>
          <dd className="font-medium">{formatMoney(p.min_amount, p.currency)}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Vade</dt>
          <dd className="font-medium">{formatTerm(p.min_term_days, p.max_term_days)}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Getiri yapısı</dt>
          <dd className="font-medium">{p.return_type}</dd>
        </div>
      </dl>

      <p className="mt-3 text-xs text-slate-500">{p.return_info}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/urun/${p.slug}`}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Paran ne olacak?
        </Link>
        <CompareButton slug={p.slug} />
      </div>
    </article>
  );
}
