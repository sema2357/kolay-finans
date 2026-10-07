"use client";

import Link from "next/link";
import { MAX_COMPARE, useCompare } from "./CompareProvider";

export default function CompareBar() {
  const { slugs, clear } = useCompare();
  if (slugs.length === 0) return null;

  const ready = slugs.length >= 2;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <p className="text-sm text-slate-700">
          <strong>{slugs.length}</strong> / {MAX_COMPARE} ürün seçildi
          {!ready && <span className="text-slate-500"> – karşılaştırmak için en az 2 ürün seç</span>}
        </p>
        <div className="flex gap-2">
          <button onClick={clear} className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
            Temizle
          </button>
          {ready ? (
            <Link
              href={`/karsilastir?slugs=${slugs.join(",")}`}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Karşılaştır
            </Link>
          ) : (
            <span className="cursor-not-allowed rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500">
              Karşılaştır
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
