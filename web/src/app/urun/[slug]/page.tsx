import Link from "next/link";
import { notFound } from "next/navigation";
import CompareButton from "@/components/CompareButton";
import MoneyFlow from "@/components/MoneyFlow";
import RiskBadge from "@/components/RiskBadge";
import { getProduct } from "@/lib/api";
import { formatDate, formatDateTime, formatMoney, formatTerm } from "@/lib/format";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();

  const rows: [string, string][] = [
    ["Minimum tutar", formatMoney(p.min_amount, p.currency)],
    ["Maksimum tutar", p.max_amount ? formatMoney(p.max_amount, p.currency) : "Sınır belirtilmemiş"],
    ["Vade", formatTerm(p.min_term_days, p.max_term_days)],
    ["Getiri yapısı", p.return_type],
    ["Getiri bilgisi", p.return_info],
    ["Masraflar", p.fees ?? "Belirtilmemiş"],
  ];

  return (
    <div className="space-y-6">
      <Link href={`/degerlendir/${p.category.slug}`} className="text-sm text-slate-500 hover:text-brand-700">
        ← {p.category.name}
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">{p.bank.name}</p>
          <h1 className="mt-1 text-3xl font-bold">{p.name}</h1>
          <p className="mt-2 max-w-2xl text-slate-600">{p.summary}</p>
        </div>
        <RiskBadge level={p.risk_level} />
      </header>

      <MoneyFlow title="Paranı yatırdığında ne olacak?" steps={p.flow_steps} />

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold">Ürün özellikleri</h2>
          <dl className="mt-4 divide-y divide-slate-100 text-sm">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2">
                <dt className="text-slate-500">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-slate-700">
            {p.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-lg font-bold text-amber-900">Dikkat edilmesi gerekenler</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-amber-900">
            {p.key_risks.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Resmî Kaynak & Güncellik</h2>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200/60">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {p.verified ? "Doğrulanmış Resmî Kaynak" : "İnceleniyor"}
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-600">
          <strong>Kaynak:</strong> {p.source_label}
          <br />
          <strong>Son Doğrulama/Güncelleme:</strong> {formatDateTime(p.fetched_at)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={
              p.category.slug === "katilma-hesaplari"
                ? "https://www.albaraka.com.tr/tr/hesaplama-araclari/kar-payi-hesaplama"
                : p.official_url
            }
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            {p.category.slug === "katilma-hesaplari"
              ? "Albaraka Kâr Payı Hesaplama Aracına Git ↗"
              : "Resmî Sayfayı İncele ↗"}
          </a>
          <a
            href={p.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Ürün İzahnamesi / Detay ↗
          </a>
          <CompareButton slug={p.slug} />
        </div>
      </section>
    </div>
  );
}
