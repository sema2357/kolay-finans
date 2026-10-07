import Link from "next/link";

export default function FinansmanPage() {
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <div className="text-5xl">🏠</div>
      <h1 className="mt-4 text-2xl font-bold">Finansman bölümü yakında</h1>
      <p className="mt-2 text-slate-600">
        Ev, araç, ihtiyaç ve ticari finansman ürünleri bir sonraki aşamada eklenecek.
      </p>
      <Link href="/degerlendir" className="mt-6 inline-block font-semibold text-brand-700">
        Şimdilik "Paramı değerlendirmek istiyorum" bölümüne göz at →
      </Link>
    </div>
  );
}
