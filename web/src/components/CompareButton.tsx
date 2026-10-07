"use client";

import { useCompare } from "./CompareProvider";

export default function CompareButton({ slug }: { slug: string }) {
  const { has, toggle, full } = useCompare();
  const active = has(slug);

  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      disabled={!active && full}
      className={
        active
          ? "rounded-lg border border-brand-600 bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700"
          : "rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      }
    >
      {active ? "✓ Karşılaştırmada" : "+ Karşılaştır"}
    </button>
  );
}
