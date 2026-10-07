import Link from "next/link";

export default function Home() {
  return (
    <div>
      <section className="py-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Ne yapmak istiyorsun?</h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Katılım finans ürünlerini keşfet, paranın bu ürünlerde nasıl işlediğini anla, ürünleri karşılaştır ve
          kararını kendin ver.
        </p>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <Link
          href="/degerlendir"
          className="group rounded-2xl border-2 border-brand-100 bg-white p-8 shadow-sm transition hover:border-brand-500 hover:shadow-md"
        >
          <div className="text-4xl">💰</div>
          <h2 className="mt-4 text-xl font-bold group-hover:text-brand-700">Paramı değerlendirmek istiyorum</h2>
          <p className="mt-2 text-sm text-slate-600">
            Katılma hesapları, altın, katılım fonları, kira sertifikaları ve diğer birikim ürünleri.
          </p>
          <span className="mt-4 inline-block text-sm font-semibold text-brand-700">Ürünleri keşfet →</span>
        </Link>

        <Link
          href="/finansman"
          className="group rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-sm transition hover:border-slate-400"
        >
          <div className="text-4xl">🏠</div>
          <h2 className="mt-4 text-xl font-bold">Finansman kullanmak istiyorum</h2>
          <p className="mt-2 text-sm text-slate-600">Ev, araç, ihtiyaç veya ticari amaçlı finansman ürünleri.</p>
          <span className="mt-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Yakında
          </span>
        </Link>
      </div>

      <section className="mt-14">
        <h2 className="text-center text-lg font-semibold">Nasıl çalışır?</h2>
        <ol className="mt-6 grid gap-4 text-sm sm:grid-cols-4">
          {[
            ["1", "İhtiyacını seç", "Ne için ve ne kadar para?"],
            ["2", "Ürünleri gör", "Kriterlerine uyan ürünler listelenir."],
            ["3", "Paranın işleyişini anla", "Paran bu ürüne girince ne olur?"],
            ["4", "Karşılaştır, kararını ver", "Kaynağı incele, resmî siteye git."],
          ].map(([n, t, d]) => (
            <li key={n} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                {n}
              </span>
              <p className="mt-3 font-semibold">{t}</p>
              <p className="mt-1 text-slate-600">{d}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
