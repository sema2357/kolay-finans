import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { CompareProvider } from "@/components/CompareProvider";
import CompareBar from "@/components/CompareBar";

export const metadata: Metadata = {
  title: "Kolay Finans – Katılım Finans Ürün Keşif Platformu",
  description:
    "Katılım bankalarının ürünlerini ihtiyacına göre keşfet, paranın nasıl işlediğini anla, ürünleri karşılaştır.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <CompareProvider>
          <div className="bg-amber-100 px-4 py-2 text-center text-xs text-amber-900">
            Bu sürümde gösterilen bankalar ve veriler <strong>örnek (demo) verilerdir</strong>; gerçek ürün, oran veya koşul değildir.
          </div>
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
              <Link href="/" className="text-lg font-bold text-brand-700">
                Kolay Finans
              </Link>
              <nav className="flex gap-5 text-sm font-medium text-slate-600">
                <Link href="/degerlendir" className="text-brand-700 hover:text-brand-800">Paramı Değerlendir</Link>
                <Link href="/finansman" className="hover:text-brand-700">Finansman</Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-8 pb-28">{children}</main>
          <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500">
              Bu platform yatırım tavsiyesi vermez, finansman onayı veya kesin ödeme sözü oluşturmaz. Ürünlerin
              işleyişini anlatan bir keşif ve karşılaştırma aracıdır. Güncel ve bağlayıcı koşullar için bankanın resmî
              kaynaklarına başvurunuz.
            </div>
          </footer>
          <CompareBar />
        </CompareProvider>
      </body>
    </html>
  );
}
