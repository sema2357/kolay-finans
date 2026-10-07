"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CompareButton from "@/components/CompareButton";
import MoneyFlow from "@/components/MoneyFlow";
import RiskBadge from "@/components/RiskBadge";
import type { Bank, Category, Product } from "@/lib/api";
import { formatMoney, formatTerm } from "@/lib/format";

type Props = {
  categories: Category[];
  initialProducts: Product[];
  banks: Bank[];
};

// Her kategori için özel canlı renk temaları (kartı ayırt etmeyi kolaylaştırır)
const CATEGORY_THEMES: Record<
  string,
  {
    border: string;
    headerBg: string;
    iconBg: string;
    badgeBg: string;
    badgeText: string;
    accentBar: string;
  }
> = {
  "katilma-hesaplari": {
    border: "border-blue-200 hover:border-blue-300",
    headerBg: "hover:bg-blue-50/50",
    iconBg: "bg-blue-100 text-blue-800",
    badgeBg: "bg-blue-50 border border-blue-200",
    badgeText: "text-blue-700",
    accentBar: "bg-blue-600",
  },
  "altin-kiymetli-maden": {
    border: "border-amber-200 hover:border-amber-300",
    headerBg: "hover:bg-amber-50/50",
    iconBg: "bg-amber-100 text-amber-800",
    badgeBg: "bg-amber-50 border border-amber-200",
    badgeText: "text-amber-800",
    accentBar: "bg-amber-500",
  },
  "katilim-fonlari": {
    border: "border-emerald-200 hover:border-emerald-300",
    headerBg: "hover:bg-emerald-50/50",
    iconBg: "bg-emerald-100 text-emerald-800",
    badgeBg: "bg-emerald-50 border border-emerald-200",
    badgeText: "text-emerald-700",
    accentBar: "bg-emerald-600",
  },
  "kira-sertifikalari": {
    border: "border-purple-200 hover:border-purple-300",
    headerBg: "hover:bg-purple-50/50",
    iconBg: "bg-purple-100 text-purple-800",
    badgeBg: "bg-purple-50 border border-purple-200",
    badgeText: "text-purple-700",
    accentBar: "bg-purple-600",
  },
  diger: {
    border: "border-teal-200 hover:border-teal-300",
    headerBg: "hover:bg-teal-50/50",
    iconBg: "bg-teal-100 text-teal-800",
    badgeBg: "bg-teal-50 border border-teal-200",
    badgeText: "text-teal-700",
    accentBar: "bg-teal-600",
  },
};

const DEFAULT_THEME = {
  border: "border-slate-200 hover:border-slate-300",
  headerBg: "hover:bg-slate-50",
  iconBg: "bg-slate-100 text-slate-800",
  badgeBg: "bg-slate-100 border border-slate-200",
  badgeText: "text-slate-700",
  accentBar: "bg-brand-600",
};

