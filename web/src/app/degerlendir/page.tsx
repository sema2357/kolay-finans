import Link from "next/link";
import { getCategories } from "@/lib/api";

export default async function DegerlendirPage() {
  const categories = (await getCategories()) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold">Paranı hangi tür üründe değerlendirmek istersin?</h1>
      <p className="mt-2 text-slate-600">Bir kategori seç; tutar, vade ve risk filtreleriyle ürünleri daralt.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/degerlendir/${c.slug}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-500 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">{c.icon}</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
                {c.product_count} ürün
              </span>
            </div>
            <h2 className="mt-3 text-lg font-semibold">{c.name}</h2>
            <p className="mt-1 text-sm text-slate-600">{c.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
