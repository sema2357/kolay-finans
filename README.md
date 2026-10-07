# Kolay Finans – Katılım Finans Ürün Keşif Platformu

"İhtiyacını seç → Ürünleri gör → Paranın nasıl işlediğini anla → Karşılaştır → Kararını kendin ver."

> Şu an yalnızca **"Paramı değerlendirmek istiyorum"** bölümü var ve **örnek (kurgusal) verilerle** çalışıyor.

## Gereksinim

Sadece **Docker Desktop**. Bilgisayarında Node.js veya Python kurulu olmasına gerek yok; her şey container'larda çalışır.

## Çalıştırma

```powershell
docker compose up --build
```

İlk açılış birkaç dakika sürer (imajlar iner, SQL Server hazırlanır). Sonra:

| Servis | Adres |
|---|---|
| Web sitesi | http://localhost:3000 |
| API dokümantasyonu | http://localhost:8000/docs |
| SQL Server | `localhost,14333` – kullanıcı `sa`, şifre `.env` içinde |

Durdurmak: `Ctrl+C` veya `docker compose down`.
Veritabanını sıfırlayıp örnek veriyi baştan yüklemek: `docker compose down -v`.

## Yapı

```
api/   FastAPI + SQLAlchemy (SQL Server). Tablolar ve örnek veri ilk açılışta otomatik oluşur.
web/   Next.js + TypeScript + Tailwind
```

Kod değişiklikleri (api/ ve web/) container'a canlı yansır; yeniden build gerekmez.
Bağımlılık eklersen (`requirements.txt` / `package.json`) `docker compose up --build` çalıştır.

## Sonraki adımlar

- Finansman bölümü
- LLM ile doğal dil → filtre dönüşümü, ses tanıma
- Gerçek banka verisi ve kaynak doğrulama