export default function DegerlendirExplorer({ categories, initialProducts }: Props) {
  const [amountInput, setAmountInput] = useState<string>("50000");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("TL");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "katilma-hesaplari": true,
  });
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);

  const parsedAmount = useMemo(() => {
    const val = parseFloat(amountInput.replace(/\./g, "").replace(",", "."));
    return isNaN(val) || val <= 0 ? null : val;
  }, [amountInput]);

  const categoryGroups = useMemo(() => {
    return categories.map((cat) => {
      const items = initialProducts.filter((p) => p.category.slug === cat.slug);
      return {
        ...cat,
        products: items,
      };
    });
  }, [categories, initialProducts]);

  const activeProduct = useMemo(() => {
    if (!selectedProductSlug) return null;
    return initialProducts.find((p) => p.slug === selectedProductSlug) || null;
  }, [selectedProductSlug, initialProducts]);

  const toggleCategory = (slug: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const handleSelectProduct = (slug: string) => {
    setSelectedProductSlug((prev) => (prev === slug ? null : slug));
  };

  return (
    <div className="space-y-6">
      {/* 1. Üst Başlık & Açıklama */}
      <div className="flex flex-col gap-2 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Paramı Değerlendirmek İstiyorum
          </h1>
          <p className="mt-0.5 text-xs text-slate-600 sm:text-sm">
            Kategorileri tıklayarak alt ürünleri açın, sağ tarafta tutarınızı girip ürün akışını izleyin.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-lg bg-slate-100 p-1 text-xs sm:self-auto">
          <button
            type="button"
            onClick={() => {
              const allOpen = categories.reduce((acc, c) => ({ ...acc, [c.slug]: true }), {});
              setExpandedCategories(allOpen);
            }}
            className="rounded px-2.5 py-1 font-medium text-slate-700 hover:bg-white hover:shadow-xs"
          >
            Tümünü Aç
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={() => setExpandedCategories({})}
            className="rounded px-2.5 py-1 font-medium text-slate-700 hover:bg-white hover:shadow-xs"
          >
            Tümünü Kapat
          </button>
        </div>
      </div>

      {/* 2. Ana Izgara: Sol Liste + Sağ Yapışkan Panel */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* SOL: İnce, Renkli, Kompakt Kategori & Ürün Listesi */}
        <div className="space-y-3 lg:col-span-7 xl:col-span-8">
          {categoryGroups.map((group) => {
            const isOpen = !!expandedCategories[group.slug];
            const productCount = group.products.length;
            const theme = CATEGORY_THEMES[group.slug] || DEFAULT_THEME;

            return (
              <div
                key={group.slug}
                className={`overflow-hidden rounded-xl border bg-white shadow-2xs transition-all ${
                  isOpen ? `${theme.border} ring-1 ring-slate-100` : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* İnce Kategori Başlık Şeridi */}
                <button
                  type="button"
                  onClick={() => toggleCategory(group.slug)}
                  className={`relative flex w-full items-center justify-between px-3.5 py-2.5 text-left transition ${theme.headerBg}`}
                >
                  {/* Açıkken sol tarafta belirgin renkli dikey çizgi */}
                  {isOpen && (
                    <span className={`absolute inset-y-0 left-0 w-1 ${theme.accentBar}`} aria-hidden />
                  )}

                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg ${theme.iconBg}`}
                    >
                      {group.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                          {group.name}
                        </h2>
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold ${theme.badgeBg} ${theme.badgeText}`}
                        >
                          {productCount} ürün
                        </span>
                      </div>
                      <p className="line-clamp-1 text-xs text-slate-500">
                        {group.description}
                      </p>
                    </div>
                  </div>

                  <div className="ml-2 flex items-center gap-1.5 text-slate-400">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden sm:inline">
                      {isOpen ? "Kapat" : "Aç"}
                    </span>
                    <svg
                      className={`h-4 w-4 transform transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-brand-700" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Açılan Bölüm: İnce ve Seçilebilir Alt Ürün Satırları */}
                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50/60 p-2 sm:p-2.5 space-y-1.5">
                    {productCount === 0 ? (
                      <p className="p-3 text-center text-xs text-slate-500">
                        Bu grupta henüz listelenen ürün bulunmuyor.
                      </p>
                    ) : (
                      group.products.map((p) => {
                        const isSelected = selectedProductSlug === p.slug;
                        const isEligible = parsedAmount ? p.min_amount <= parsedAmount : true;

                        return (
                          <div
                            key={p.slug}
                            onClick={() => handleSelectProduct(p.slug)}
                            className={`group relative cursor-pointer rounded-lg border px-3 py-2.5 transition-all ${
                              isSelected
                                ? "border-brand-500 bg-white shadow-xs ring-2 ring-brand-500/20"
                                : "border-slate-200/80 bg-white hover:border-brand-300 hover:shadow-2xs"
                            }`}
                          >
                            {/* Üst Satır: Banka, İsim, Vade ve Risk Rozeti */}
                            <div className="flex flex-wrap items-center justify-between gap-1.5">
                              <div className="flex items-center gap-2">
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                                  {p.bank.name}
                                </span>
                                <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-700">
                                  {p.name}
                                </h3>
                              </div>

                              <div className="flex items-center gap-2">
                                <RiskBadge level={p.risk_level} />
                                <span className="rounded bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200/60">
                                  {formatTerm(p.min_term_days, p.max_term_days)}
                                </span>
                              </div>
                            </div>

                            {/* İnce Açıklama */}
                            <p className="mt-1 line-clamp-1 text-xs text-slate-600">
                              {p.summary}
                            </p>

                            {/* Alt Çubuk: Min Tutar + Getiri + Aksiyon Butonları */}
                            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 text-xs">
                              <div className="flex items-center gap-3 text-slate-500">
                                <span>
                                  Min: <strong className="text-slate-800">{formatMoney(p.min_amount, p.currency)}</strong>
                                </span>
                                <span className="hidden sm:inline">•</span>
                                <span className="line-clamp-1">
                                  Getiri: <strong className="text-slate-700">{p.return_type}</strong>
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`rounded-md px-2 py-1 text-[11px] font-bold transition ${
                                    isSelected
                                      ? "bg-brand-600 text-white"
                                      : "bg-brand-50 text-brand-700 group-hover:bg-brand-100"
                                  }`}
                                >
                                  {isSelected ? "Detay Açık ✓" : "Paran Ne Olacak? →"}
                                </span>
                                <div onClick={(e) => e.stopPropagation()}>
                                  <CompareButton slug={p.slug} />
                                </div>
                              </div>
                            </div>

                            {/* Tutar Uyarı Şeridi */}
                            {parsedAmount && !isEligible && (
                              <div className="mt-1.5 rounded bg-amber-50 px-2 py-0.5 text-[11px] text-amber-800 border border-amber-200/50">
                                ⚠ Girdiğiniz tutar ({formatMoney(parsedAmount, selectedCurrency)}) bu ürünün minimum tutarının altında.
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* SAĞ: Tutar Paneli + İnce Detay Kartı */}
        <div className="space-y-4 lg:col-span-5 xl:col-span-4 lg:sticky lg:top-5">
          {/* Tutar Giriş Kutusu */}
          <div className="rounded-xl border border-brand-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Yatırım Tutarı</h3>
              <span className="text-[11px] font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                Canlı Uygunluk
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              Değerlendirmek istediğiniz miktarı girin:
            </p>

            <div className="mt-3 space-y-2.5">
              <div className="relative">
                <input
                  type="number"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="Örn. 50000"
                  className="w-full rounded-lg border border-slate-300 py-2 pl-3 pr-16 text-base font-bold text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="absolute inset-y-1 right-1 rounded-md border-0 bg-slate-100 px-2 text-xs font-bold text-slate-700 focus:ring-0"
                >
                  <option value="TL">TL</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              {/* Hızlı Butonlar */}
              <div className="flex flex-wrap gap-1">
                {["10000", "50000", "100000", "250000", "500000"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmountInput(preset)}
                    className={`rounded-md px-2 py-0.5 text-xs font-medium transition ${
                      amountInput === preset
                        ? "bg-brand-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {parseInt(preset) >= 1000 ? `${parseInt(preset) / 1000} Bin ₺` : `${preset} ₺`}
                  </button>
                ))}
              </div>

              {parsedAmount && (
                <div className="rounded-lg bg-emerald-50/80 border border-emerald-200/60 p-2.5 text-xs text-emerald-950 flex items-center justify-between">
                  <span>Hesaplanan Tutar:</span>
                  <span className="text-sm font-bold text-emerald-700">
                    {formatMoney(parsedAmount, selectedCurrency)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Aktif Seçilen Ürün Detayı (Paran Ne Olacak?) */}
          {activeProduct ? (
            <div className="rounded-xl border border-brand-300 bg-white p-4 shadow-sm space-y-3.5">
              <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <span className="rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-800">
                    {activeProduct.bank.name}
                  </span>
                  <h3 className="mt-1 text-base font-bold text-slate-900 leading-tight">
                    {activeProduct.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProductSlug(null)}
                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 text-sm"
                  title="Detayı Kapat"
                >
                  ✕
                </button>
              </div>

              {/* Para Akışı Akordeon / Zaman Çizelgesi */}
              {(() => {
                const currentCategory = categories.find((c) => c.slug === activeProduct.category.slug);
                const steps =
                  currentCategory?.flow_steps && currentCategory.flow_steps.length > 0
                    ? currentCategory.flow_steps
                    : [
                        { icon: "💰", title: "Paranı yatır", description: "Belirlenen tutar hesaba/fona aktarılır." },
                        { icon: "🏦", title: "Faaliyette kullanılır", description: "Faizsiz bankacılık ilkelerine uygun yönetilir." },
                        { icon: "✅", title: "Sonuç yansır", description: "Elde edilen sonuç hesabına yansır." },
                      ];
                return <MoneyFlow title="Paranı yatırdığında ne olacak?" steps={steps} />;
              })()}

              {/* Özellikler tablosu */}
              <div className="divide-y divide-slate-100 rounded-lg border border-slate-100 bg-slate-50/50 p-2 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Vade Şartı:</span>
                  <span className="font-semibold text-slate-800">
                    {formatTerm(activeProduct.min_term_days, activeProduct.max_term_days)}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Getiri Bilgisi:</span>
                  <span className="font-semibold text-slate-800 text-right max-w-[65%]">
                    {activeProduct.return_info}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Risk Seviyesi:</span>
                  <span>
                    <RiskBadge level={activeProduct.risk_level} />
                  </span>
                </div>
              </div>

              {/* Alt Butonlar */}
              <div className="flex gap-2 pt-1">
                <Link
                  href={`/urun/${activeProduct.slug}`}
                  className="flex-1 rounded-lg border border-brand-300 bg-brand-50 py-2 text-center text-xs font-bold text-brand-700 hover:bg-brand-100"
                >
                  Tüm Detayları Gör ↗
                </Link>
                <div onClick={(e) => e.stopPropagation()}>
                  <CompareButton slug={activeProduct.slug} />
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-5 text-center text-slate-500">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow-xs">
                👆
              </div>
              <h4 className="mt-2 text-xs font-bold text-slate-800">Bir Ürün Seçin</h4>
              <p className="mt-1 text-[11px] text-slate-500">
                Sol taraftaki açık kategorilerden herhangi bir ürüne tıklayarak paranızın nasıl işleyeceğini buradan görebilirsiniz.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
