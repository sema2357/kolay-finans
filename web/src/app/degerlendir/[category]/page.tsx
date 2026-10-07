import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getBanks, getCategory, getProducts } from "@/lib/api";
import { one } from "@/lib/format";

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const TERMS = [
  ["30", "1 ay"],
  ["90", "3 ay"],
  ["180", "6 ay"],
  ["365", "1 yıl"],
  ["730", "2 yıl"],
];

const RISKS = [
  ["1", "Çok düşük"],
  ["2", "Düşük"],
  ["3", "Orta"],
  ["4", "Yüksek"],
  ["5", "Çok yüksek"],
];

const inputCls =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none";

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category: slug } = await params;
  const sp = await searchParams;

  const category = await getCategory(slug);
  if (!category) notFound();

  const f = {
    amount: one(sp.amount),
    term_days: one(sp.term_days),
    max_risk: one(sp.max_risk),
    currency: one(sp.currency),
    bank: one(sp.bank),
  };

  const [products, banks] = await Promise.all([
    getProducts({ category: slug, ...f }),
    getBanks(),
  ]);
  const list = products ?? [];
  const hasFilter = Object.values(f).some(Boolean);

  return (
    <div>
      <Link href="/degerlendir" className="text-sm text-slate-500 hover:text-brand-700">
        ← Tüm kategoriler
      </Link>
      <h1 className="mt-2 text-2xl font-bold">
        {category.icon} {category.name}
      </h1>
      <p className="mt-1 text-slate-600">{category.description}</p>

      <form method="get" className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-5">
        <label className="text-sm font-medium">
          Tutar
          <input type="number" name="amount" min="0" step="any" defaultValue={f.amount} placeholder="örn. 50000" className={inputCls} />
        </label>
        <label className="text-sm font-medium">
          Para birimi
          <select name="currency" defaultValue={f.currency ?? ""} className={inputCls}>
            <option value="">Tümü</option>
            <option value="TL">TL</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          Vade
          <select name="term_days" defaultValue={f.term_days ?? ""} className={inputCls}>
            <option value="">Fark etmez</option>
            {TERMS.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          En fazla risk
          <select name="max_risk" defaultValue={f.max_risk ?? ""} className={inputCls}>
            <option value="">Fark etmez</option>
            {RISKS.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Banka
          <select name="bank" defaultValue={f.bank ?? ""} className={inputCls}>
            <option value="">Tümü</option>
            {(banks ?? []).map((b) => (
              <option key={b.slug} value={b.slug}>{b.name}</option>
            ))}
          </select>
        </label>
        <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-5">
          <button type="submit" className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700">
            Ürünleri listele
          </button>
          {hasFilter && (
            <Link href={`/degerlendir/${slug}`} className="text-sm text-slate-600 hover:text-brand-700">
              Filtreleri temizle
            </Link>
          )}
          <span className="ml-auto text-sm text-slate-500">{list.length} ürün bulundu</span>
        </div>
      </form>

      <div className="mt-6 space-y-4">
        {list.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
            Seçtiğin kriterlere uyan ürün bulunamadı. Filtreleri gevşetmeyi dene.
          </p>
        ) : (
          list.map((p) => <ProductCard key={p.slug} product={p} />)
        )}
      </div>
    </div>
  );
}
