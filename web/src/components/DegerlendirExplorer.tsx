"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CompareButton from "@/components/CompareButton";
import MoneyFlow from "@/components/MoneyFlow";
import RiskBadge from "@/components/RiskBadge";
import type { Bank, Category, Product } from "@/lib/api";
import { formatDate, formatMoney, formatTerm } from "@/lib/format";

type Props = {
  categories: Category[];
  initialProducts: Product[];
  banks: Bank[];
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

  // Kategorileri sırala ve altındaki ürünleri grupla
  const categoryGroups = useMemo(() => {
    return categories.map((cat) => {
      const items = initialProducts.filter((p) => p.category.slug === cat.slug);
      return {
        ...cat,
        products: items,
      };
    });
  }, [categories, initialProducts]);

  // Seçilen detay ürünü (varsa sağ panelde gösterilir)
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
      {/* 1. Üst Başlık & Giriş */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Paramı Değerlendirmek İstiyorum
        </h1>
        <p className="mt-1 text-sm text-slate-600 sm:text-base">
          Tüm katılım finans ürün gruplarını tek bir ekranda inceleyin, kategorileri açarak alt ürünleri karşılaştırın ve paranın nasıl hareket ettiğini görün.
        </p>
      </div>

      {/* 2. Ana Çalışma Alanı: Sol Liste + Sağ Tutar/Hesaplama Paneli */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* SOL: Ürün Grupları (Alt Alta Akordeon / Liste) */}
        <div className="space-y-4 lg:col-span-7 xl:col-span-8">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Ürün Grupları ({categories.length})
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const allOpen = categories.reduce((acc, c) => ({ ...acc, [c.slug]: true }), {});
                  setExpandedCategories(allOpen);
                }}
                className="text-xs text-brand-700 hover:underline"
              >
                Tümünü Aç
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => setExpandedCategories({})}
                className="text-xs text-slate-500 hover:underline"
              >
                Tümünü Kapat
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {categoryGroups.map((group) => {
              const isOpen = !!expandedCategories[group.slug];
              const productCount = group.products.length;

              return (
                <div
                  key={group.slug}
                  className={`overflow-hidden rounded-2xl border transition-all ${
                    isOpen ? "border-brand-200 bg-white shadow-sm ring-1 ring-brand-100" : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  {/* Kategori Başlığı / Açılır Buton */}
                  <button
                    type="button"
                    onClick={() => toggleCategory(group.slug)}
                    className="flex w-full items-center justify-between p-4 text-left transition hover:bg-slate-50/75 sm:p-5"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                        {group.icon}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                            {group.name}
                          </h2>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                            {productCount} ürün
                          </span>
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 sm:text-sm">
                          {group.description}
                        </p>
                      </div>
                    </div>

                    <div className="ml-2 flex items-center gap-2 text-slate-400">
                      <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                        {isOpen ? "Gizle" : "İncele"}
                      </span>
                      <svg
                        className={`h-5 w-5 transform transition-transform duration-200 ${isOpen ? "rotate-180 text-brand-600" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Açılan Kart: Alt Ürünler Listesi */}
                  {isOpen && (
                    <div className="border-t border-slate-100 bg-slate-50/50 p-3 sm:p-4">
                      {productCount === 0 ? (
                        <p className="p-4 text-center text-xs text-slate-500">
                          Bu grupta henüz listelenen ürün bulunmuyor.
                        </p>
                      ) : (
                        <div className="space-y-2.5">
                          {group.products.map((p) => {
                            const isSelected = selectedProductSlug === p.slug;
                            const isEligible = parsedAmount ? p.min_amount <= parsedAmount : true;

                            return (
                              <div
                                key={p.slug}
                                onClick={() => handleSelectProduct(p.slug)}
                                className={`group cursor-pointer rounded-xl border p-4 transition-all ${
                                  isSelected
                                    ? "border-brand-500 bg-white shadow-md ring-2 ring-brand-500/20"
                                    : "border-slate-200 bg-white hover:border-brand-300 hover:shadow-sm"
                                }`}
                              >
                                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                                        {p.bank.name}
                                      </span>
                                      <span className="text-slate-300">•</span>
                                      <span className="text-xs font-medium text-slate-500">
                                        {formatTerm(p.min_term_days, p.max_term_days)}
                                      </span>
                                    </div>
                                    <h3 className="mt-1 text-base font-bold text-slate-900 group-hover:text-brand-700">
                                      {p.name}
                                    </h3>
                                    <p className="mt-1 line-clamp-2 text-xs text-slate-600 sm:text-sm">
                                      {p.summary}
                                    </p>
                                  </div>

                                  <div className="flex shrink-0 items-center justify-between gap-2 sm:flex-col sm:items-end">
                                    <RiskBadge level={p.risk_level} />
                                    <span className="text-xs font-medium text-slate-500">
                                      Min: {formatMoney(p.min_amount, p.currency)}
                                    </span>
                                  </div>
                                </div>

                                {/* Ürün Alt Bilgisi & Eylem Çubuğu */}
                                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                                  <div className="text-xs text-slate-500">
                                    <strong className="text-slate-700">Getiri Yapısı:</strong> {p.return_type}
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`text-xs font-semibold ${
                                        isSelected ? "text-brand-700" : "text-slate-600 group-hover:text-brand-600"
                                      }`}
                                    >
                                      {isSelected ? "Detaylar Açık ✓" : "Paran Ne Olacak? →"}
                                    </span>
                                    <div onClick={(e) => e.stopPropagation()}>
                                      <CompareButton slug={p.slug} />
                                    </div>
                                  </div>
                                </div>

                                {/* Tutar Uyarısı */}
                                {parsedAmount && !isEligible && (
                                  <div className="mt-2 rounded-lg bg-amber-50 px-2.5 py-1 text-xs text-amber-800">
                                    Girdiğiniz tutar ({formatMoney(parsedAmount, selectedCurrency)}) bu ürünün minimum tutarının ({formatMoney(p.min_amount, p.currency)}) altında.
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SAĞ: Tutar Girişi & "Paran Ne Olacak?" Detay Paneli */}
        <div className="space-y-4 lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6">
          {/* Tutar Giriş Kartı */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">Değerlendirmek İstediğiniz Tutar</h3>
            <p className="mt-1 text-xs text-slate-500">
              Ne kadar birikimle işlem yapmayı düşünüyorsunuz? Tutarınızı belirterek şartları anında görün.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Tutar</label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    placeholder="Örn. 50000"
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-3 pr-16 text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="absolute inset-y-1 right-1 rounded-lg border-0 bg-slate-100 px-2.5 text-xs font-bold text-slate-700 focus:ring-0"
                  >
                    <option value="TL">TL</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              {/* Hızlı Tutar Seçenekleri */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["10000", "25000", "50000", "100000", "250000"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmountInput(preset)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                      amountInput === preset
                        ? "bg-brand-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {parseInt(preset).toLocaleString("tr-TR")} ₺
                  </button>
                ))}
              </div>

              {parsedAmount && (
                <div className="rounded-xl bg-brand-50 p-3 text-xs text-brand-900">
                  <div className="font-semibold">Girilen Tutar:</div>
                  <div className="text-lg font-bold text-brand-700">
                    {formatMoney(parsedAmount, selectedCurrency)}
                  </div>
                  <div className="mt-1 text-brand-700/80">
                    Seçtiğiniz ürünlerde bu tutarın uygunluğunu ve para akışını inceleyebilirsiniz.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Aktif Seçilen Ürünün "Paran Ne Olacak?" Detayı */}
          {activeProduct ? (
            <div className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm space-y-4 animate-in fade-in">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-semibold uppercase text-brand-700">
                    {activeProduct.bank.name}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{activeProduct.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProductSlug(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  title="Detayı Kapat"
                >
                  ✕
                </button>
              </div>

              {/* Para Akışı Akordeon / Zaman Çizelgesi */}
              {(() => {
                const currentCategory = categories.find((c) => c.slug === activeProduct.category.slug);
                const steps = currentCategory?.flow_steps && currentCategory.flow_steps.length > 0
                  ? currentCategory.flow_steps
                  : [
                      { icon: "💰", title: "Paranı yatır", description: "Belirlenen tutar hesaba/fona aktarılır." },
                      { icon: "🏦", title: "Faaliyette kullanılır", description: "Faizsiz bankacılık ilkelerine uygun yönetilir." },
                      { icon: "✅", title: "Sonuç yansır", description: "Elde edilen sonuç hesabına yansır." },
                    ];
                return <MoneyFlow title="Paranı yatırdığında ne olacak?" steps={steps} />;
              })()}

              {/* Önemli Bilgiler */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Vade:</span>
                  <span className="font-semibold text-slate-800">
                    {formatTerm(activeProduct.min_term_days, activeProduct.max_term_days)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Getiri Bilgisi:</span>
                  <span className="font-semibold text-slate-800">{activeProduct.return_info}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Risk Durumu:</span>
                  <span className="font-semibold text-slate-800">
                    <RiskBadge level={activeProduct.risk_level} />
                  </span>
                </div>
              </div>

              {/* Alt Butonlar */}
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href={`/urun/${activeProduct.slug}`}
                  className="w-full rounded-xl border border-brand-300 bg-brand-50 py-2.5 text-center text-xs font-bold text-brand-700 hover:bg-brand-100"
                >
                  Tam Ürün Sayfasını Aç ↗
                </Link>
                <div className="flex gap-2">
                  <CompareButton slug={activeProduct.slug} />
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Bu bir demo projesidir. Gerçek ortamda bankanın resmî başvuru adresine yönlendirilir.");
                    }}
                    className="flex-1 rounded-xl bg-slate-900 py-2 text-center text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    Resmî Bilgi ↗
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                🔍
              </div>
              <h4 className="mt-3 text-sm font-bold text-slate-800">Ürün Seçilmedi</h4>
              <p className="mt-1 text-xs text-slate-500">
                Sol taraftaki listeden bir ürün grubunu açıp herhangi bir ürüne tıklayarak <strong>“Paran ne olacak?”</strong> akışını ve şartları burada görüntüleyebilirsiniz.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
