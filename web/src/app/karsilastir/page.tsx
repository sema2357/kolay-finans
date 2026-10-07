import Link from "next/link";
import RiskBadge from "@/components/RiskBadge";
import { getCompare } from "@/lib/api";
import { formatMoney, formatTerm, one } from "@/lib/format";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ComparePage({ searchParams }: Props) {
  const sp = await searchParams;
  const slugs = (one(sp.slugs) ?? "").split(",").filter(Boolean);
  const products = slugs.length ? ((await getCompare(slugs)) ?? []) : [];

  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold">Karşılaştırılacak ürün seçilmedi</h1>
        <p className="mt-2 text-slate-600">Ürün listesinden “+ Karşılaştır” ile ürünleri ekle.</p>
        <Link href="/degerlendir" className="mt-4 inline-block font-semibold text-brand-700">
          Ürünleri keşfet →
        </Link>
      </div>
    );
  }

  const rows: [string, (p: (typeof products)[number]) => React.ReactNode][] = [
    ["Banka", (p) => p.bank.name],
    ["Kategori", (p) => `${p.category.icon} ${p.category.name}`],
    ["Risk", (p) => <RiskBadge level={p.risk_level} />],
    ["Minimum tutar", (p) => formatMoney(p.min_amount, p.currency)],
    ["Maksimum tutar", (p) => (p.max_amount ? formatMoney(p.max_amount, p.currency) : "Sınır yok")],
    ["Vade", (p) => formatTerm(p.min_term_days, p.max_term_days)],
    ["Getiri yapısı", (p) => p.return_type],
    ["Getiri bilgisi", (p) => p.return_info],
    ["Masraflar", (p) => p.fees ?? "Belirtilmemiş"],
    [
      "Para nasıl işler?",
      (p) => (
        <ol className="list-inside list-decimal space-y-1 text-left">
          {p.flow_steps.map((s) => (
            <li key={s.title}>{s.title}</li>
          ))}
        </ol>
      ),
    ],
    ["Kaynak", (p) => (p.verified ? "Doğrulandı" : "Henüz doğrulanmadı")],
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Ürün karşılaştırma</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left">
              <th className="w-40 p-4" />
              {products.map((p) => (
                <th key={p.slug} className="p-4 align-top">
                  <Link href={`/urun/${p.slug}`} className="font-semibold text-brand-700 hover:underline">
                    {p.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map(([label, render]) => (
              <tr key={label}>
                <th className="p-4 text-left align-top font-medium text-slate-500">{label}</th>
                {products.map((p) => (
                  <td key={p.slug} className="p-4 align-top">
                    {render(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th className="p-4 text-left align-top font-medium text-slate-500">Resmî site</th>
              {products.map((p) => (
                <td key={p.slug} className="p-4 align-top">
                  <a href={p.official_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-700 hover:underline">
                    Resmî siteye git ↗
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-slate-500">
        Karşılaştırma bilgi amaçlıdır; “hangisini seçmelisin?” sorusunun cevabını vermez. Kararı sen verirsin.
      </p>
    </div>
  );
}
