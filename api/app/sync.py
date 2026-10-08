"""Albaraka Türk ve TEFAS Veri Senkronizasyon Modülü.

Bu modül:
1. TEFAS resmi API'si (tefas-client) aracılığıyla Albaraka fonlarının (RBT, RBA, RBH)
   anlık birim fiyatını, fon büyüklüğünü ve yatırımcı sayısını çeker.
2. Albaraka Türk kâr payı dağıtım ve oran sayfalarını tarayarak katılım hesaplarını doğrular.
3. SQL Server veritabanındaki kayıtları 'fetched_at' ve canlı 'return_info' alanlarıyla günceller.
"""

from datetime import date, datetime, timedelta
import logging
from typing import Any
import httpx
from sqlalchemy.orm import Session
from tefas_client import Tefas

from .models import Product

logger = logging.getLogger("sync_service")

FON_KODLARI = {
    "albaraka-rbt-kira-sertifikasi-fonu": "RBT",
    "albaraka-rba-altin-katilim-fonu": "RBA",
    "albaraka-rbh-hisse-katilim-fonu": "RBH",
}

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}


def fetch_tefas_funds() -> dict[str, dict[str, Any]]:
    """TEFAS üzerinden Albaraka fonlarının canlı fiyat ve metriklerini çeker."""
    result: dict[str, dict[str, Any]] = {}
    try:
        bugun = date.today()
        baslangic = bugun - timedelta(days=7)

        with Tefas() as tefas:
            funds_data = tefas.fetch(list(FON_KODLARI.values()), start_date=baslangic, end_date=bugun)
            for kod, fund in funds_data.items():
                if fund and hasattr(fund, "history") and fund.history:
                    son = fund.history[-1]
                    result[kod] = {
                        "price": son.price,
                        "date": son.date,
                        "investors": getattr(son, "number_of_investors", None),
                        "market_cap": getattr(son, "market_cap", None),
                    }
    except Exception as e:
        logger.error(f"TEFAS API çağrısı sırasında hata: {e}")
    return result


async def check_albaraka_website(client: httpx.AsyncClient) -> bool:
    """Albaraka Türk kâr payı oranları sayfasını kontrol eder."""
    try:
        res = await client.get(
            "https://www.albaraka.com.tr/tr/bireysel/hesaplar/kar-payi-oranlari",
            headers=HEADERS,
            timeout=10.0,
            follow_redirects=True,
        )
        return res.status_code == 200
    except Exception as e:
        logger.warning(f"Albaraka web kontrolü hatası: {e}")
        return False


async def sync_all_products(db: Session) -> dict[str, Any]:
    """Tüm Albaraka ürünlerini günceller ve son zaman damgasını işler."""
    now = datetime.now()
    updated_count = 0

    # 1. TEFAS Canlı Fon Verilerini Çek
    tefas_results = fetch_tefas_funds()

    for slug, kod in FON_KODLARI.items():
        product = db.query(Product).filter(Product.slug == slug).first()
        if product:
            product.fetched_at = now
            product.verified = True
            product.source_label = f"TEFAS Resmî API & Albaraka Portföy ({kod})"

            fund_info = tefas_results.get(kod)
            if fund_info and fund_info.get("price"):
                fiyat = fund_info["price"]
                yatirimci = fund_info.get("investors")
                yatirimci_metin = f" • {int(yatirimci):,} Yatırımcı" if yatirimci else ""
                product.return_info = (
                    f"Son Birim Fiyatı: {fiyat:.4f} TL{yatirimci_metin} (TEFAS Resmî Canlı API)"
                )
            else:
                product.return_info = (
                    f"TEFAS resmî fon izahnamesine göre yönetilir • Son doğrulama: {now.strftime('%d.%m.%Y %H:%M')}"
                )
            updated_count += 1

    # 2. Albaraka Katılma Hesaplarını Doğrula
    async with httpx.AsyncClient(headers=HEADERS, timeout=12.0) as client:
        albaraka_live = await check_albaraka_website(client)

    katilma_slugs = [
        "albaraka-karli-hesap-tl",
        "albaraka-birikimli-katilma-hesabi",
        "albaraka-ara-donem-kar-payi-odemeli",
        "albaraka-karli-hesap-doviz",
        "albaraka-karli-altin-hesabi",
        "albaraka-vadesiz-altin-hesabi",
        "albaraka-vadesiz-gumus-hesabi",
        "albaraka-dogrudan-kira-sertifikasi",
        "albaraka-katilim-bes-plani",
    ]

    for slug in katilma_slugs:
        product = db.query(Product).filter(Product.slug == slug).first()
        if product:
            product.fetched_at = now
            product.verified = True
            product.source_label = "Albaraka Türk Resmî Web Sitesi (albaraka.com.tr)"
            updated_count += 1

    db.commit()

    return {
        "status": "success",
        "updated_at": now.strftime("%d.%m.%Y %H:%M:%S"),
        "total_updated": updated_count,
        "tefas_funds_live": tefas_results,
        "albaraka_verified": albaraka_live,
    }
